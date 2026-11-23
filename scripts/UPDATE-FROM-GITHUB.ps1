# 7inOne - Safe GitHub update before local startup
# Windows PowerShell 5.1 compatible
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location -LiteralPath $RepoRoot

function Invoke-Git {
    param([string[]]$GitArgs)
    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        $output = @(& git @GitArgs 2>&1)
        $code = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousPreference
    }
    $message = ($output | ForEach-Object { $_.ToString() }) -join [Environment]::NewLine
    if ($code -ne 0) {
        throw ("git " + ($GitArgs -join " ") + " failed:" + [Environment]::NewLine + $message)
    }
    return $message
}

try {
    Write-Host "[UPDATE] Checking local repository..." -ForegroundColor Cyan
    $branch = (Invoke-Git -GitArgs @("branch", "--show-current")).Trim()
    if ($branch -ne "main") {
        throw "Current branch is not main. No files were changed."
    }

    # Never pull over local tracked or untracked work.
    $status = Invoke-Git -GitArgs @("status", "--porcelain", "--untracked-files=all")
    if (-not [string]::IsNullOrWhiteSpace($status)) {
        Write-Host $status -ForegroundColor Yellow
        throw "Local changes or untracked files were found. Update stopped to protect your work. Nothing was overwritten."
    }

    Write-Host "[UPDATE] Checking GitHub main..." -ForegroundColor Cyan
    Invoke-Git -GitArgs @("fetch", "origin", "main") | Out-Host

    $localSha = (Invoke-Git -GitArgs @("rev-parse", "HEAD")).Trim()
    $remoteSha = (Invoke-Git -GitArgs @("rev-parse", "origin/main")).Trim()
    if ($localSha -eq $remoteSha) {
        Write-Host "[UPDATE] Already up to date." -ForegroundColor Green
        exit 0
    }

    # If local is behind, only allow a fast-forward update.
    & git merge-base --is-ancestor HEAD origin/main 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[UPDATE] New GitHub version found. Applying safe fast-forward..." -ForegroundColor Cyan
        Invoke-Git -GitArgs @("pull", "--ff-only", "origin", "main") | Out-Host
        Write-Host "[UPDATE] Local project updated successfully." -ForegroundColor Green
        exit 0
    }

    # If local is ahead, keep local commits; Auto-Sync can publish them.
    & git merge-base --is-ancestor origin/main HEAD 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[UPDATE] Local main is ahead of GitHub. Keeping local commits; Auto-Sync can publish them." -ForegroundColor Yellow
        exit 0
    }

    throw "Local main and GitHub main have diverged. Update stopped; manual reconciliation is required. No reset or force-push was performed."
}
catch {
    Write-Host ""
    Write-Host "[UPDATE BLOCKED] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
