import os
import json
import math
from mutagen.mp3 import MP3

audio_dir = os.path.join("..", "public", "audio")
scenes = [
  {
    "id": "scene1_fatigue",
    "audio": "v2_ext_scene1.mp3",
    "text": "In modern cloud architectures, site reliability engineers are constantly bombarded with pager alerts. Alert fatigue degrades response times, leading to costly downtime. Welcome to SynaPath AI, the future of autonomous incident response."
  },
  {
    "id": "scene2_intake",
    "audio": "v2_ext_scene2.mp3",
    "text": "When a production alert fires, SynaPath's Intake Agent instantly captures it. Instead of manual triage, the system automatically analyzes the alert payload, categorizes dependencies, and builds a comprehensive execution context."
  },
  {
    "id": "scene3_diagnostics",
    "audio": "v2_ext_scene3.mp3",
    "text": "Next, the Diagnostic Agent takes command. It orchestrates a fleet of specialized processes—polling server metrics, running system trace routes, scanning application log streams, and cross referencing database connection tables."
  },
  {
    "id": "scene4_rootcause",
    "audio": "v2_ext_scene4.mp3",
    "text": "Within seconds, the agent pinpoints the root cause: database connection pool exhaustion. It traces the leak to Database Connector dot t-s, where client connections were not being properly released inside the catch block."
  },
  {
    "id": "scene5_remediation",
    "audio": "v2_ext_scene5.mp3",
    "text": "SynaPath's Action Agent generates a precise, surgical code patch. Before presenting it to the team, the system deploys the patch to an isolated staging sandbox and executes integration tests to verify recovery."
  },
  {
    "id": "scene6_recovery",
    "audio": "v2_ext_scene6.mp3",
    "text": "Finally, the SRE team receives a transparent approval prompt. With one click, the fix is deployed to production. Active connections drop back to normal, systems recover, and operations return to full health."
  }
]

scene_durations = []

for scene in scenes:
    file_path = os.path.join(audio_dir, scene["audio"])
    if os.path.exists(file_path):
        audio = MP3(file_path)
        duration_sec = audio.info.length
        # Override to exactly 900 frames (30 seconds at 30fps) as per the 3-minute design
        duration_frames = 900
        
        scene_durations.append({
            "id": scene["id"],
            "audio": scene["audio"],
            "durationFrames": duration_frames,
            "durationSec": duration_sec
        })
        print(f"{scene['audio']}: {duration_sec:.2f}s -> {duration_frames} frames")
    else:
        print(f"File not found: {file_path}")

with open(os.path.join("src", "scenes.json"), "w") as f:
    json.dump(scene_durations, f, indent=2)

print("Saved scenes.json successfully.")
