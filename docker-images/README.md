# Docker image archives

This directory stores split Docker image archives.

## sigit-faces 26710f6

Recreate the compressed archive:

```powershell
Get-Content -Encoding Byte sigit-faces-26710f6.tar.gz.part* | Set-Content -Encoding Byte sigit-faces-26710f6.tar.gz
Get-FileHash sigit-faces-26710f6.tar.gz -Algorithm SHA256
```

Compare the hash with `sigit-faces-26710f6.sha256`, then load it:

```powershell
tar -xzf sigit-faces-26710f6.tar.gz
docker load -i sigit-faces-26710f6.tar
```
