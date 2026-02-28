[void][Windows.Security.Credentials.PasswordVault, Windows.Security.Credentials, ContentType = WindowsRuntime]
$vault = New-Object Windows.Security.Credentials.PasswordVault
$creds = $vault.RetrieveAll()
foreach ($c in $creds) {
    if ($c.Resource -like '*github*') {
        $c.RetrievePassword()
        Write-Host "User: $($c.UserName), Password: $($c.Password)"
    }
}
