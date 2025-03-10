import { EmployeeSearchValue } from "./types";

const isRecord = (value?: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

const getSubDefaultValue = (value?: unknown): string | undefined => {
  return value && typeof value === "string" ? value : undefined;
};

export const getDefaultValue = (
  rawDefaultValue?: unknown,
): EmployeeSearchValue | undefined => {
  if (isRecord(rawDefaultValue)) {
    if ("workEmail" in rawDefaultValue || "id" in rawDefaultValue) {
      return {
        id: getSubDefaultValue(rawDefaultValue.id),
        workEmail: getSubDefaultValue(rawDefaultValue.workEmail),
      };
    }
  }

  return undefined;
};
