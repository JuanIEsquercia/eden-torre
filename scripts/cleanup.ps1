# PowerShell script to clear Next.js dev server ports and lock file

Write-Host "Cleaning up Next.js environment..."

# 1. Kill Check for ports 3000 and 3001
$ports = 3000, 3001
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $id = $process.OwningProcess
        Write-Host "Killing process $id on port $port"
        Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
    }
}

# 2. Remove lock file
$lockPath = ".next\dev\lock"
if (Test-Path $lockPath) {
    Write-Host "Removing lock file: $lockPath"
    Remove-Item -Path $lockPath -Force -ErrorAction SilentlyContinue
}

Write-Host "Done. You can now run 'npm run dev'."
