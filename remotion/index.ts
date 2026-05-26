import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
import { loadFont } from '@remotion/google-fonts/Inter';

// Load Inter font for the entire video
loadFont();

// Import Tailwind CSS here so Remotion components get styling
import '../src/styles/globals.css';

// Register the root component
registerRoot(RemotionRoot);
