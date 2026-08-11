using System;
using System.Diagnostics;
using System.IO;

namespace Launcher {
    class Program {
        static void Main(string[] args) {
            string appDir = @"c:\Users\comit\안티그래비티폴더\edu-calendar-maker";
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = "cmd.exe";
            psi.Arguments = "/c npm run dev -- --open";
            psi.WorkingDirectory = appDir;
            psi.WindowStyle = ProcessWindowStyle.Hidden;
            psi.CreateNoWindow = true;
            Process.Start(psi);
        }
    }
}
