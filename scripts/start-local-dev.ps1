Param(
    [switch]$SkipNode
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

Write-Host '======================================='
Write-Host ' Project Vault - Local Dev Automation'
Write-Host '======================================='
Write-Host ''

if (-not $SkipNode) {
    Write-Host '🚀 Starting Hardhat node in a new window...'
    Start-Process powershell -ArgumentList '-NoExit','-Command','npx hardhat node' -WorkingDirectory $ProjectRoot -WindowStyle Minimized | Out-Null
    Start-Sleep -Seconds 5
}
else {
    Write-Host '⚠️  SkipNode flag detected. Assuming Hardhat node is already running.'
}

Write-Host '📦 Deploying contract to localhost...'
try {
    $deployOutput = npx hardhat run scripts/deploy.cjs --network localhost
    Write-Host $deployOutput
}
catch {
    Write-Error '❌ Deployment failed. Make sure Hardhat node is running and try again.'
    exit 1
}

$match = [regex]::Match($deployOutput, 'Contract Address:\s*(0x[a-fA-F0-9]{40})')
if (-not $match.Success) {
    Write-Error '❌ Could not parse contract address from deploy output.'
    exit 1
}

$contractAddress = $match.Groups[1].Value

Write-Host ''
Write-Host '🛠  Updating .env with local contract address...'
Set-EnvValue -Key 'VITE_CONTRACT_ADDRESS' -Value $contractAddress
Set-EnvValue -Key 'VITE_USE_LOCALHOST' -Value 'true'

Write-Host '✅ .env updated:'
Write-Host ('   VITE_CONTRACT_ADDRESS={0}' -f $contractAddress)
Write-Host '   VITE_USE_LOCALHOST=true'
Write-Host ''

Write-Host '▶️  Launching Vite dev server (new window)...'
$devCommand = 'npm run dev -- --host 0.0.0.0 --port 5173'
Start-Process powershell -ArgumentList '-NoExit','-Command',$devCommand -WorkingDirectory $ProjectRoot -WindowStyle Normal | Out-Null

Write-Host ''
Write-Host '✨ Local dev environment ready!'
Write-Host '   Hardhat node : separate PowerShell window'
Write-Host '   Dev server   : http://localhost:5173'
Write-Host ('   Contract     : {0}' -f $contractAddress)

