$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath('Desktop')
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\교육일정표_자동제작.lnk")
$Shortcut.TargetPath = "c:\Users\comit\안티그래비티폴더\edu-calendar-maker\run_app.bat"
$Shortcut.WorkingDirectory = "c:\Users\comit\안티그래비티폴더\edu-calendar-maker"
$Shortcut.IconLocation = "shell32.dll, 14"
$Shortcut.Save()
