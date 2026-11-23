# 7inOne single-window controller
# Runs server, GitHub auto-sync, live updates and Cloudflare Tunnel in one console.
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location -LiteralPath $RepoRoot
$PollSeconds = 2
$DebounceSeconds = 8
$UpdateIntervalSeconds = 20
$LastFingerprint = ""
$StableSince = Get-Date
$LastRemoteCheck = (Get-Date).AddSeconds(-$UpdateIntervalSeconds)
$Server = $null
$Tunnel = $null

function Invoke-Git {
    param([string[]]$GitArgs)
    $oldPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        $lines = @(& git @GitArgs 2>&1)
        $exitCode = $LASTEXITCODE
        $output = ($lines | ForEach-Object { $_.ToString() }) -join [Environment]::NewLine
    } finally { $ErrorActionPreference = $oldPreference }
    if ($exitCode -ne 0) { throw "git $($GitArgs -join ' ') failed: $output" }
    return $output
}

function Get-ChangeFingerprint {
    $status = Invoke-Git -GitArgs @("status","--porcelain","--untracked-files=all")
    if ([string]::IsNullOrWhiteSpace($status)) { return "" }
    $tracked = Invoke-Git -GitArgs @("diff","--name-only","HEAD")
    $untracked = Invoke-Git -GitArgs @("ls-files","--others","--exclude-standard")
    $paths = @()
    if (-not [string]::IsNullOrWhiteSpace($tracked)) { $paths += [regex]::Split($tracked, '\r?\n') }
    if (-not [string]::IsNullOrWhiteSpace($untracked)) { $paths += [regex]::Split($untracked, '\r?\n') }
    $parts = @($status)
    foreach ($path in @($paths | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)) {
        $fullPath = Join-Path $RepoRoot ($path.Replace("/", [System.IO.Path]::DirectorySeparatorChar))
        if (Test-Path -LiteralPath $fullPath -PathType Leaf) {
            $hash = (Get-FileHash -LiteralPath $fullPath -Algorithm SHA256).Hash
            $parts += "$path=$hash"
        } else { $parts += "$path=DELETED" }
    }
    return ($parts -join [Environment]::NewLine)
}

function Test-SensitiveFiles {
    param([string[]]$Files)
    foreach ($file in $Files) {
        $leaf = [System.IO.Path]::GetFileName($file)
        $isEnvFile = ($leaf -eq ".env" -or ($leaf -like ".env.*" -and $leaf -notin @(".env.example",".env.local.example")))
        $hasSensitiveName = ($leaf -match "(?i)secret|credential|id_rsa|service.account")
        $hasSensitiveExtension = ($leaf -match "(?i)\.(pem|p12|pfx|key)$")
        if ($isEnvFile -or $hasSensitiveName -or $hasSensitiveExtension) { throw "Possible sensitive file detected: $file. Push blocked." }
    }
}

function Invoke-AutoSync {
    Write-Host ([Environment]::NewLine + "[SYNC] Checking local changes and GitHub...") -ForegroundColor Cyan
    $branch = (Invoke-Git -GitArgs @("branch","--show-current")).Trim()
    if ($branch -ne "main") { throw "Current branch is not main. Auto-Sync paused." }
    Invoke-Git -GitArgs @("fetch","origin","main") | Out-Null
    & git merge-base --is-ancestor origin/main HEAD 2>$null
    if ($LASTEXITCODE -ne 0) { throw "GitHub has newer or diverged commits. Auto-Sync paused to protect local work." }
    Invoke-Git -GitArgs @("add","-A") | Out-Null
    $staged = Invoke-Git -GitArgs @("diff","--cached","--name-only")
    $files = @()
    if (-not [string]::IsNullOrWhiteSpace($staged)) {
        $files = @([regex]::Split($staged, '\r?\n') | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    }
    Test-SensitiveFiles -Files $files
    Invoke-Git -GitArgs @("diff","--cached","--check") | Out-Null
    if ($files.Count -gt 0) {
        $message = "Auto-sync: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        Write-Host (Invoke-Git -GitArgs @("commit","-m",$message))
        Write-Host "[SYNC] Local commit created." -ForegroundColor Green
    }
    $ahead = [int](Invoke-Git -GitArgs @("rev-list","--count","origin/main..HEAD")).Trim()
    if ($ahead -gt 0) {
        Write-Host "[SYNC] Pushing changes to GitHub..." -ForegroundColor Cyan
        Write-Host (Invoke-Git -GitArgs @("push","origin","main"))
        Write-Host "[SYNC] GitHub updated successfully." -ForegroundColor Green
    } else { Write-Host "[SYNC] No new commits to push." -ForegroundColor Gray }
}

function Start-AppServer {
    Write-Host "[SERVER] Starting 7inOne..." -ForegroundColor Cyan
    $script:Server = Start-Process -FilePath "node" -ArgumentList @("backend/server.js") -WorkingDirectory $RepoRoot -PassThru -NoNewWindow
    Start-Sleep -Seconds 3
    $script:Server.Refresh()
    if ($script:Server.HasExited) { throw "Node server exited immediately with code $($script:Server.ExitCode)." }
    Write-Host "[SERVER] Running (PID $($script:Server.Id))." -ForegroundColor Green
}

function Stop-ManagedProcess {
    param($Process, [string]$Label)
    if ($Process) {
        try {
            $Process.Refresh()
            if (-not $Process.HasExited) {
                Write-Host "[$Label] Stopping..." -ForegroundColor Yellow
                Stop-Process -Id $Process.Id -Force -ErrorAction SilentlyContinue
                $Process.WaitForExit()
            }
        } catch { Write-Host "[$Label] Process already stopped." -ForegroundColor Gray }
    }
}

function Update-FromGitHub {
    $branch = (Invoke-Git -GitArgs @("branch","--show-current")).Trim()
    if ($branch -ne "main") { throw "Current branch is not main. Live update paused." }
    Invoke-Git -GitArgs @("fetch","origin","main") | Out-Null
    $local = (Invoke-Git -GitArgs @("rev-parse","HEAD")).Trim()
    $remote = (Invoke-Git -GitArgs @("rev-parse","origin/main")).Trim()
    if ($local -eq $remote) { return $false }
    & git merge-base --is-ancestor HEAD origin/main 2>$null
    if ($LASTEXITCODE -eq 0) {
        $status = Invoke-Git -GitArgs @("status","--porcelain","--untracked-files=all")
        if (-not [string]::IsNullOrWhiteSpace($status)) {
            Write-Host "[UPDATE] GitHub has a newer version, but local edits exist. Waiting; nothing will be overwritten." -ForegroundColor Yellow
            return $false
        }
        Write-Host "[UPDATE] New GitHub commit detected. Pulling with fast-forward only..." -ForegroundColor Cyan
        Write-Host (Invoke-Git -GitArgs @("pull","--ff-only","origin","main"))
        Write-Host "[BUILD] Rebuilding CSS..." -ForegroundColor Cyan
        & npm run prebuild
        if ($LASTEXITCODE -ne 0) { throw "CSS build failed. Server restart cancelled." }
        Write-Host "[CHECK] Running project checks..." -ForegroundColor Cyan
        & npm run check
        if ($LASTEXITCODE -ne 0) { throw "Project checks failed. Server restart cancelled." }
        Write-Host "[BUILD] Building production app..." -ForegroundColor Cyan
        & npm run build
        if ($LASTEXITCODE -ne 0) { throw "Production build failed. Server restart cancelled." }
        return $true
    }
    & git merge-base --is-ancestor origin/main HEAD 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[UPDATE] Local main is ahead of GitHub. Keeping local commits." -ForegroundColor Gray
        return $false
    }
    Write-Host "[UPDATE] Local and GitHub have diverged. Automatic update paused; manual reconciliation is required." -ForegroundColor Red
    return $false
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "       7inOne - ONE WINDOW CONTROL CENTER" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Local Server | GitHub Auto-Sync | Live Update | Tunnel"
Write-Host "GitHub update check: every $UpdateIntervalSeconds seconds"
Write-Host "Press CTRL+C once to stop all managed services."
Write-Host "----------------------------------------------------"

try {
    Start-AppServer
    if (Get-Command cloudflared -ErrorAction SilentlyContinue) {
        Write-Host "[TUNNEL] Starting Cloudflare Tunnel..." -ForegroundColor Cyan
        $script:Tunnel = Start-Process -FilePath "cloudflared" -ArgumentList @("tunnel","--url","http://localhost:10000") -WorkingDirectory $RepoRoot -PassThru -NoNewWindow
        Write-Host "[TUNNEL] Running (PID $($script:Tunnel.Id)); copy the trycloudflare.com URL shown above." -ForegroundColor Green
    } else { Write-Host "[TUNNEL] cloudflared not found. Local access remains available." -ForegroundColor Yellow }
    Write-Host "[READY] Open http://localhost:10000/marketplace/index.html#home" -ForegroundColor Green

    while ($true) {
        Start-Sleep -Seconds $PollSeconds
        if ($Server) {
            $Server.Refresh()
            if ($Server.HasExited) {
                Write-Host "[SERVER] Server stopped unexpectedly. Restarting..." -ForegroundColor Yellow
                Start-AppServer
            }
        }

        try {
            $fingerprint = Get-ChangeFingerprint
            if ([string]::IsNullOrEmpty($fingerprint)) { $LastFingerprint = "" }
            elseif ($fingerprint -ne $LastFingerprint) {
                $LastFingerprint = $fingerprint
                $StableSince = Get-Date
                Write-Host "[SYNC] Local edits detected; waiting for editing to finish..." -ForegroundColor Yellow
            } elseif (((Get-Date) - $StableSince).TotalSeconds -ge $DebounceSeconds) {
                Invoke-AutoSync
                $LastFingerprint = ""
                $StableSince = Get-Date
            }
        } catch {
            Write-Host "[SYNC WARNING] $($_.Exception.Message)" -ForegroundColor Red
            $LastFingerprint = ""
            $StableSince = Get-Date
        }

        if (((Get-Date) - $LastRemoteCheck).TotalSeconds -ge $UpdateIntervalSeconds) {
            $LastRemoteCheck = Get-Date
            try {
                if (Update-FromGitHub) {
                    Stop-ManagedProcess -Process $Server -Label "SERVER"
                    $Server = $null
                    Start-AppServer
                    Write-Host "[SUCCESS] Latest GitHub version is now running." -ForegroundColor Green
                }
            } catch {
                Write-Host "[UPDATE WARNING] $($_.Exception.Message)" -ForegroundColor Red
                Write-Host "[UPDATE] Will retry at the next check. Local changes are protected." -ForegroundColor Yellow
            }
        }

        if ($Tunnel) {
            $Tunnel.Refresh()
            if ($Tunnel.HasExited) {
                Write-Host "[TUNNEL] Tunnel process stopped. It will not affect local access." -ForegroundColor Yellow
                $Tunnel = $null
            }
        }
    }
}
finally {
    Write-Host ([Environment]::NewLine + "[STOP] Shutting down 7inOne services...") -ForegroundColor Yellow
    Stop-ManagedProcess -Process $Tunnel -Label "TUNNEL"
    Stop-ManagedProcess -Process $Server -Label "SERVER"
    Write-Host "[STOP] All managed 7inOne processes have been asked to stop." -ForegroundColor Green
}
