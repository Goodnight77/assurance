import * as XLSX from 'xlsx';

export function parseExcelArrayBuffer(arrayBuffer: ArrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  const data: Record<string, any[]> = {};
  sheetNames.forEach(sheet => {
    data[sheet] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  });
  return data;
}
