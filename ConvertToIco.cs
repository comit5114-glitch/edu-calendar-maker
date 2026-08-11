using System;
using System.Drawing;
using System.IO;

class Program {
    static void Main(string[] args) {
        if (args.Length < 2) return;
        using (Bitmap bmp = new Bitmap(args[0])) {
            IntPtr hIcon = bmp.GetHicon();
            using (Icon icon = Icon.FromHandle(hIcon)) {
                using (FileStream fs = new FileStream(args[1], FileMode.Create)) {
                    icon.Save(fs);
                }
            }
        }
    }
}
