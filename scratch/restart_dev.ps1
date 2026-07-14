$conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($conn) {
    $pids = $conn.OwningProcess | Select-Object -Unique
    foreach ($pidToKill in $pids) {
        Write-Host "Killing process $pidToKill on port 3000"
        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}
Write-Host "Deleting .next folder..."
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Write-Host ".next folder deleted!"
