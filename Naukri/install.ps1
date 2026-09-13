<#
Naukri Apply - Automated installer for Windows
Run this in PowerShell from the project root.
#>

Write-Host "Naukri Apply - Installer" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan

$projectDir = $PSScriptRoot
Set-Location $projectDir

# 1. Create venv
Write-Host "`n[1/6] Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "  venv already exists, skipping." -ForegroundColor Gray
} else {
    python -m venv venv
    Write-Host "  Created venv" -ForegroundColor Green
}

# 2. Upgrade pip
Write-Host "`n[2/6] Upgrading pip..." -ForegroundColor Yellow
& ".\venv\Scripts\python.exe" -m pip install --upgrade pip -q
Write-Host "  Done" -ForegroundColor Green

# 3. Install dependencies
Write-Host "`n[3/6] Installing Python dependencies..." -ForegroundColor Yellow
& ".\venv\Scripts\python.exe" -m pip install -r requirements.txt -q
Write-Host "  Done" -ForegroundColor Green

# 4. Install Playwright Chromium
Write-Host "`n[4/6] Installing Playwright Chromium..." -ForegroundColor Yellow
& ".\venv\Scripts\python.exe" -m playwright install chromium
Write-Host "  Done" -ForegroundColor Green

# 5. Copy example configs
Write-Host "`n[5/6] Setting up config files..." -ForegroundColor Yellow
$files = @(
    @{ src = ".env.example"; dst = ".env" },
    @{ src = "config.example.json"; dst = "config.json" },
    @{ src = "resume_profile.example.json"; dst = "resume_profile.json" }
)
foreach ($f in $files) {
    if (Test-Path $f.dst) {
        Write-Host "  $($f.dst) exists, skipping." -ForegroundColor Gray
    } else {
        Copy-Item $f.src $f.dst
        Write-Host "  Copied $($f.src) → $($f.dst)" -ForegroundColor Green
    }
}

# 6. Create desktop shortcut
Write-Host "`n[6/6] Creating desktop shortcut..." -ForegroundColor Yellow
$shortcutPath = [Environment]::GetFolderPath("Desktop") + "\Naukri Apply.lnk"
$target = "$projectDir\run.bat"
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "cmd.exe"
$shortcut.Arguments = "/c `"$target`""
$shortcut.WorkingDirectory = $projectDir
$shortcut.IconLocation = "$projectDir\venv\Scripts\python.exe,0"
$shortcut.Description = "Launch Naukri Apply"
$shortcut.Save()
Write-Host "  Created shortcut on Desktop" -ForegroundColor Green

Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "Install complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "`nNext steps:"
Write-Host "  1. Edit .env and add your GEMINI_API_KEY (or use local LLM)"
Write-Host "  2. Edit config.json with your role, location, resume_path"
Write-Host "  3. Run .\run.bat or double-click 'Naukri Apply' on Desktop"
Write-Host "`nFor local LLM: docker compose up -d && docker exec ollama ollama pull llama3.2:1b"