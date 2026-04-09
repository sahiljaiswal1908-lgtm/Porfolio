$pptx = 'c:\Users\lalji\Downloads\Portfolio\Sahil_Jaiswal_Portfolio_v14.pptx'
Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
$zip = [System.IO.Compression.ZipFile]::OpenRead($pptx)
$entries = $zip.Entries | Where-Object { $_.FullName -like 'ppt/slides/slide*.xml' } | Sort-Object { [int]($_.Name -replace '[^0-9]','') }
foreach ($entry in $entries) {
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = [xml]$reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
    $texts = $xml.GetElementsByTagName('a:t')
    Write-Output "=== $($entry.Name) ==="
    foreach ($t in $texts) { Write-Output $t.InnerText }
    Write-Output ''
}
$zip.Dispose()
