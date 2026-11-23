# 7inOne live GitHub update supervisor
# Polls origin/main while the app is running. Pulls only when the worktree is clean
# and the remote is strictly ahead. Validates builds before restarting the Node server.

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location -LiteralPath $RepoRoot

$PollSeconds = 20
$Server = $null

function Invoke-Git {
    param([string[]]$GitArgs)
    $old = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        $lines = @(& git @GitArgs 2>&1)
        $code = $LASTEXITCODE
        $output = ($lines | ForEach-Object { $_.ToString() }) -join "`n"
    } finally {
        $ErrorActionPreference = $old
    }
    if ($code -ne 0) { throw "git $($GitArgs -join ' ') failed: $output" }
    return $output
}

function Start-AppServer {
    Write-Host "[SERVER] Starting 7inOne Node server..." -ForegroundColor Cyan
    $script:Server = Start-Process -FilePath "node" -ArgumentList @("backend/server.js") -WorkingDirectory $RepoRoot -PassThru -NoNewWindow
    Start-Sleep -Seconds 3
    if ($script:Server.HasExited) {
        throw "Node server exited immediately with code $($script:Server.ExitCode)."
    }
    Write-Host "[SERVER] Running (PID $($script:Server.Id))." -ForegroundColor Green
}

function Stop-AppServer {
    if ($script:Server -and -not $script:Server.HasExited) {
        Write-Host "[SERVER] Stopping old server for safe restart..." -ForegroundColor Yellow
        Stop-Process -Id $script:Server.Id -Force
        $script:Server.WaitForExit()
    }
    $script:Server = $null
}

function Test-CleanWorktree {
    $status = Invoke-Git -GitArgs @("status","--porcelain","--untracked-files=all")
    return [string]::IsNullOrWhiteSpace($status)
}

function Test-RemoteUpdate {
    if ((Invoke-Git -GitArgs @("branch","--show-current")).Trim() -ne "main") {
        throw "Current branch is not main. Live update paused to protect local work."
    }

    Invoke-Git -GitArgs @("fetch","origin","main") | Out-Null
    $local = (Invoke-Git -GitArgs @("rev-parse","HEAD")).Trim()
    $remote = (Invoke-Git -GitArgs @("rev-parse","origin/main")).Trim()

    if ($local -eq $remote) { return $false }

    $localIsAncestor = $true
    & git merge-base --is-ancestor HEAD origin/main 2>$null
    if ($LASTEXITCODE -ne 0) { $localIsAncestor = $false }

    if ($localIsAncestor) {
        if (-not (Test-CleanWorktree)) {
            Write-Host "[UPDATE] GitHub has changes, but local files are modified. Waiting to protect local work." -ForegroundColor Yellow
            return $false
        }
        Write-Host "[UPDATE] New GitHub commit detected. Pulling safely..." -ForegroundColor Cyan
        Invoke-Git -GitArgs @("pull","--ff-only","origin","main") | Write-Host

        Write-Host "[BUILD] Rebuilding marketplace CSS..." -ForegroundColor Cyan
        & npm run prebuild
        if ($LASTEXITCODE -ne 0) { throw "CSS build failed. Existing server remains running; restart was cancelled." }

        Write-Host "[CHECK] Checking project JavaScript..." -ForegroundColor Cyan
        & npm run check
        if ($LASTEXITCODE -ne 0) { throw "Project checks failed. Existing server remains running; restart was cancelled." }

        Write-Host "[BUILD] Building Next.js production app..." -ForegroundColor Cyan
        & npm run build
        if ($LASTEXITCODE -ne 0) { throw "Production build failed. Existing server remains running; restart was cancelled." }

        return $true
    }

    & git merge-base --is-ancestor origin/main HEAD 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[UPDATE] Local main is ahead of GitHub. Leaving local commits untouched." -ForegroundColor Gray
        return $false
    }

    Write-Host "[UPDATE] Local and GitHub have diverged. Automatic update paused; manual reconciliation is required." -ForegroundColor Red
    return $false
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  7inOne LIVE GITHUB UPDATE + SERVER WATCH" -ForegroundColor Cyan
Write-Host "  Checks GitHub every $PollSeconds seconds" -ForegroundColor Cyan
Write-Host "  Press CTRL+C to stop this supervisor" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

try {
    Start-AppServer
    while ($true) {
        Start-Sleep -Seconds $PollSeconds
        try {
            if ($Server -and $Server.HasExited) {
                Write-Host "[SERVER] Server stopped. Restarting..." -ForegroundColor Yellow
                Start-AppServer
            }

            if (Test-RemoteUpdate) {
                Stop-AppServer
                Start-AppServer
                Write-Host "[SUCCESS] Latest GitHub version is running." -ForegroundColor Green
            }
        } catch {
            Write-Host "[LIVE UPDATE WARNING] $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "[LIVE UPDATE] Will retry on the next check. Local changes are not overwritten." -ForegroundColor Yellow
        }
    }
} finally {
    Stop-AppServer
}
