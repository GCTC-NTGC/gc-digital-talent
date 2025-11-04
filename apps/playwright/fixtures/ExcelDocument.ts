import * as ExcelJS from "exceljs";

/**
 * Excel document
 *
 * Page containing utilities for interacting with a word document
 */
class ExcelDocument {
  async getContents(path: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);

    const data: Record<string, object>[] = [];
    const headers: string[] = [];

    const worksheet = workbook.getWorksheet(1);

    if (worksheet) {
      // Get headers from the first row
      worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.text);
      });

      worksheet.eachRow((row, rowNumber) => {
        // Skip header row
        if (rowNumber > 1) {
          const rowData = {};
          row.eachCell((cell, colNumber) => {
            rowData[headers[colNumber - 1]] = cell.text;
          });
          data.push(rowData);
        }
      });
    }

    return data;
  }
}

export default ExcelDocument;
