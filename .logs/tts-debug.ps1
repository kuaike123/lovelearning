param(
  [string]$OutputPath,
  [string]$Text
)
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = -1
$synth.Volume = 100
$synth.SetOutputToWaveFile($OutputPath)
$synth.Speak($Text)
$synth.Dispose()
Write-Output "done:$OutputPath"
