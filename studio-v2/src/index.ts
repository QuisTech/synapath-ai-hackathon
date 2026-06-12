import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
import { loadFont } from '@remotion/google-fonts/Inter';

// Load Inter font for styling
loadFont();

// Register the video root
registerRoot(RemotionRoot);
