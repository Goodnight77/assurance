import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '../public/Données_Assurance_S1.2_S2.2.xlsx');
const outputPath = path.join(__dirname, '../public/assurance-data.json');

const workbook = XLSX.readFile(excelPath);

function getSheetJson(sheetName) {
  const sheet = workbook.Sheets[sheetName];
  return sheet ? XLSX.utils.sheet_to_json(sheet) : [];
}

const data = {
  personnesPhysiques: getSheetJson('personne_physique'),
  personnesMorales: getSheetJson('personne_morale'),
  contrats: getSheetJson('Contrats'),
  sinistres: getSheetJson('sinistres'),
  garantiesContrats: getSheetJson('Garantie_contrat'),
  productProfiles: [], // Not present in your Excel, keep empty
  mappingProduits: getSheetJson('Mapping_Produits'),
};

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
console.log('JSON file created at public/assurance-data.json');
