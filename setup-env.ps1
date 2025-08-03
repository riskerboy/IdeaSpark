# Get the current directory
$ProjectRoot = Get-Location

# Setup backend
Write-Host "Setting up backend environment..."
Set-Location "$ProjectRoot\backend"

# Remove existing venv if it exists
if (Test-Path "venv") {
    Write-Host "Removing existing virtual environment..."
    Remove-Item -Recurse -Force venv
}

# Create new virtual environment
Write-Host "Creating new virtual environment..."
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..."
& "$ProjectRoot\backend\venv\Scripts\Activate.ps1"

# Install requirements
Write-Host "Installing requirements..."
pip install -r requirements.txt

# Start backend server
Write-Host "Starting backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Set-Location '$ProjectRoot\backend'; & '$ProjectRoot\backend\venv\Scripts\Activate.ps1'; python -m uvicorn main:app --reload }"

# Start frontend server
Write-Host "Starting frontend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Set-Location '$ProjectRoot\frontend'; npm run dev }"

Write-Host "Setup complete! Both servers should be starting..." 