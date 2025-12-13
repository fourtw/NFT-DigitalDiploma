# Script to check PRIVATE_KEY from .env

$ProjectRoot = $PSScriptRoot
if (-not $ProjectRoot) {
    $ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
    if (-not $ProjectRoot) {
        $ProjectRoot = Get-Location
    }
}

$envPath = Join-Path $ProjectRoot '.env'

Write-Host ''
Write-Host '======================================='
Write-Host ' PRIVATE_KEY Checker'
Write-Host '======================================='
Write-Host ''

if (-not (Test-Path $envPath)) {
    Write-Host '❌ .env file not found!' -ForegroundColor Red
    Write-Host "   Expected location: $envPath" -ForegroundColor Yellow
    exit 1
}

$content = Get-Content $envPath
$privateKey = $null

foreach ($line in $content) {
    if ($line -match '^PRIVATE_KEY=(.+)$') {
        $privateKey = $matches[1].Trim()
        break
    }
}

if ($privateKey) {
    Write-Host '✅ PRIVATE_KEY found in .env' -ForegroundColor Green
    
    # Validate format (should be 64 hex chars, with or without 0x)
    $cleanKey = $privateKey -replace '^0x', ''
    if ($cleanKey -match '^[a-fA-F0-9]{64}$') {
        Write-Host '✅ PRIVATE_KEY format is valid (64 hex characters)' -ForegroundColor Green
        
        # Calculate address from private key (using node)
        Write-Host ''
        Write-Host '📋 Calculating wallet address from PRIVATE_KEY...' -ForegroundColor Cyan
        try {
            $nodeScript = @"
const { ethers } = require('ethers');
const privateKey = '$privateKey';
const wallet = new ethers.Wallet(privateKey);
console.log(wallet.address);
"@
            $nodeScript | Out-File -FilePath "$env:TEMP\check-pk.js" -Encoding utf8
            $address = node "$env:TEMP\check-pk.js" 2>&1
            Remove-Item "$env:TEMP\check-pk.js" -ErrorAction SilentlyContinue
            
            if ($address -match '^0x[a-fA-F0-9]{40}$') {
                Write-Host "✅ Wallet Address: $address" -ForegroundColor Green
                Write-Host ''
                Write-Host '💡 This is the address that will be used as contract owner' -ForegroundColor Cyan
                Write-Host '   Make sure to connect this wallet in the frontend!' -ForegroundColor Yellow
            } else {
                Write-Host '⚠️  Could not calculate address from PRIVATE_KEY' -ForegroundColor Yellow
            }
        } catch {
            Write-Host '⚠️  Could not calculate address (node/ethers may not be available)' -ForegroundColor Yellow
        }
    } else {
        Write-Host '❌ PRIVATE_KEY format is invalid!' -ForegroundColor Red
        Write-Host '   Expected: 64 hex characters (with or without 0x prefix)' -ForegroundColor Yellow
        Write-Host "   Got: $($cleanKey.Length) characters" -ForegroundColor Yellow
    }
    
    # Show first/last few chars for verification (don't show full key)
    $displayKey = if ($privateKey.Length -gt 20) {
        $privateKey.Substring(0, 10) + '...' + $privateKey.Substring($privateKey.Length - 10)
    } else {
        '***'
    }
    Write-Host ''
    Write-Host "   Key preview: $displayKey" -ForegroundColor Gray
} else {
    Write-Host '❌ PRIVATE_KEY not found in .env' -ForegroundColor Red
    Write-Host ''
    Write-Host '💡 Add this line to .env:' -ForegroundColor Cyan
    Write-Host '   PRIVATE_KEY=your_private_key_here' -ForegroundColor White
    Write-Host ''
    Write-Host '⚠️  Without PRIVATE_KEY, contract will use Hardhat account #0 as owner' -ForegroundColor Yellow
}

Write-Host ''

