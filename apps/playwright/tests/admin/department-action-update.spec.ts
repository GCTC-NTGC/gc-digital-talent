import { DepartmentSize } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import Department from "~/fixtures/Department";
import { loginBySub } from "~/utils/auth";
import { deleteDepartment, createDepartment } from "~/utils/departments";
import graphql from "~/utils/graphql";
import { generateUniqueNumber, generateUniqueTestId } from "~/utils/id";

test("Update department", async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
  const DEPARTMENT_TITLE = `Test update department ${uniqueTestId}`;

  const adminCtx = await graphql.newContext();
  const { id } = await createDepartment(adminCtx, {
    name: {
      en: `${DEPARTMENT_TITLE} (EN)`,
      fr: `${DEPARTMENT_TITLE} (FR)`,
    },
    departmentNumber: parseInt(generateUniqueNumber()),
    orgIdentifier: parseInt(generateUniqueNumber()),
    size: DepartmentSize.Large,
    isCentralAgency: false,
    isCorePublicAdministration: false,
    isRegulatory: true,
    isScience: false,
  });

  await loginBySub(appPage.page, "admin@test.com");

  const dept = new Department(appPage.page);

  const expectedNumber = parseInt(generateUniqueNumber());
  const expectedIdentifier = parseInt(generateUniqueNumber());

  await dept.updateDepartment(id, {
    name: {
      en: `${DEPARTMENT_TITLE} (EN) UPDATED`,
      fr: `${DEPARTMENT_TITLE} (FR) UPDATED`,
    },
    departmentNumber: expectedNumber,
    orgIdentifier: expectedIdentifier,
    size: DepartmentSize.Micro,
    isCentralAgency: true,
    isCorePublicAdministration: true,
    isRegulatory: false,
    isScience: false,
  });

  await expect(
    dept.page.getByText(`${expectedNumber}`),
  ).toBeVisible();

  await deleteDepartment(adminCtx, { id });
});
