const fs = require('fs');

const files = [
  'remotion/scenes/BeautyLabScene.tsx',
  'remotion/scenes/CyberpunkScene.tsx',
  'remotion/scenes/MinimalistScene.tsx',
  'remotion/scenes/PersonaBuilderScene.tsx',
  'remotion/scenes/ProductsScene.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the double closing div at the very end of the component with a single one.
  // The syntax error is caused by an extra </div> right before the return );
  content = content.replace(/<\/div>\s*<\/div>\s*\);\s*};/g, '</div>\n  );\n};');
  
  fs.writeFileSync(file, content);
  console.log(`Fixed syntax in ${file}`);
}
