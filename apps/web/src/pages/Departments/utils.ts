import { IntlShape } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { DepartmentSize } from "@gc-digital-talent/graphql";

export type DepartmentType =
  | "isCorePublicAdministration"
  | "isCentralAgency"
  | "isScience"
  | "isRegulatory";

export function departmentTypeToInput(types?: DepartmentType[]) {
  return {
    isCorePublicAdministration:
      types?.includes("isCorePublicAdministration") ?? false,
    isCentralAgency: types?.includes("isCentralAgency") ?? false,
    isScience: types?.includes("isScience") ?? false,
    isRegulatory: types?.includes("isRegulatory") ?? false,
  };
}

export function yesNoAccessor(value: boolean, intl: IntlShape) {
  return value
    ? intl.formatMessage(commonMessages.yes)
    : intl.formatMessage(commonMessages.no);
}

export const SIZE_SORT_ORDER = [
  DepartmentSize.Micro,
  DepartmentSize.Small,
  DepartmentSize.Medium,
  DepartmentSize.Large,
  null,
];
