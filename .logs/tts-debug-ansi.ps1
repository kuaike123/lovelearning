param(
  [string]$OutputPath,
  [string]$Text,
  [int]$Rate
)
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = $Rate
$synth.Volume = 100
$synth.SetOutputToWaveFile($OutputPath)
$synth.Speak($Text)
$synth.Dispose()
Write-Output "done"
