const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already processed or not a TSX file
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let modified = false;

  // Add use client
  if (filePath.endsWith('.tsx') && !content.includes('"use client"') && !content.includes("'use client'")) {
    content = '"use client";\n\n' + content;
    modified = true;
  }

  // Handle react-router-dom imports
  if (content.includes('react-router-dom')) {
    modified = true;
    
    // Check what was imported
    const hasLink = content.includes('Link');
    const hasUseNavigate = content.includes('useNavigate');
    const hasUseLocation = content.includes('useLocation');
    const hasNavigateComponent = content.includes('Navigate');

    let nextImports = [];
    if (hasLink) {
      nextImports.push(`import Link from 'next/link';`);
    }
    
    let navigationImports = [];
    if (hasUseNavigate) navigationImports.push('useRouter');
    if (hasUseLocation) {
      navigationImports.push('usePathname');
      navigationImports.push('useSearchParams');
    }
    if (navigationImports.length > 0) {
      nextImports.push(`import { ${navigationImports.join(', ')} } from 'next/navigation';`);
    }

    // Remove react-router-dom import
    content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]react-router-dom['"];?/g, nextImports.join('\n'));

    // Replace usages
    content = content.replace(/useNavigate\(\)/g, 'useRouter()');
    // Basic heuristics for navigate()
    content = content.replace(/navigate\(([^,)]+)(,\s*\{[^}]+\})?\)/g, 'navigate.push($1)');
    
    // replace useLocation
    content = content.replace(/const location = useLocation\(\);/g, 'const pathname = usePathname();\n  const searchParams = useSearchParams();\n  const location = { pathname, search: searchParams ? "?" + searchParams.toString() : "", state: null };');
    
    // Replace <Navigate to="..."> with router.push in a useEffect, but for now just comment or render null
    // Since we are wrapping, Navigate component is tricky. Let's just replace it with a text for manual fix
    content = content.replace(/<Navigate to=([^ />]+)([^>]*)(\/?)>/g, '{/* TODO: Fix Navigate to $1 */}');
  }

  // Fix image imports: Next.js doesn't support importing images directly as string path easily without configuration,
  // but let's see. If they import logoImg from '../assets/...', it's better to use an absolute path for public.
  // We'll let Next.js handle it or fix manually.

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src', 'old_pages'));
walkDir(path.join(__dirname, 'src', 'components'));

console.log("Migration script finished.");
