import Jimp from 'jimp';
import pngToIco from 'png-to-ico';
import fs from 'fs';

async function main() {
  const imagePath = 'C:\\Users\\comit\\.gemini\\antigravity\\brain\\30d092ad-e7e5-4add-b3b0-e0da79a7bafb\\calendar_app_icon_1786448325163.jpg';
  const pngPath = 'C:\\Users\\comit\\안티그래비티폴더\\edu-calendar-maker\\app_icon.png';
  const icoPath = 'C:\\Users\\comit\\안티그래비티폴더\\edu-calendar-maker\\app.ico';
  
  console.log('Reading image...');
  const image = await Jimp.read(imagePath);
  console.log('Resizing image...');
  await image.resize(256, 256).writeAsync(pngPath);
  
  console.log('Converting to ico...');
  const buf = await pngToIco(pngPath);
  fs.writeFileSync(icoPath, buf);
  console.log('Conversion successful: ' + icoPath);
}

main().catch(console.error);
