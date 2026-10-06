import { faker } from "@faker-js/faker/locale/en";

import { DepartmentSize } from "@gc-digital-talent/graphql/schema-types";

import toLocalizedEnum from "./fakeLocalizedEnum";
import toLocalizedString from "./fakeLocalizedString";
import staticDepartments from "./departments.json" with { type: "json" };

const toDepartmentSize = (value: string) =>
  Object.values(DepartmentSize).find((size) => String(size) === value) ??
  DepartmentSize.Micro;

export default (preventFakerReset = false) => {
  if (!preventFakerReset) {
    faker.seed(0); // repeatable results
  }
  return staticDepartments.data.departments.map((department) => ({
    ...department,
    __typename: "Department" as const,
    id: faker.string.uuid(),
    name: toLocalizedString(department.name),
    archivedAt: null,
    size: department.size
      ? toLocalizedEnum(
          toDepartmentSize(department.size.value),
          "LocalizedDepartmentSize",
        )
      : null,
  }));
};
