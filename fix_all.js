const fs = require('fs');
const path = require('path');

let fixCount = 0;

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf8');
      let modified = false;

      // Fix remaining to= attributes on Link components
      if (content.match(/\s+to="/)) {
        content = content.replace(/\s+to="/g, ' href="');
        modified = true;
      }
      if (content.match(/\s+to=\{/)) {
        content = content.replace(/\s+to=\{/g, ' href={');
        modified = true;
      }

      // Fix bare localStorage in useState initializers (SSR safety)
      // Pattern: return localStorage. without a typeof window guard on prior line
      if (content.includes('useState(() =>') && content.includes('localStorage.getItem')) {
        // Add SSR guard before localStorage.getItem inside useState initializers
        content = content.replace(
          /useState\(\(\) => \{\s*\n\s*return localStorage\.getItem/g,
          'useState(() => {\n    if (typeof window === "undefined") return "";\n    return localStorage.getItem'
        );
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(p, content);
        console.log(`Fixed: ${p}`);
        fixCount++;
      }
    }
  }
}

walk(path.join(__dirname, 'src', 'old_pages'));
walk(path.join(__dirname, 'src', 'components'));

console.log(`\nTotal files fixed: ${fixCount}`);
