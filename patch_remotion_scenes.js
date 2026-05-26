const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, 'remotion', 'scenes');
const files = fs.readdirSync(scenesDir).filter(f => f.endsWith('.tsx'));

const glassBg = `
      {/* Background Image & Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover opacity-30 mix-blend-screen" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
`;

for (const file of files) {
  const filePath = path.join(scenesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace plain bg with glassmorphism bg
  content = content.replace(/bg-slate-950/g, 'bg-background text-foreground');
  content = content.replace(/bg-black/g, 'bg-background text-foreground');
  content = content.replace(/text-white/g, 'text-foreground');
  
  // Try to insert the glass background if not already there
  if (!content.includes('Background Image & Glassmorphism')) {
    content = content.replace(
      /(<div className="[^"]*bg-background[^"]*">)/, 
      `$1\n${glassBg}`
    );
    // Close the inner wrapper div
    content = content.replace(/(<\/div>\n\s*<\/div>\n\s*\);\n\s*};)/, `</div>\n$1`);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${file}`);
}
