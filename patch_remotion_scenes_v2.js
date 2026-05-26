const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, 'remotion', 'scenes');
const files = fs.readdirSync(scenesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(scenesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove the image tag
  content = content.replace(/<img src="https:\/\/images\.unsplash[^>]+>\s*/g, '');

  // Increase font sizes
  content = content.replace(/text-8xl/g, 'text-9xl'); // If any exist
  content = content.replace(/text-4xl/g, 'text-6xl');
  content = content.replace(/text-lg/g, 'text-3xl');
  content = content.replace(/text-xl/g, 'text-4xl');

  // Make blur ring bigger and more pronounced
  content = content.replace(/w-\[1200px\] h-\[1200px\] blur-\[120px\]/g, 'w-[1600px] h-[1600px] blur-[150px] opacity-60');

  fs.writeFileSync(filePath, content);
  console.log(`Patched fonts and removed image from ${file}`);
}
