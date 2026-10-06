$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $base 'MAV_GRAPHQL_TESZT_EREDMENY.txt'

$endpoints = @(
  'https://mavplusz.hu//otp2-backend/otp/routers/default/index/graphql',
  'https://mavplusz.hu/otp2-backend/otp/routers/default/index/graphql'
)

$headers = @{
  'Accept' = 'application/json, text/plain, */*'
  'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36'
}

function Post-GraphQL($url, $query, $label) {
  $body = @{ query = $query } | ConvertTo-Json -Compress
  try {
    $r = Invoke-WebRequest -Uri $url -Method Post -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 30
    return "[$label] HTTP $($r.StatusCode)`n$($r.Content)"
  } catch {
    $msg = $_.Exception.Message
    if ($_.Exception.Response) {
      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errbody = $reader.ReadToEnd()
        return "[$label] ERROR`n$msg`nRESPONSE:`n$errbody"
      } catch {}
    }
    return "[$label] ERROR`n$msg"
  }
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('ATTILA MÁV / GYERMEKVASÚT GRAPHQL TESZT')
$lines.Add('Idő: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
$lines.Add('')
$lines.Add('FONTOS: a teszt nem küld bejelentkezési adatot, jelszót, sütit vagy tokent.')
$lines.Add('')

foreach ($ep in $endpoints) {
  $lines.Add('================================================')
  $lines.Add('VÉGPONT: ' + $ep)
  $lines.Add('================================================')
  $lines.Add((Post-GraphQL $ep 'query { __typename }' 'GRAPHQL ALAPTESZT'))
  $lines.Add('')
  $intro = 'query Introspection { __schema { queryType { name } mutationType { name } types { name kind } } }'
  $lines.Add((Post-GraphQL $ep $intro 'GRAPHQL INTROSPEKCIÓ'))
  $lines.Add('')
}

$lines.Add('================================================')
$lines.Add('VALÓS GYV TESZTESETEK')
$lines.Add('================================================')
$lines.Add('1) UIC: 98 55 8276 003-1 | Mk45-2003 | Vonatazonosító: 00-2026.10.06. 30123')
$lines.Add('2) UIC: 98 55 8276 005-6 | Mk45-2005 | Vonatazonosító: 00-2026.10.06. 30224')
$lines.Add('3) MÁV 2-es vonal: Budapest–Esztergom')
$lines.Add('4) MÁV 70-es vonal: Budapest–Szob')
$lines.Add('')
$lines.Add('Ezeket addig nem küldjük ki kitalált GraphQL mezőnevekkel, amíg a séma vagy a böngésző Network forgalma meg nem mutatja a valódi mezőket.')
$lines.Add('')
$lines.Add('KÖVETKEZŐ LÉPÉS: ha az introspekció le van tiltva, a MÁVPlusz/EMIG bejelentkezett oldalon a Chrome DevTools -> Network alatt kell elkapni a valódi GraphQL POST kérést.')

$lines | Set-Content -Path $out -Encoding UTF8
Get-Content $out
Write-Host ''
Write-Host ('Eredmény mentve: ' + $out) -ForegroundColor Green
