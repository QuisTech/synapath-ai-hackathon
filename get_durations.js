const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const audioDir = path.join('public', 'audio');
const files = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3')).sort();

for (const file of files) {
  try {
    const filePath = path.join(audioDir, file);
    // Use ffprobe to get duration in seconds
    const output = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`).toString().trim();
    const durationSec = parseFloat(output);
    
    // Calculate recommended frames (duration + 0.5s padding) * 60fps
    const frames = Math.ceil((durationSec + 0.5) * 60);
    console.log(`${file}: ${durationSec.toFixed(2)}s -> ${frames} frames`);
  } catch (err) {
    console.error(`Failed to parse ${file}`);
  }
}
