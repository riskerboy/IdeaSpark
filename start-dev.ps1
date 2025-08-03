# PowerShell script to start backend and frontend servers for IdeaSpark

# Get the current directory
$ProjectRoot = Get-Location
Write-Host "Project root: $ProjectRoot"

# Verify backend directory exists
$BackendPath = Join-Path $ProjectRoot "backend"
if (-not (Test-Path $BackendPath)) {
    Write-Error "Backend directory not found at $BackendPath"
    exit 1
}

# Verify frontend directory exists
$FrontendPath = Join-Path $ProjectRoot "frontend"
if (-not (Test-Path $FrontendPath)) {
    Write-Error "Frontend directory not found at $FrontendPath"
    exit 1
}

# Start backend in a new window
Write-Host "Starting backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { 
    Write-Host `"Backend process started at $(Get-Date)`";
    Write-Host `"Current directory: $(Get-Location)`";
    Set-Location '$BackendPath';
    Write-Host `"Changed to backend directory: $(Get-Location)`";
    if (-not (Test-Path venv)) {
        Write-Host `"Creating virtual environment...`";
        python -m venv venv;
    }
    Write-Host `"Activating virtual environment...`";
    .\venv\Scripts\Activate.ps1;
    Write-Host `"Installing requirements...`";
    pip install -r requirements.txt;
    Write-Host `"Starting backend server...`";
    python -m uvicorn main:app --reload 
}"

# Start frontend in a new window
Write-Host "Starting frontend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { 
    Write-Host `"Frontend process started at $(Get-Date)`";
    Write-Host `"Current directory: $(Get-Location)`";
    Set-Location '$FrontendPath';
    Write-Host `"Changed to frontend directory: $(Get-Location)`";
    npm run dev 
}"