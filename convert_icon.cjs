const { Jimp } = require('jimp');
const pngToIco = require('png-to-ico');
const fs = require('fs');

async function main() {
  const imagePath = 'C:\\Users\\comit\\.gemini\\antigravity\\brain\\30d092ad-e7e5-4add-b3b0-e0da79a7bafb\\calendar_app_icon_1786448325163.jpg';
  const pngPath = 'C:\\Users\\comit\\안티그래비티폴더\\edu-calendar-maker\\app_icon.png';
  const icoPath = 'C:\\Users\\comit\\안티그래비티폴더\\edu-calendar-maker\\app.ico';
  
  console.log('Reading image...');
  const image = await Jimp.read(imagePath);
  console.log('Resizing image...');
  image.resize({ w: 256, h: 256 });
  await image.write(pngPath);
  
  console.log('Converting to ico...');
  const buf = await pngToIco(pngPath);
  fs.writeFileSync(icoPath, buf);
  console.log('Conversion successful: ' + icoPath);
}

main().catch(console.error);
