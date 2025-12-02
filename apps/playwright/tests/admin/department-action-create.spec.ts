import { DepartmentSize } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import Department from "~/fixtures/Department";
import { deleteDepartment } from "~/utils/departments";
import graphql from "~/utils/graphql";
import {
  generateUniqueNumber,
  generateUniqueTestId,
  fetchIdentificationNumber,
} from "~/utils/id";

test("Create department", async ({ appPage }) => {
  const uniqueTestId = generateUniqueTestId();
  const uniqueDepartmentNumber = generateUniqueNumber();
  const DEPARTMENT_TITLE = `Test department ${uniqueTestId}`;
  const adminCtx = await graphql.newContext();

  const createDept = new Department(appPage.page);

  await createDept.createDepartment({
    name: {
      en: `${DEPARTMENT_TITLE}EN`,
      fr: `${DEPARTMENT_TITLE}FR`,
    },
    departmentNumber: parseInt(uniqueDepartmentNumber),
    orgIdentifier: parseInt(generateUniqueNumber()),
    size: DepartmentSize.Large,
    isCentralAgency: false,
    isCorePublicAdministration: false,
    isRegulatory: false,
    isScience: true,
  });

  await expect(appPage.page.getByRole("alert").last()).toContainText(
    /department created successfully/i,
  );
  await appPage.waitForGraphqlResponse("ViewDepartmentPage");
  await expect(
    appPage.page.getByRole("heading", {
      name: /department information/i,
    }),
  ).toBeVisible();

  const departmentID = fetchIdentificationNumber(
    appPage.page.url(),
    "departments",
  );
  await deleteDepartment(adminCtx, {
    id: departmentID,
  });
});
