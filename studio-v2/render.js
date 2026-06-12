const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const entryPoint = path.join(__dirname, 'src', 'index.ts');
const configPath = path.join(projectRoot, 'remotion.config.ts');
const outputDir = path.join(projectRoot, 'out');
const outputFile = path.join(outputDir, 'synapath-cinematic-3min.mp4');

// Make sure output folder exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Starting Remotion Render for studio-v2...');
console.log(`Entry: ${entryPoint}`);
console.log(`Output: ${outputFile}`);

try {
  // Execute the remotion CLI render command
  const command = `npx remotion render "${entryPoint}" SynaPathCinematic "${outputFile}" --config="${configPath}"`;
  console.log(`Running: ${command}`);
  
  execSync(command, {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  
  console.log('\n==================================================');
  console.log('✅ VIDEO RENDER COMPLETED SUCCESSFULLY!');
  console.log(`Location: ${outputFile}`);
  console.log('==================================================\n');
} catch (error) {
  console.error('\n❌ Render process failed:', error);
  process.exit(1);
}
