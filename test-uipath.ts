import { UiPathClient } from './src/lib/uipath';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function test() {
  console.log("Testing UiPath API...");
  const client = new UiPathClient();
  try {
    const folders = await client['request']('orchestrator_/odata/Folders');
    console.log("Folders response:", JSON.stringify(folders).substring(0, 500));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
