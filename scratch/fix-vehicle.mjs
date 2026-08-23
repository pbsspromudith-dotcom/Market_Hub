import fs from 'fs';

const filePath = 'd:/Nishantha/Market_Hub/src/old_pages/PostAd.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const firstOccurrence = '  const isVehicleSpecCategory = (path: any[], catString: string) => {';
const secondOccurrence = '  const handlePublish = async (chosenPlan?: \'free\' | \'boost\' | \'premium\') => {';

const idx1 = content.indexOf(firstOccurrence);
const idx2 = content.indexOf(secondOccurrence);

if (idx1 !== -1 && idx2 !== -1) {
  const cleanIsVehicle = `  const isVehicleSpecCategory = (path: any[], catString: string) => {
    const names: string[] = [];
    if (Array.isArray(path)) {
      for (const node of path) {
        if (node?.CategoryName) names.push(String(node.CategoryName).trim());
      }
    }
    if (names.length === 0 && typeof catString === "string") {
      names.push(...catString.split(" > ").map(s => s.trim()));
    }

    if (names.length === 0) return false;
    if (names[0].toLowerCase() !== "vehicles") return false;

    const subCat = names[1] ? names[1].toUpperCase() : "";
    if (!subCat) return false;

    // Strictly allowed 7 vehicle subcategories:
    const ALLOWED = [
      "CARS & TRUCKS",
      "SUVS",
      "PICKUP TRUCKS",
      "VANS",
      "COMMERCIAL VEHICLES",
      "MOTORCYCLES",
      "CLASSIC CARS"
    ];

    return ALLOWED.includes(subCat);
  };

`;
  const before = content.slice(0, idx1);
  const after = content.slice(idx2);
  fs.writeFileSync(filePath, before + cleanIsVehicle + after, 'utf-8');
  console.log('Fixed isVehicleSpecCategory cleanly!');
} else {
  console.error('Markers not found', idx1, idx2);
}
