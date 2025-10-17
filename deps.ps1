# 🔄 Art Vista Gallery - Dependency Management (PowerShell)
# Windows-friendly dependency management script

param(
    [Parameter(Position=0)]
    [ValidateSet("check", "audit", "update", "report", "full")]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [ValidateSet("patch", "minor", "latest")]
    [string]$UpdateType = "minor"
)

$Projects = @("Backend", "FrontEnd")

Write-Host "🔄 Art Vista Gallery - Dependency Management" -ForegroundColor Cyan
Write-Host ""

function Run-InDirectory {
    param($Directory, $Command)
    
    $OriginalPath = Get-Location
    try {
        Set-Location $Directory
        Write-Host "📁 $Directory`: $Command" -ForegroundColor Yellow
        Invoke-Expression $Command
    }
    catch {
        Write-Host "❌ Error in $Directory`: $($_.Exception.Message)" -ForegroundColor Red
    }
    finally {
        Set-Location $OriginalPath
    }
}

function Check-Outdated {
    Write-Host "🔍 Checking for outdated packages..." -ForegroundColor Green
    Write-Host ""
    
    foreach ($Project in $Projects) {
        Write-Host ""
        Write-Host "📦 $Project - Outdated Packages:" -ForegroundColor Magenta
        Write-Host "=" * 50
        
        Run-InDirectory $Project "npm outdated"
    }
}

function Security-Audit {
    Write-Host "🔒 Running Security Audit..." -ForegroundColor Green
    Write-Host ""
    
    foreach ($Project in $Projects) {
        Write-Host ""
        Write-Host "🛡️ $Project - Security Audit:" -ForegroundColor Magenta
        Write-Host "=" * 50
        
        Run-InDirectory $Project "npm audit"
    }
}

function Update-Dependencies {
    param($Type)
    
    $UpdateCommands = @{
        "patch" = "ncu -u --target patch"
        "minor" = "ncu -u --target minor"
        "latest" = "ncu -u"
    }

    Write-Host "⬆️ Updating dependencies ($Type)..." -ForegroundColor Green
    Write-Host ""
    
    foreach ($Project in $Projects) {
        Write-Host ""
        Write-Host "🔄 $Project - Updating $Type versions:" -ForegroundColor Magenta
        Write-Host "=" * 50
        
        Run-InDirectory $Project "ncu --format lines"
        Run-InDirectory $Project $UpdateCommands[$Type]
        Run-InDirectory $Project "npm install"
    }
}

function Generate-Report {
    Write-Host "📊 Generating Dependency Report..." -ForegroundColor Green
    Write-Host ""
    
    $Report = @{
        generated = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
        projects = @{}
    }

    foreach ($Project in $Projects) {
        Write-Host "📋 Analyzing $Project..." -ForegroundColor Yellow
        
        $PackagePath = Join-Path $Project "package.json"
        if (Test-Path $PackagePath) {
            $PackageJson = Get-Content $PackagePath | ConvertFrom-Json
            
            $DepCount = 0
            $DevDepCount = 0
            
            if ($PackageJson.dependencies) {
                $DepCount = ($PackageJson.dependencies | Get-Member -Type NoteProperty).Count
            }
            if ($PackageJson.devDependencies) {
                $DevDepCount = ($PackageJson.devDependencies | Get-Member -Type NoteProperty).Count
            }
            
            $Report.projects[$Project] = @{
                dependencies = $DepCount
                devDependencies = $DevDepCount
                lastUpdated = (Get-Item $PackagePath).LastWriteTime
            }
        }
    }

    $ReportPath = "dependency-report.json"
    $Report | ConvertTo-Json -Depth 3 | Out-File $ReportPath -Encoding UTF8
    Write-Host "📄 Report saved to: $ReportPath" -ForegroundColor Green
}

# Main execution
switch ($Command) {
    "check" {
        Check-Outdated
    }
    "audit" {
        Security-Audit
    }
    "update" {
        Update-Dependencies $UpdateType
    }
    "report" {
        Generate-Report
    }
    "full" {
        Write-Host "🚀 Running full maintenance cycle..." -ForegroundColor Cyan
        Check-Outdated
        Security-Audit
        Generate-Report
    }
    default {
        Write-Host @"
🔄 Dependency Management Commands:

📋 Available Commands:
  .\deps.ps1 check          - Check for outdated packages
  .\deps.ps1 audit          - Run security audit  
  .\deps.ps1 update [type]  - Update dependencies (patch|minor|latest)
  .\deps.ps1 report         - Generate dependency report
  .\deps.ps1 full           - Run complete maintenance cycle

💡 Examples:
  .\deps.ps1 check
  .\deps.ps1 update minor
  .\deps.ps1 audit
  .\deps.ps1 full

🛡️ Security First:
  Always run 'audit' before 'update'
  Use 'patch' updates for production
  Use 'minor' for regular maintenance  
  Use 'latest' only when needed
"@ -ForegroundColor White
    }
}