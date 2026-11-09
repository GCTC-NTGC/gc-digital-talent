import { expect } from "@playwright/test";
import * as ExcelJS from "exceljs";

import type { GraphQLContext } from "~/utils/graphql";
import { getUserById } from "~/utils/user";

/**
 * Excel document
 *
 * Page containing utilities for interacting with a word document
 */
class ExcelDocument {
  async getContents(path: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);

    const data: Record<string, string>[] = [];
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
          const rowData: Record<string, string> = {};
          // Every header gets a value, so an empty cell is "" instead of missing
          headers.forEach((header, index) => {
            rowData[header] = row.getCell(index + 1).text;
          });
          data.push(rowData);
        }
      });
    }

    return data;
  }

  async getFullNames(
    path: string,
    firstNameHeader = "First name",
    lastNameHeader = "Last name",
  ) {
    const data = await this.getContents(path);
    return data.map((row) =>
      [row[firstNameHeader], row[lastNameHeader]].filter(Boolean).join(" "),
    );
  }

  async validateUserRows(path: string, ctx: GraphQLContext) {
    const data = await this.getContents(path);
    for (const row of data) {
      const user = await getUserById(ctx, { id: row["User ID"] });
      expect.soft(row, `Excel row of user ${user.id}`).toMatchObject({
        "First name": user.firstName ?? "",
        "Last name": user.lastName ?? "",
        "Contact email address": user.email ?? "",
        Telephone: user.telephone ?? "",
        "Member of CAF": user.armedForcesStatus?.label.en ?? "",
        Citizenship: user.citizenship?.label.en ?? "",
        City: user.currentCity ?? "",
        Province: user.currentProvince?.label.en ?? "",
        "Communication language": user.preferredLang?.label.en ?? "",
        Department: user.department?.name.en ?? "",
        "Work email": user.workEmail ?? "",
        "Priority number": user.priorityNumber ?? "",
      });
    }
  }
}

export default ExcelDocument;
