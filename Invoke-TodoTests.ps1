function Invoke-TodoTests {
    <#
    .SYNOPSIS
        Starts the todo app, runs Playwright tests, and validates results.
    .DESCRIPTION
        Starts the http-server, waits for it to be ready, runs all Playwright
        tests, reads results.json, and throws an error if any tests failed.
    #>

    $serverProcess = $null

    try {
        # Install node dependencies
        Write-Host "Installing dependencies..."
        npm install

        # Install Playwright browsers
        Write-Host "Installing Playwright browsers..."
        npx playwright install

        # Start the app server in the background
        Write-Host "Starting todo app server..."
        $serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "serve" -PassThru -NoNewWindow

        # Poll until the server is ready
        $ready = $false
        $attempts = 0
        while (-not $ready -and $attempts -lt 10) {
            Start-Sleep -Seconds 1
            try {
                Invoke-WebRequest -Uri "http://127.0.0.1:7002" -UseBasicParsing -TimeoutSec 2 | Out-Null
                $ready = $true
            } catch {
                $attempts++
            }
        }

        if (-not $ready) {
            throw "Server did not start after 10 seconds."
        }

        Write-Host "Server ready. Running Playwright tests..."

        # Run Playwright tests (results.json is written by the config)
        npx playwright test

        # Read and parse results.json
        $resultsPath = Join-Path $PSScriptRoot "results.json"
        if (-not (Test-Path $resultsPath)) {
            throw "results.json not found at $resultsPath"
        }

        $results = Get-Content $resultsPath -Raw | ConvertFrom-Json
        $failed = $results.stats.unexpected

        if ($failed -gt 0) {
            throw "Test run failed: $failed test(s) did not pass."
        }

        Write-Host "All tests passed."

    } finally {
        # Always stop the server, even if something threw
        if ($null -ne $serverProcess) {
            Write-Host "Stopping server..."
            Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
        }
    }
}
