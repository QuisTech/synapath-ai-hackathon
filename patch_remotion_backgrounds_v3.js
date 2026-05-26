const fs = require('fs');
const path = require('path');

const scenes = {
  'IntroScene.tsx': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
  'DashboardScene.tsx': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
  'InvestigationScene.tsx': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
  'RemediationScene.tsx': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
  'AnalyticsScene.tsx': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80',
  'OutroScene.tsx': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=80'
};

const scenesDir = path.join(__dirname, 'remotion', 'scenes');

for (const [file, imgUrl] of Object.entries(scenes)) {
  const filePath = path.join(scenesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}, not found.`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Clean up any existing image
  content = content.replace(/<img src="https:\/\/images\.unsplash[^>]+>\s*/g, '');

  // 2. Inject the dynamic image
  const imgTag = `<img src="${imgUrl}" className="w-full h-full object-cover opacity-30 mix-blend-screen" />\n        `;
  if (content.includes('<div className="absolute inset-0 z-0">')) {
    content = content.replace(
      '<div className="absolute inset-0 z-0">',
      `<div className="absolute inset-0 z-0">\n        ${imgTag}`
    );
  }

  // 3. Aggressive typography scaling
  content = content.replace(/text-lg/g, 'text-4xl');
  content = content.replace(/text-xl/g, 'text-5xl');
  content = content.replace(/text-2xl/g, 'text-6xl font-black');
  content = content.replace(/text-3xl/g, 'text-7xl font-black');
  content = content.replace(/text-4xl/g, 'text-8xl font-black');
  content = content.replace(/text-5xl/g, 'text-8xl font-black');
  content = content.replace(/text-6xl/g, 'text-9xl font-black');
  
  // Clean up duplicate font weights
  content = content.replace(/font-black font-black/g, 'font-black');
  content = content.replace(/font-bold font-black/g, 'font-black');

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file} with cinematic background and massive typography`);
}
