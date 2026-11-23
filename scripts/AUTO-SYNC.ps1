
# ============================================================
# 7inOne - GITHUB AUTO SYNC
# Windows PowerShell 5.1 compatible
# Save -> Detect -> Commit -> Push
# ============================================================

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location -LiteralPath $RepoRoot

$Branch = "main"
$DebounceSeconds = 8
$PollSeconds = 2
$RetrySeconds = 10

# ------------------------------------------------------------
# GIT COMMAND HANDLER
# Supports normal Git stderr messages in Windows PowerShell 5.1
# ------------------------------------------------------------

function Get-GitOutput {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$GitArgs
    )

    $previousPreference = $ErrorActionPreference

    try {
        $ErrorActionPreference = "Continue"

        $result = @(& git @GitArgs 2>&1)
        $exitCode = $LASTEXITCODE

        $output = (
            $result | ForEach-Object {
                $_.ToString()
            }
        ) -join "`n"
    }
    finally {
        $ErrorActionPreference = $previousPreference
    }

    if ($exitCode -ne 0) {
        throw "Git command failed: git $($GitArgs -join ' ')`n$output"
    }

    return $output
}

# ------------------------------------------------------------
# GET FILE CHANGE FINGERPRINT
# ------------------------------------------------------------

function Get-ChangeFingerprint {

    $status = Get-GitOutput -GitArgs @(
        "status",
        "--porcelain",
        "--untracked-files=all"
    )

    if ([string]::IsNullOrWhiteSpace($status)) {
        return ""
    }

    $paths = @()

    $tracked = Get-GitOutput -GitArgs @(
        "diff",
        "--name-only",
        "HEAD"
    )

    $untracked = Get-GitOutput -GitArgs @(
        "ls-files",
        "--others",
        "--exclude-standard"
    )

    if (-not [string]::IsNullOrWhiteSpace($tracked)) {
        $paths += [regex]::Split($tracked, '\r?\n')
    }

    if (-not [string]::IsNullOrWhiteSpace($untracked)) {
        $paths += [regex]::Split($untracked, '\r?\n')
    }

    $parts = @($status)

    $uniquePaths = @(
        $paths |
        Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
        Sort-Object -Unique
    )

    foreach ($path in $uniquePaths) {

        $relativePath = $path.Replace(
            "/",
            [System.IO.Path]::DirectorySeparatorChar
        )

        $fullPath = Join-Path -Path $RepoRoot -ChildPath $relativePath

        if (Test-Path -LiteralPath $fullPath -PathType Leaf) {

            $hash = (
                Get-FileHash -LiteralPath $fullPath -Algorithm SHA256
            ).Hash

            $parts += "$path=$hash"
        }
        else {
            $parts += "$path=DELETED"
        }
    }

    return ($parts -join "`n")
}

# ------------------------------------------------------------
# CHECK FOR POSSIBLE SECRET FILES
# ------------------------------------------------------------

function Test-SensitiveFiles {

    param(
        [string[]]$Files
    )

    foreach ($file in $Files) {

        $leaf = [System.IO.Path]::GetFileName($file)

        $isEnvFile = (
            $leaf -eq ".env" -or
            (
                $leaf -like ".env.*" -and
                $leaf -notin @(
                    ".env.example",
                    ".env.local.example"
                )
            )
        )

        $hasSensitiveName = (
            $leaf -match "(?i)secret|credential|id_rsa|service.account"
        )

        $hasSensitiveExtension = (
            $leaf -match "(?i)\.(pem|p12|pfx|key)$"
        )

        if (
            $isEnvFile -or
            $hasSensitiveName -or
            $hasSensitiveExtension
        ) {
            throw "Possible sensitive file detected: $file. Push blocked."
        }
    }
}

# ------------------------------------------------------------
# AUTO SYNC
# ------------------------------------------------------------

function Invoke-AutoSync {

    Write-Host ""
    Write-Host "[SYNC] Checking GitHub..." -ForegroundColor Cyan

    $currentBranch = Get-GitOutput -GitArgs @(
        "branch",
        "--show-current"
    )

    if ($currentBranch -ne $Branch) {
        throw "Wrong branch. Expected main. Auto Sync stopped."
    }

    # Fetch latest GitHub information
    $fetchResult = Get-GitOutput -GitArgs @(
        "fetch",
        "origin",
        $Branch
    )

    if (-not [string]::IsNullOrWhiteSpace($fetchResult)) {
        Write-Host $fetchResult
    }

    # Protect local code if GitHub has newer commits
    $null = & git merge-base --is-ancestor "origin/$Branch" "HEAD" 2>$null
    $ancestorExit = $LASTEXITCODE

    if ($ancestorExit -ne 0) {
        throw "GitHub has newer commits. Sync stopped to protect local code. Update and reconcile first."
    }

    # Stage changes
    Get-GitOutput -GitArgs @(
        "add",
        "-A"
    ) | Out-Null

    # Read staged files
    $staged = Get-GitOutput -GitArgs @(
        "diff",
        "--cached",
        "--name-only"
    )

    $files = @()

    if (-not [string]::IsNullOrWhiteSpace($staged)) {
        $files = @(
            [regex]::Split($staged, '\r?\n') |
            Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        )
    }

    # Security check before commit
    Test-SensitiveFiles -Files $files

    # Check whitespace errors
    Get-GitOutput -GitArgs @(
        "diff",
        "--cached",
        "--check"
    ) | Out-Null

    # Commit only when staged changes exist
    if ($files.Count -gt 0) {

        $message = "Auto-sync: " + (
            Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        )

        $commitResult = Get-GitOutput -GitArgs @(
            "commit",
            "-m",
            $message
        )

        Write-Host $commitResult

        Write-Host "[COMMIT] Local commit created." -ForegroundColor Green
    }

    # Check commits waiting to push
    $aheadText = Get-GitOutput -GitArgs @(
        "rev-list",
        "--count",
        "origin/$Branch..HEAD"
    )

    $ahead = [int]$aheadText.Trim()

    if ($ahead -gt 0) {

        Write-Host "[PUSH] Sending changes to GitHub..." -ForegroundColor Cyan

        $pushResult = Get-GitOutput -GitArgs @(
            "push",
            "origin",
            $Branch
        )

        if (-not [string]::IsNullOrWhiteSpace($pushResult)) {
            Write-Host $pushResult
        }

        Write-Host "[SUCCESS] Changes pushed to GitHub main." -ForegroundColor Green
    }
    else {
        Write-Host "[INFO] No new commits to push." -ForegroundColor Gray
    }
}

# ------------------------------------------------------------
# START WATCHER
# ------------------------------------------------------------

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  7inOne AUTO SYNC - GitHub main" -ForegroundColor Cyan
Write-Host "  Save files -> Commit -> Push" -ForegroundColor Cyan
Write-Host "  Press CTRL+C to stop" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$lastFingerprint = ""
$stableSince = Get-Date

while ($true) {

    try {

        $fingerprint = Get-ChangeFingerprint

        if ([string]::IsNullOrEmpty($fingerprint)) {

            $lastFingerprint = ""
            Start-Sleep -Seconds $PollSeconds
            continue
        }

        if ($fingerprint -ne $lastFingerprint) {

            $lastFingerprint = $fingerprint
            $stableSince = Get-Date

            Write-Host "[DETECTED] Changes found. Waiting for editing to finish..." -ForegroundColor Yellow
        }
        elseif (
            ((Get-Date) - $stableSince).TotalSeconds -ge $DebounceSeconds
        ) {

            Invoke-AutoSync

            $lastFingerprint = ""
            $stableSince = Get-Date
        }
    }
    catch {

        Write-Host ""
        Write-Host "[STOPPED] $($_.Exception.Message)" -ForegroundColor Red

        if ($_.ScriptStackTrace) {
            Write-Host $_.ScriptStackTrace -ForegroundColor Yellow
        }

        $lastFingerprint = ""
        $stableSince = Get-Date

        Start-Sleep -Seconds $RetrySeconds
    }

    Start-Sleep -Seconds $PollSeconds
}
