import asyncio
import os
import glob
import subprocess
import shutil
from playwright.async_api import async_playwright

# 1. Narrator voiceover text
VOICEOVER_TEXT = (
    "Welcome to SynaPath AI, your autonomous Site Reliability Engineer built for the UiPath Hackathon. "
    "Let's explore how our multi-agent workforce handles complex system incidents in real time. "
    "We start at the Command Center dashboard. "
    "Let's trigger a new critical server incident. "
    "Instantly, the Intake and Triage agent captures the payload, while the Diagnostic agent begins its root cause analysis. "
    "We can watch the live streaming logs as the LLM reasons through the stack traces. "
    "Now, let's switch over to the Agent Orchestrator. "
    "Here, we can view the live topological map of our UiPath agent fleet. "
    "Watch as the agents shift from standby to active, their task counts updating dynamically directly from the backend incident store. "
    "Finally, let's head to the Platform Analytics dashboard. "
    "This executive view visualizes the impact of our AI automation. "
    "We are boasting an eighty-four percent reduction in Mean Time To Resolution, and our system health matrix dynamically drops when critical alerts are active. "
    "SynaPath AI completely transforms IT incident response."
)

# 2. Virtual cursor CSS/JS to inject on page load
CURSOR_INJECT_JS = """
const cursor = document.createElement('div');
cursor.id = 'virtual-cursor';
cursor.style.position = 'fixed';
cursor.style.width = '16px';
cursor.style.height = '16px';
cursor.style.background = '#4F46E5';
cursor.style.borderRadius = '50%';
cursor.style.border = '2px solid #ffffff';
cursor.style.boxShadow = '0 0 10px #4F46E5, 0 0 20px #4F46E5';
cursor.style.pointerEvents = 'none';
cursor.style.zIndex = '99999';
cursor.style.transform = 'translate(-50%, -50%)';
cursor.style.transition = 'width 0.1s, height 0.1s, background-color 0.1s';

function initCursor() {
  if (!document.getElementById('virtual-cursor')) {
    document.body.appendChild(cursor);
  }
}
if (document.body) {
  initCursor();
} else {
  document.addEventListener('DOMContentLoaded', initCursor);
}

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
  cursor.style.width = '10px';
  cursor.style.height = '10px';
  cursor.style.backgroundColor = '#10B981';
  cursor.style.boxShadow = '0 0 8px #10B981, 0 0 15px #10B981';
});

document.addEventListener('mouseup', () => {
  cursor.style.width = '16px';
  cursor.style.height = '16px';
  cursor.style.backgroundColor = '#4F46E5';
  cursor.style.boxShadow = '0 0 10px #4F46E5, 0 0 20px #4F46E5';
});
"""

# Mouse coordinate state tracking (Centered at 1280x720 viewport center)
current_mouse_x = 640
current_mouse_y = 360

async def smooth_move_to(page, selector):
    global current_mouse_x, current_mouse_y
    locator = page.locator(selector).first
    box = await locator.bounding_box()
    if not box:
        print(f"Warning: Selector '{selector}' bounding box not found.")
        return
    
    target_x = box["x"] + box["width"] / 2
    target_y = box["y"] + box["height"] / 2
    
    steps = 15
    for i in range(1, steps + 1):
        t = i / steps
        # Cubic ease-in-out movement
        t_smooth = t * t * (3 - 2 * t)
        x = current_mouse_x + (target_x - current_mouse_x) * t_smooth
        y = current_mouse_y + (target_y - current_mouse_y) * t_smooth
        await page.mouse.move(x, y)
        await asyncio.sleep(0.01)
        
    current_mouse_x = target_x
    current_mouse_y = target_y
    await asyncio.sleep(0.1)

async def smooth_click(page, selector):
    await smooth_move_to(page, selector)
    await page.mouse.down()
    await asyncio.sleep(0.1)
    await page.mouse.up()
    await asyncio.sleep(0.2)

def generate_voiceover(text, output_file):
    print(f"1. Synthesizing voiceover narration with edge-tts (Ava voice)...")
    if os.path.exists(output_file):
        os.remove(output_file)
    cmd = [
        "edge-tts",
        "--voice", "en-US-AvaNeural",
        "--text", text,
        "--write-media", output_file
    ]
    subprocess.run(cmd, check=True)
    print(f"   [SUCCESS] Narration audio saved to {output_file}")

async def record_walkthrough(temp_dir):
    print("2. Starting Playwright video recording...")
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 720},
            device_scale_factor=1.25,
            record_video_dir=temp_dir,
            record_video_size={"width": 1280, "height": 720}
        )
        
        page = await context.new_page()
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

        file_url = "https://synapath-ai-hackathon.vercel.app/dashboard"
        print(f"   Opening page: {file_url}")
        
        await page.add_init_script(CURSOR_INJECT_JS)
        await page.goto(file_url, wait_until="load")
        await page.wait_for_timeout(7000) # Wait for initial narration "Welcome to SynaPath..."
        
        # --- SCENE 1: Command Center & New Incident ---
        print("   - Recording Scene 1: Command Center")
        try:
            # Click New Incident multiple times to populate the board
            await smooth_click(page, "button:has-text('New Incident')")
            await page.wait_for_timeout(2000)
            await smooth_click(page, "button:has-text('New Incident')")
            await page.wait_for_timeout(1000)
            await smooth_click(page, "button:has-text('New Incident')")
            await page.wait_for_timeout(8000) # Let the streaming logs and status bars go
        except Exception as e:
            print(f"     (Failed to click New Incident: {e})")

        # --- SCENE 2: Orchestrator Page ---
        print("   - Recording Scene 2: Agent Orchestrator")
        try:
            await smooth_click(page, "a:has-text('Orchestrator')")
            await page.wait_for_timeout(12000) # Admire the changing standby/active states
        except Exception as e:
            print(f"     (Failed to navigate to Orchestrator: {e})")
            
        # --- SCENE 3: Platform Analytics ---
        print("   - Recording Scene 3: Platform Analytics")
        try:
            await smooth_click(page, "a:has-text('Analytics')")
            await page.wait_for_timeout(15000) # Admire the dynamic metrics
        except Exception as e:
            print(f"     (Failed to navigate to Analytics: {e})")
        
        await page.close()
        await context.close()
        await browser.close()
    print("   [SUCCESS] Playwright video recording completed.")
 
def compile_final_video(temp_dir, narration_audio, final_output):
    print("3. Compiling final video with FFmpeg...")
    webm_files = glob.glob(os.path.join(temp_dir, "*.webm"))
    if not webm_files:
        raise FileNotFoundError("Could not find the recorded Playwright video file.")
    
    recorded_webm = webm_files[0]
    if os.path.exists(final_output):
        os.remove(final_output)
        
    cmd = [
        "C:\\Users\\Administrator\\Downloads\\ffmpeg\\bin\\ffmpeg.exe",
        "-y",
        "-i", recorded_webm,
        "-i", narration_audio,
        "-map", "0:v",
        "-map", "1:a",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-shortest",
        final_output
    ]
    
    subprocess.run(cmd, check=True)
    print(f"   [SUCCESS] Final presentation compiled: {final_output}")

def main():
    narration_audio = "narration.mp3"
    temp_video_dir = "video_temp"
    final_output = "synapath_demo.mp4"
    
    try:
        generate_voiceover(VOICEOVER_TEXT, narration_audio)
        asyncio.run(record_walkthrough(temp_video_dir))
        
        import time
        time.sleep(3)
        
        compile_final_video(temp_video_dir, narration_audio, final_output)
        
        if os.path.exists(temp_video_dir):
            shutil.rmtree(temp_video_dir)
        if os.path.exists(narration_audio):
            os.remove(narration_audio)
            
        print(f"\n=======================================================")
        print(f"SYNAPATH AI DEMO VIDEO COMPILATION COMPLETE!")
        print(f"File created: {os.path.abspath(final_output)}")
        print(f"=======================================================")
        
    except Exception as e:
        print(f"\n[ERROR] Video generation failed: {e}")

if __name__ == "__main__":
    main()
