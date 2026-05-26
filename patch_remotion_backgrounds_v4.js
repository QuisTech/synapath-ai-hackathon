const fs = require('fs');
const path = require('path');

const sceneColors = {
  'IntroScene.tsx': 'bg-red-500/20',
  'DashboardScene.tsx': 'bg-blue-500/20',
  'InvestigationScene.tsx': 'bg-yellow-500/20',
  'RemediationScene.tsx': 'bg-red-500/30',
  'AnalyticsScene.tsx': 'bg-emerald-500/20',
  'OutroScene.tsx': 'bg-emerald-500/20'
};

const scenesDir = path.join(__dirname, 'remotion', 'scenes');

for (const [file, colorClass] of Object.entries(sceneColors)) {
  const filePath = path.join(scenesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}, not found.`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Completely obliterate any Unsplash images
  content = content.replace(/<img src="https:\/\/images\.unsplash[^>]+>\s*/g, '');

  // 2. We want to update the generic bg-primary/20 blur ring to use the exact color class from the webpage
  // The blur ring usually looks like: `bg-primary/20 rounded-full blur-[150px]` or similar.
  // We will replace `bg-primary/20` with our new `colorClass`. If it already has `bg-[color]-500/20`, we replace that.
  content = content.replace(/bg-primary\/20/g, colorClass);
  content = content.replace(/bg-red-500\/20/g, colorClass);
  content = content.replace(/bg-blue-500\/20/g, colorClass);
  content = content.replace(/bg-yellow-500\/20/g, colorClass);
  content = content.replace(/bg-emerald-500\/20/g, colorClass);
  content = content.replace(/bg-red-500\/30/g, colorClass);

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file}: Removed images, applied ${colorClass} blur ring. Fonts retained.`);
}
