# ================================================================
# START-TUNNEL.PS1
# ================================================================
# Reads the URL from an already-running Cloudflare tunnel on
# port 5173 and writes it into config.json so the portfolio's
# Live Demo button points to the correct link.
#
# HOW TO USE:
#   1. Make sure the drone dashboard tunnel is already running
#      (the terminal where you ran cloudflared for port 5173)
#   2. Open PowerShell and run:  powershell.exe -File .\start-tunnel.ps1
#
# You need to re-run this script each time cloudflared restarts,
# since the tunnel URL changes every session.
# ================================================================

# --- SETTINGS — change the config path if your folder is named differently ---
$ConfigFile  = "C:\xampp\htdocs\portfolio\assets\config.json"
$MetricsPort = 20241   # cloudflared's local API port (default is 20241)
# -----------------------------------------------------------------------------

Write-Host ""
Write-Host "Reading Cloudflare tunnel URL..." -ForegroundColor Cyan

# cloudflared exposes a local API while running.
# The /quicktunnel endpoint returns the current tunnel URL as JSON.
$apiUrl = "http://localhost:$MetricsPort/quicktunnel"
$tunnelUrl = $null

try {
  $response  = Invoke-RestMethod -Uri $apiUrl -TimeoutSec 5
  $hostname  = $response.hostname
  $tunnelUrl = "https://$hostname"
} catch {
  # API unreachable — cloudflared may use a different metrics port
}

# If the API didn't work, try common alternative ports
if (-not $tunnelUrl) {
  foreach ($port in @(20242, 20243, 8081)) {
    try {
      $response  = Invoke-RestMethod -Uri "http://localhost:$port/quicktunnel" -TimeoutSec 2
      $hostname  = $response.hostname
      $tunnelUrl = "https://$hostname"
      break
    } catch {}
  }
}

# Write result to config.json
if ($tunnelUrl) {
  $json = "{`r`n  `"droneDemo`": `"$tunnelUrl`"`r`n}"
  [System.IO.File]::WriteAllText($ConfigFile, $json, [System.Text.Encoding]::UTF8)

  Write-Host ""
  Write-Host "Success!" -ForegroundColor Green
  Write-Host "  Tunnel URL : $tunnelUrl" -ForegroundColor Green
  Write-Host "  Written to : $ConfigFile" -ForegroundColor Green
  Write-Host ""
  Write-Host "Reload the portfolio page and the Live Demo button will appear."

} else {
  # Fallback — prompt the user to paste the URL manually
  Write-Host ""
  Write-Host "Could not read the tunnel URL automatically." -ForegroundColor Yellow
  Write-Host "Paste the URL printed by cloudflared (e.g. https://abc-xyz.trycloudflare.com):"
  Write-Host ""
  $manual = Read-Host "Tunnel URL"

  if ($manual -match "https://") {
    $json = "{`r`n  `"droneDemo`": `"$manual`"`r`n}"
    [System.IO.File]::WriteAllText($ConfigFile, $json, [System.Text.Encoding]::UTF8)
    Write-Host ""
    Write-Host "Written to $ConfigFile" -ForegroundColor Green
    Write-Host "Reload the portfolio page and the Live Demo button will appear."
  } else {
    Write-Host "No valid URL entered. config.json was not updated." -ForegroundColor Red
  }
}

Write-Host ""
