$outDir = "d:\tech dental z\cloudflare-deploy"
if (Test-Path $outDir) {
    Remove-Item -Recurse -Force $outDir
}
New-Item -ItemType Directory -Path $outDir | Out-Null

# 1. Copy static assets
Copy-Item -Recurse "public\build" "$outDir\build"
if (Test-Path "public\uploads") { Copy-Item -Recurse "public\uploads" "$outDir\uploads" }
if (Test-Path "public\css") { Copy-Item -Recurse "public\css" "$outDir\css" }
if (Test-Path "public\fonts") { Copy-Item -Recurse "public\fonts" "$outDir\fonts" }
if (Test-Path "public\js") { Copy-Item -Recurse "public\js" "$outDir\js" }
if (Test-Path "public\favicon.ico") { Copy-Item "public\favicon.ico" $outDir }
if (Test-Path "public\robots.txt") { Copy-Item "public\robots.txt" $outDir }

# 2. Export HTML pages
$pages = @{
    "index.html" = "http://127.0.0.1:8000/"
    "branch\mirpur\index.html" = "http://127.0.0.1:8000/branch/mirpur"
    "branch\uttara\index.html" = "http://127.0.0.1:8000/branch/uttara"
    "branch\badda\index.html" = "http://127.0.0.1:8000/branch/badda"
    "branch\jatrabari\index.html" = "http://127.0.0.1:8000/branch/jatrabari"
    "branches\index.html" = "http://127.0.0.1:8000/branches"
    "mirpur\index.html" = "http://127.0.0.1:8000/branch/mirpur"
    "uttara\index.html" = "http://127.0.0.1:8000/branch/uttara"
    "badda\index.html" = "http://127.0.0.1:8000/branch/badda"
    "jatrabari\index.html" = "http://127.0.0.1:8000/branch/jatrabari"
}

foreach ($item in $pages.GetEnumerator()) {
    $targetFile = Join-Path $outDir $item.Key
    $targetFolder = Split-Path $targetFile
    if (-not (Test-Path $targetFolder)) {
        New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
    }
    $content = (Invoke-WebRequest -Uri $item.Value -UseBasicParsing).Content
    Set-Content -Path $targetFile -Value $content -Encoding UTF8
    Write-Host "Exported: $($item.Key)"
}

# 3. SPA Fallback for 404 on Cloudflare Pages
Copy-Item "$outDir\index.html" "$outDir\404.html"

# 4. _redirects for Cloudflare Pages (Clean URLs)
$redirectsContent = @"
/branch/mirpur /branch/mirpur/ 200
/branch/uttara /branch/uttara/ 200
/branch/badda /branch/badda/ 200
/branch/jatrabari /branch/jatrabari/ 200
/branches /branches/ 200
/mirpur /mirpur/ 200
/uttara /uttara/ 200
/badda /badda/ 200
/jatrabari /jatrabari/ 200
/* /index.html 200
"@
Set-Content -Path "$outDir\_redirects" -Value $redirectsContent -Encoding UTF8

Write-Host "Cloudflare export completed successfully in $outDir!"

