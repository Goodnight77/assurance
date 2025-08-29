import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Excel file
const excelPath = path.join(__dirname, '../public/Données_Assurance_S1.2_S2.2.xlsx');
const outputPath = path.join(__dirname, '../public/assurance-data.json');

// Load the Excel file
const workbook = XLSX.readFile(excelPath);

// Helper to safely get sheet data
function getSheetJson(sheetName) {
  const sheet = workbook.Sheets[sheetName];
  return sheet ? XLSX.utils.sheet_to_json(sheet) : [];
}

const data = {
  personnesPhysiques: getSheetJson('PersonnesPhysiques'),
  personnesMorales: getSheetJson('PersonnesMorales'),
  contrats: getSheetJson('Contrats'),
  sinistres: getSheetJson('Sinistres'),
  garantiesContrats: getSheetJson('GarantieContrat'),
  productProfiles: getSheetJson('ProductProfiles'),
  mappingProduits: getSheetJson('MappingProduits'),
};

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
console.log('JSON file created at public/assurance-data.json');
