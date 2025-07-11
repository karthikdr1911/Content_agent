# List of required files
$requiredFiles = @(
  "controllers/ideateController.ts",
  "controllers/scriptController.ts",
  "controllers/voiceoverController.ts",
  "controllers/renderController.ts",
  "controllers/googleSheetController.ts",
  "controllers/outputController.ts",
  "controllers/statusController.ts",
  "routes/ideate.ts",
  "routes/script.ts",
  "routes/voiceover.ts",
  "routes/render.ts",
  "routes/googleSheet.ts",
  "routes/output.ts",
  "routes/status.ts",
  "services/openaiService.ts",
  "services/elevenlabsService.ts",
  "services/googleSheetsService.ts",
  "services/ffmpegService.ts",
  "utils/fileUtils.ts",
  "utils/jsonUtils.ts",
  "server.ts",
  "tsconfig.json",
  ".env"
)

# Check each file
foreach ($file in $requiredFiles) {
  if (Test-Path $file) {
    Write-Host "✅ $file"
  } else {
    Write-Host "❌ $file (MISSING)"
  }
}