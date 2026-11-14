Write-Host "Starting ShobdoShadhon AI Platform..." -ForegroundColor Cyan

# Start Backend in new process
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

# Start Frontend in current process
cd "$PSScriptRoot\frontend"
npm run dev
