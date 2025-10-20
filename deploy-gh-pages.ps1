# Script per deploy su GitHub Pages
# Ottimizzato per Windows

Write-Host "Iniziando deploy su GitHub Pages..." -ForegroundColor Cyan

# 1. Salva il branch corrente
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Branch corrente: $currentBranch" -ForegroundColor Yellow

# 2. Crea una cartella temporanea per il deploy
$tempDir = New-Item -ItemType Directory -Force -Path "$env:TEMP\gh-pages-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"
Write-Host "Cartella temporanea: $tempDir" -ForegroundColor Yellow

# 3. Copia i file della build
Write-Host "Copiando file della build..." -ForegroundColor Yellow
Copy-Item -Path "photo-gallery\www\*" -Destination $tempDir -Recurse -Force

# 4. Crea .nojekyll
New-Item -Path "$tempDir\.nojekyll" -ItemType File -Force | Out-Null
Write-Host "File .nojekyll creato" -ForegroundColor Green

# 5. Inizializza repository temporaneo
Push-Location $tempDir
git init
git add -A
git commit -m "Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 6. Push forzato al branch gh-pages
Write-Host "Push al branch gh-pages..." -ForegroundColor Yellow
git remote add origin https://github.com/PecosWhiskey/pecoswhiskey.portfolio.io.git
git branch -M gh-pages
git push -f origin gh-pages

Pop-Location

# 7. Pulizia
Write-Host "Pulizia..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $tempDir

Write-Host "Deploy completato con successo!" -ForegroundColor Green
Write-Host "Il sito sara' disponibile su: https://pecoswhiskey.github.io/pecoswhiskey.portfolio.io/" -ForegroundColor Cyan
Write-Host "Potrebbero essere necessari alcuni minuti per la pubblicazione" -ForegroundColor Yellow
