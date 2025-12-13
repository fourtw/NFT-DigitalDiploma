Param(
    [switch]$SkipNode,
    [string]$BindHost = "0.0.0.0",
    [int]$Port = 5173
)

# Determine project root (script located in /scripts)
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptRoot '..')

Set-Location $ProjectRoot

function Ensure-EnvFile {
    $envPath = Join-Path $ProjectRoot '.env'
    if (-not (Test-Path $envPath)) {
        $example = Join-Path $ProjectRoot '.env.example'
        if (Test-Path $example) {
            Copy-Item $example $envPath
            Write-Host '🆕 Created .env from template'
        }
        else {
            '' | Out-File $envPath
            Write-Host '🆕 Created empty .env file'
        }
    }
    return $envPath
}

function Set-EnvValue {
    param(
        [string]$Key,
        [string]$Value
    )

    $envPath = Ensure-EnvFile
    $content = Get-Content $envPath
    $pattern = "^$Key=.*$"
    $line = "$Key=$Value"

    if ($content -match $pattern) {
        $newContent = $content -replace $pattern, $line
    }
    else {
        $newContent = $content + $line
    }

    $newContent | Set-Content $envPath
}

function Is-Hardhat-Running {
    try {
        $conn = Get-NetTCPConnection -LocalPort 8545 -State Listen -ErrorAction Stop
        return $conn -ne $null
    }
    catch {
        # Fallback to netstat if Get-NetTCPConnection unavailable
        $netstat = netstat -ano | Select-String ":8545" | Select-Object -First 1
        return $netstat -ne $null
    }
}

Write-Host '======================================='
Write-Host ' Project Vault - Local Dev Automation'
Write-Host '======================================='
Write-Host ''

# Ensure .env exists with basic config
Ensure-EnvFile | Out-Null
Set-EnvValue -Key 'VITE_USE_LOCALHOST' -Value 'true'

Write-Host '▶️  Starting Vite dev server first...'
Write-Host ('   Host: {0}  Port: {1}' -f $BindHost, $Port)
Write-Host '   (Contract will be deployed in background)' -ForegroundColor Yellow
Write-Host ''

# Start Hardhat + Deploy in background
$deployScript = @"
`$ProjectRoot = '$ProjectRoot'
Set-Location `$ProjectRoot

# Wait a bit for Vite to start
Start-Sleep -Seconds 2

if (-not (Get-NetTCPConnection -LocalPort 8545 -State Listen -ErrorAction SilentlyContinue)) {
    Write-Host '🚀 Starting Hardhat node...' -ForegroundColor Cyan
    Start-Process powershell -ArgumentList '-NoExit','-Command','npx hardhat node' -WorkingDirectory `$ProjectRoot -WindowStyle Minimized | Out-Null
    Start-Sleep -Seconds 5
}

Write-Host '📦 Deploying contract to localhost...' -ForegroundColor Cyan
try {
    `$deployOutput = npx hardhat run scripts/deploy.cjs --network localhost 2>&1
    `$match = [regex]::Match(`$deployOutput, 'Contract Address:\s*(0x[a-fA-F0-9]{40})')
    if (`$match.Success) {
        `$contractAddress = `$match.Groups[1].Value
        `$envPath = Join-Path `$ProjectRoot '.env'
        `$content = Get-Content `$envPath
        `$pattern = '^VITE_CONTRACT_ADDRESS=.*$'
        `$line = "VITE_CONTRACT_ADDRESS=`$contractAddress"
        if (`$content -match `$pattern) {
            `$newContent = `$content -replace `$pattern, `$line
        } else {
            `$newContent = `$content + `$line
        }
        `$newContent | Set-Content `$envPath
        Write-Host "✅ Contract deployed: `$contractAddress" -ForegroundColor Green
        Write-Host "✅ .env updated with contract address" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Deployment failed: `$_" -ForegroundColor Red
}
"@

# Run deploy script in background
Start-Job -ScriptBlock ([scriptblock]::Create($deployScript)) | Out-Null

# Run Vite in foreground (this will block)
npx vite --host $BindHost --port $Port

Write-Host ''
Write-Host '✨ Local dev environment ready!'
Write-Host '   Hardhat node : PowerShell window (if started)'
Write-Host '   Dev server   : http://localhost:{0}' -f $Port
Write-Host ('   Contract     : {0}' -f $contractAddress)

