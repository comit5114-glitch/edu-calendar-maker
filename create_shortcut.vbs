Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\교육일정표 자동제작.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "c:\Users\comit\안티그래비티폴더\edu-calendar-maker\run_app.bat"
oLink.WorkingDirectory = "c:\Users\comit\안티그래비티폴더\edu-calendar-maker"
oLink.IconLocation = "shell32.dll, 14"
oLink.Save
