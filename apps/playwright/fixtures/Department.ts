import { Locator, type Page } from "@playwright/test";

import {
  CreateDepartmentInput,
  DepartmentSize,
  InputMaybe,
  LocalizedStringInput,
  UpdateDepartmentInput,
} from "@gc-digital-talent/graphql";

import dConfig from "~/constants/config";
import { loginBySub } from "~/utils/auth";

import AppPage from "./AppPage";

const FIELD = {
  NAME_EN: "nameEn",
  NAME_FR: "nameFr",
  NUMBER: "number",
  ORG_ID: "orgId",
  TYPE: "type",
  SIZE: "size",
} as const;

type ObjectValues<T> = T[keyof T];
export type Field = ObjectValues<typeof FIELD>;

type DepartmentTypeInput = Pick<
  UpdateDepartmentInput,
  | "isScience"
  | "isRegulatory"
  | "isCentralAgency"
  | "isCorePublicAdministration"
>;

type DepartmentType = keyof DepartmentTypeInput;

/**
 * Department
 *
 * Page containing utilities to interact with departments
 */
class Department extends AppPage {
  readonly locators: Record<Field, Locator>;
  readonly baseUrl: string = "/en/admin/settings/departments";
  readonly sizeMap = new Map<DepartmentSize, string>([
    [DepartmentSize.Micro, "Micro (up to 250 employees)"],
    [DepartmentSize.Small, "Small (up to 1000 employees)"],
    [DepartmentSize.Medium, "Medium (up to 5000 employees)"],
    [DepartmentSize.Large, "Large (more than 5000 employees)"],
  ]);
  readonly typeMap = new Map<DepartmentType, RegExp>([
    ["isCorePublicAdministration", /core public administration/i],
    ["isCentralAgency", /central agency/i],
    ["isRegulatory", /regulatory/i],
    ["isScience", /science/i],
  ]);

  constructor(page: Page) {
    super(page);
    this.locators = {
      [FIELD.NAME_EN]: page.getByRole("textbox", { name: /name \(english\)/i }),
      [FIELD.NAME_FR]: page.getByRole("textbox", { name: /name \(french\)/i }),
      [FIELD.NUMBER]: page.getByRole("spinbutton", {
        name: /department number/i,
      }),
      [FIELD.ORG_ID]: page.getByRole("spinbutton", {
        name: /organization id/i,
      }),
      [FIELD.TYPE]: page.getByRole("group", { name: /department type/i }),
      [FIELD.SIZE]: page.getByRole("combobox", { name: /department size/i }),
    };
  }

  async loginDepartments() {
    await loginBySub(this.page, dConfig.allSignInEmails.adminSignIn);
  }

  async view(id: string) {
    await this.page.goto(`${this.baseUrl}/${id}`);
    await this.waitForGraphqlResponse("ViewDepartmentPage");
  }

  async goToUpdate(id: string) {
    await this.loginDepartments();
    await this.page.goto(`${this.baseUrl}/${id}/edit`);
    await this.waitForGraphqlResponse("Department");
  }

  async createDepartment(createDepartment: CreateDepartmentInput) {
    await this.loginDepartments();
    await this.page.goto(`${this.baseUrl}/create`);
    await this.waitForGraphqlResponse("CreateDepartmentOptions");

    await this.fillName(createDepartment.name);
    await this.fillNumber(createDepartment.departmentNumber);
    await this.fillOrgId(createDepartment.orgIdentifier);
    await this.fillSize(createDepartment.size);

    const {
      isScience,
      isRegulatory,
      isCentralAgency,
      isCorePublicAdministration,
    } = createDepartment;
    await this.fillType({
      isCorePublicAdministration,
      isCentralAgency,
      isRegulatory,
      isScience,
    });

    await this.page.getByRole("button", { name: /create department/i }).click();
    await this.waitForGraphqlResponse("CreateDepartment");
  }

  async updateDepartment(id: string, department: UpdateDepartmentInput) {
    await this.goToUpdate(id);

    await this.fillName(department.name);
    await this.fillNumber(department.departmentNumber);
    await this.fillOrgId(department.orgIdentifier);
    await this.fillSize(department.size);

    const {
      isScience,
      isRegulatory,
      isCentralAgency,
      isCorePublicAdministration,
    } = department;
    await this.fillType({
      isCorePublicAdministration,
      isCentralAgency,
      isRegulatory,
      isScience,
    });

    await this.page.getByRole("button", { name: /save changes/i }).click();

    await this.waitForGraphqlResponse("UpdateDepartment");
  }

  async fillName(name?: InputMaybe<LocalizedStringInput>) {
    if (name?.en) {
      await this.locators.nameEn.fill(name.en);
    }

    if (name?.fr) {
      await this.locators.nameFr.fill(name.fr);
    }
  }

  async fillNumber(
    number?:
      | UpdateDepartmentInput["departmentNumber"]
      | CreateDepartmentInput["departmentNumber"],
  ) {
    if (number) {
      await this.locators.number.fill(String(number));
    }
  }

  async fillOrgId(
    orgId?:
      | UpdateDepartmentInput["orgIdentifier"]
      | CreateDepartmentInput["orgIdentifier"],
  ) {
    if (orgId) {
      await this.locators.orgId.fill(String(orgId));
    }
  }

  async fillSize(
    size?: UpdateDepartmentInput["size"] | CreateDepartmentInput["size"],
  ) {
    if (size) {
      const label = this.sizeMap.get(size);
      if (label) {
        await this.locators.size.selectOption({ label });
      }
    }
  }

  async fillType(type?: DepartmentTypeInput) {
    if (type) {
      const keys: DepartmentType[] = Object.keys(type) as DepartmentType[];
      for (const key of keys) {
        const label = this.typeMap.get(key);
        if (label && this.typeIsSet(key, type)) {
          const el = this.locators.type.getByRole("checkbox", { name: label });
          const isChecked = await el.isChecked();
          if ((type?.[key] && !isChecked) || (!type?.[key] && isChecked)) {
            await el.click();
          }
        }
      }
    }
  }

  typeIsSet(
    key: DepartmentType,
    type?: DepartmentTypeInput,
  ): type is Record<string, boolean | null> & Record<DepartmentType, boolean> {
    if (!type) return false;

    if (!(key in type)) {
      return false;
    }

    return typeof type[key] === "boolean" && type?.[key] !== null;
  }
}

export default Department;
