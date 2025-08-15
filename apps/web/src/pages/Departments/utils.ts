import { IntlShape } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { DepartmentSize } from "@gc-digital-talent/graphql";

export type DepartmentType =
  | "isCorePublicAdministration"
  | "isCentralAgency"
  | "isScience"
  | "isRegulatory";

export function departmentTypeToInput(types?: DepartmentType[] | boolean) {
  return {
    isCorePublicAdministration:
      (typeof types === "object" &&
        types?.includes("isCorePublicAdministration")) ??
      false,
    isCentralAgency:
      (typeof types === "object" && types?.includes("isCentralAgency")) ??
      false,
    isScience:
      (typeof types === "object" && types?.includes("isScience")) ?? false,
    isRegulatory:
      (typeof types === "object" && types?.includes("isRegulatory")) ?? false,
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

export function departmentStatusAccessor(
  archivedAt: string | null | undefined,
  intl: IntlShape,
) {
  return archivedAt
    ? intl.formatMessage(commonMessages.archived)
    : intl.formatMessage(commonMessages.published);
}
