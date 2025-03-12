import { FieldErrors, FieldValues, get } from "react-hook-form";

import { unpackMaybes } from "@gc-digital-talent/helpers";

const isRecord = (value?: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
};

const getSubValue = (value?: unknown): string | undefined => {
  return value && typeof value === "string" ? value : undefined;
};

export const getDefaultValue = (
  defaultValues: FieldValues | undefined,
  name: string,
): string | undefined => {
  if (!defaultValues) return undefined;

  const rawDefaultValue: unknown = get<FieldValues>(defaultValues, name);
  if (typeof rawDefaultValue === "string") {
    return rawDefaultValue;
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
