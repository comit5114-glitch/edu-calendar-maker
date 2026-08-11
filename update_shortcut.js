var sh = WScript.CreateObject("WScript.Shell");
var shortcut = sh.CreateShortcut("C:\\Users\\comit\\Desktop\\AI 디지털배움터 교육시간표 생성기.lnk");
shortcut.TargetPath = "C:\\Users\\comit\\Desktop\\교육일정표_자동제작.exe";
shortcut.IconLocation = "C:\\Users\\comit\\안티그래비티폴더\\edu-calendar-maker\\app.ico";
shortcut.Save();
