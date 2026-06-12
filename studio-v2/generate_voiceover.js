const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const VOICE = 'en-US-AvaNeural';

const scenes = [
  {
    id: 'scene1_fatigue',
    name: 'v2_ext_scene1.mp3',
    text: "In modern cloud architectures, site reliability engineers are constantly bombarded with pager alerts. Alert fatigue degrades response times, leading to costly downtime. Welcome to SynaPath AI, the future of autonomous incident response."
  },
  {
    id: 'scene2_intake',
    name: 'v2_ext_scene2.mp3',
    text: "When a production alert fires, SynaPath's Intake Agent instantly captures it. Instead of manual triage, the system automatically analyzes the alert payload, categorizes dependencies, and builds a comprehensive execution context."
  },
  {
    id: 'scene3_diagnostics',
    name: 'v2_ext_scene3.mp3',
    text: "Next, the Diagnostic Agent takes command. It orchestrates a fleet of specialized processes—polling server metrics, running system trace routes, scanning application log streams, and cross referencing database connection tables."
  },
  {
    id: 'scene4_rootcause',
    name: 'v2_ext_scene4.mp3',
    text: "Within seconds, the agent pinpoints the root cause: database connection pool exhaustion. It traces the leak to Database Connector dot t-s, where client connections were not being properly released inside the catch block."
  },
  {
    id: 'scene5_remediation',
    name: 'v2_ext_scene5.mp3',
    text: "SynaPath's Action Agent generates a precise, surgical code patch. Before presenting it to the team, the system deploys the patch to an isolated staging sandbox and executes integration tests to verify recovery."
  },
  {
    id: 'scene6_recovery',
    name: 'v2_ext_scene6.mp3',
    text: "Finally, the SRE team receives a transparent approval prompt. With one click, the fix is deployed to production. Active connections drop back to normal, systems recover, and operations return to full health."
  }
];

console.log('Generating studio-v2 extended audio with edge-tts (Ava Neural)...');

for (const scene of scenes) {
  const outPath = path.join(audioDir, scene.name);
  console.log(`Generating ${scene.name}...`);
  try {
    execSync(`edge-tts --voice ${VOICE} --text "${scene.text}" --write-media "${outPath}"`, { stdio: 'inherit' });
    console.log(`✅ Saved ${scene.name}`);
  } catch (error) {
    console.error(`❌ Failed to process ${scene.name}`, error);
  }
}

console.log('All audio files generated successfully.');
