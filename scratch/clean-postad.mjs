import fs from 'fs';

const filePath = 'd:/Nishantha/Market_Hub/src/old_pages/PostAd.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const duplicateMarker = '            return;\n          }\n\n          setIsEditMode(true);';
const endMarker = '    return ALLOWED.includes(subCat);\n  };\n\n  const handlePublish = async';

const startIdx = content.indexOf(duplicateMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + '    return ALLOWED.includes(subCat);\n  };\n\n'.length);
  const newContent = before + '    return ALLOWED.includes(subCat);\n  };\n\n' + after;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Successfully cleaned duplicate in PostAd.tsx');
} else {
  console.error('Markers not found: startIdx=', startIdx, 'endIdx=', endIdx);
}
