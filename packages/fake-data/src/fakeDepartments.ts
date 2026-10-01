import { faker } from "@faker-js/faker/locale/en";

import type { Department } from "@gc-digital-talent/graphql/schema-types";

import toLocalizedEnum from "./fakeLocalizedEnum";
import staticDepartments from "./departments.json" with { type: "json" };

const staticData = staticDepartments.data.departments as Department[];

export default (preventFakerReset = false): Department[] => {
  if (!preventFakerReset) {
    faker.seed(0); // repeatable results
  }
  return staticData.map((department) => ({
    ...department,
    __typename: "Department" as const,
    id: faker.string.uuid(),
    name: {
      __typename: "LocalizedString" as const,
      ...department.name,
      localized: department.name.en,
    },
    archivedAt: null,
    size: department.size
      ? toLocalizedEnum(department.size.value, "LocalizedDepartmentSize")
      : null,
  }));
};
