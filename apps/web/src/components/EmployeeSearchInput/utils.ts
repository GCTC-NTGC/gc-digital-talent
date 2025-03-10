import { FieldErrors, FieldValues, get } from "react-hook-form";

import { unpackMaybes } from "@gc-digital-talent/helpers";

import { EmployeeSearchValue } from "./types";

const isRecord = (value?: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

const getSubValue = (value?: unknown): string | undefined => {
  return value && typeof value === "string" ? value : undefined;
};

export const getDefaultValue = (
  defaultValues: FieldValues | undefined,
  name: string,
): EmployeeSearchValue | undefined => {
  if (!defaultValues) return undefined;

  const rawDefaultValue: unknown = get<FieldValues>(defaultValues, name);
  if (isRecord(rawDefaultValue)) {
    if ("workEmail" in rawDefaultValue || "id" in rawDefaultValue) {
      return {
        id: getSubValue(rawDefaultValue.id),
        workEmail: getSubValue(rawDefaultValue.workEmail),
      };
    }
  }

  return undefined;
};

const getSubError = (error?: unknown): string | undefined => {
  if (isRecord(error)) {
    if ("type" in error) {
      return getSubValue(error.type);
    }
  }

  return undefined;
};

export const getErrors = (
  errors: FieldErrors | undefined,
  name: string,
): string[] | undefined => {
  if (!errors) return undefined;
  const rawErrors: unknown = get<FieldErrors>(errors, name) as FieldErrors;

  if (Array.isArray(rawErrors)) {
    return unpackMaybes(rawErrors.map((rawError) => getSubError(rawError)));
  }

  const inputError = getSubError(rawErrors);

  return inputError ? [inputError] : undefined;
};
