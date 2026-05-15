# Stop if errors
$ErrorActionPreference = "Stop"

# 1. Create pos-app (Vite + React + TS)
Write-Host "Initializing Vite + React app..."
npm create vite@latest pos-app -- --template react-ts

# 2. Setup Tailwind CSS in pos-app
Write-Host "Setting up Tailwind CSS..."
Set-Location pos-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Modify tailwind.config.js for React
$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
"@
Set-Content -Path tailwind.config.js -Value $tailwindConfig

# Modify index.css
$indexCss = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
  }
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 100%;
  }
}

body {
  @apply bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100;
}
"@
Set-Content -Path src/index.css -Value $indexCss

# Install Tauri
Write-Host "Installing Tauri..."
npm install -D @tauri-apps/cli
npm install @tauri-apps/api

# 3. Create cloud-backend
Write-Host "Initializing FastAPI backend..."
Set-Location ..
if (-not (Test-Path "cloud-backend")) {
    New-Item -ItemType Directory -Name "cloud-backend"
}
Set-Location cloud-backend

# Initialize basic FastAPI file
$fastapiMain = @"
from fastapi import FastAPI

app = FastAPI(title="FlowPilot POS Cloud Sync API")

@app.get("/")
def read_root():
    return {"message": "Welcome to FlowPilot POS Cloud Backend"}
"@
Set-Content -Path main.py -Value $fastapiMain

# Create requirements.txt
$requirements = @"
fastapi
uvicorn
sqlalchemy
psycopg2-binary
pydantic
"@
Set-Content -Path requirements.txt -Value $requirements

Set-Location ..
Write-Host "Phase 1 Initialization Complete!"
