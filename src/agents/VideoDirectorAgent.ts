import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface VideoDirectorInputs {
  webpageUrl: string; // The URL to parse or display in the video
  themeColor?: string;
  maxRetries?: number;
}

export interface VideoDirectorOutput {
  status: 'success' | 'failed';
  videoUrl?: string;
  error?: string;
  attempts: number;
}

/**
 * VideoDirectorAgent:
 * Orchestrates the automated creation of Remotion cinematic videos.
 * Extracts content from a URL and compiles it into a parametric video.
 */
export class VideoDirectorAgent {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'videos');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generates a cinematic video based on a URL.
   * Features automatic retry logic for transient Remotion CLI failures.
   */
  async generateCinematicVideo(inputs: VideoDirectorInputs): Promise<VideoDirectorOutput> {
    console.log(`[VideoDirectorAgent] Starting video pipeline for URL: ${inputs.webpageUrl}`);
    
    const maxRetries = inputs.maxRetries || 3;
    let attempt = 0;
    
    // Step 1: Serialize Inputs into props.json
    const propsPath = path.join(process.cwd(), 'temp_video_props.json');
    const videoData = {
      webpageUrl: inputs.webpageUrl,
      themeColor: inputs.themeColor || '#1e40af', // UiPath style blue default
      timestamp: Date.now()
    };
    
    fs.writeFileSync(propsPath, JSON.stringify(videoData, null, 2));

    const outputPath = path.join(this.outputDir, `cinematic_${Date.now()}.mp4`);
    
    // Step 2: Execute Remotion CLI with Automatic Retry
    while (attempt < maxRetries) {
      attempt++;
      try {
        console.log(`[VideoDirectorAgent] Render Attempt ${attempt}/${maxRetries}...`);
        
        // Use the global CLI or local npx to execute the render
        const command = `npx remotion render src/index.ts IncidentVideo ${outputPath} --props=${propsPath}`;
        
        const { stdout, stderr } = await execAsync(command);
        
        console.log('[VideoDirectorAgent] Render Successful!', stdout);
        
        // Cleanup temporary props file
        if (fs.existsSync(propsPath)) {
          fs.unlinkSync(propsPath);
        }
        
        return {
          status: 'success',
          videoUrl: `/videos/${path.basename(outputPath)}`,
          attempts: attempt
        };

      } catch (error: any) {
        console.error(`[VideoDirectorAgent] Render Failed on attempt ${attempt}:`, error.message);
        if (attempt >= maxRetries) {
          return {
            status: 'failed',
            error: `Failed after ${attempt} attempts. Last error: ${error.message}`,
            attempts: attempt
          };
        }
        // Wait 2 seconds before retrying
        await new Promise(res => setTimeout(res, 2000));
      }
    }
    
    return { status: 'failed', error: 'Unknown error', attempts: attempt };
  }
}
