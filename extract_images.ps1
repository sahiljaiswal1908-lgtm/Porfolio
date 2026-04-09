Add-Type -AssemblyName 'System.IO.Compression.FileSystem'

$pptx = 'c:\Users\lalji\Downloads\Portfolio\Sahil_Jaiswal_Portfolio_v14.pptx'
$outDir = 'c:\Users\lalji\Downloads\Portfolio\images'

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$zip = [System.IO.Compression.ZipFile]::OpenRead($pptx)

foreach ($entry in $zip.Entries) {
    if ($entry.FullName -like 'ppt/media/*' -and $entry.Length -gt 0) {
        $fileName = [System.IO.Path]::GetFileName($entry.FullName)
        $destPath = Join-Path $outDir $fileName
        Write-Output "Extracting: $fileName ($($entry.Length) bytes)"
        $stream = $entry.Open()
        $fileStream = [System.IO.File]::Create($destPath)
        $stream.CopyTo($fileStream)
        $fileStream.Close()
        $stream.Close()
    }
}

$zip.Dispose()
Write-Output "Done! Images saved to $outDir"
