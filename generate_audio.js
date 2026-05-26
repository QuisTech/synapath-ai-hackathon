const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const VOICE = 'en-US-AvaNeural';

const scenes = [
  {
    id: 'intro',
    name: '01_intro.mp3',
    text: "Welcome to SynaPath AI, the future of autonomous IT incident management. We are transforming reactive incident response into proactive, efficient, and human-in-the-loop resolution."
  },
  {
    id: 'dashboard',
    name: '02_dashboard.mp3',
    text: "Here is the Command Center. SynaPath monitors your systems twenty four seven. When an alert fires, our Intake Agent immediately categorizes and prioritizes the incident, reducing manual effort."
  },
  {
    id: 'investigation',
    name: '03_investigation.mp3',
    text: "Next, the Autonomous Investigation phase begins. Our Diagnostic Agents orchestrate complex workflows, pulling logs, analyzing stack traces, and gathering root cause context without any human intervention."
  },
  {
    id: 'remediation',
    name: '04_remediation.mp3',
    text: "Once the root cause is identified, our Action Agent generates a precise, code-level fix. You get a transparent, human-in-the-loop approval prompt before any critical actions are taken."
  },
  {
    id: 'analytics',
    name: '05_analytics.mp3',
    text: "The results speak for themselves. By leveraging SynaPath, you can significantly reduce Mean Time To Resolution, enhance system reliability, and dramatically cut operational costs."
  },
  {
    id: 'outro',
    name: '06_outro.mp3',
    text: "From the first alert to the final resolution, SynaPath AI is your autonomous site reliability engineer. Thank you for watching, and welcome to a proactive future."
  }
];

console.log('Starting audio generation with edge-tts (Ava Neural)...');

const sceneDurations = [];

for (const scene of scenes) {
  const outPath = path.join(audioDir, scene.name);
  console.log(`Generating ${scene.name}...`);
  try {
    execSync(`edge-tts --voice ${VOICE} --text "${scene.text}" --write-media "${outPath}"`, { stdio: 'inherit' });
    console.log(`✅ Saved ${scene.name}`);
    
    // Get duration using ffprobe
    const durationStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outPath}"`).toString().trim();
    const durationSec = parseFloat(durationStr);
    
    // Add 1 second of padding (60 frames padding at 60fps)
    const durationFrames = Math.ceil(durationSec * 60) + 60;
    
    sceneDurations.push({
      id: scene.id,
      audio: scene.name,
      durationFrames: durationFrames
    });
    
  } catch (error) {
    console.error(`❌ Failed to process ${scene.name}`, error);
  }
}

fs.writeFileSync(path.join(__dirname, 'remotion', 'scenes.json'), JSON.stringify(sceneDurations, null, 2));

console.log('All audio generated successfully.');
