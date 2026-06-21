const fs = require('fs');

let content = fs.readFileSync('src/old_pages/Home.tsx', 'utf8');

// Fix 1: SSR guard for localStorage
content = content.replace(
  'return localStorage.getItem("user_location") || "Toronto, ON";',
  'if (typeof window === "undefined") return "Toronto, ON";\n    return localStorage.getItem("user_location") || "Toronto, ON";'
);

// Fix 2: Replace remaining <Link ... to= with <Link ... href=
// Use a regex that matches `to=` preceded by whitespace (attribute context)
content = content.replace(/\s+to="/g, ' href="');
content = content.replace(/\s+to=\{/g, ' href={');

fs.writeFileSync('src/old_pages/Home.tsx', content);
console.log('Home.tsx fixed successfully.');
