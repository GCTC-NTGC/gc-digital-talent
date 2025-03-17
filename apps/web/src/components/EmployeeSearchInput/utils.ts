import { FieldErrors, FieldValues, get } from "react-hook-form";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { EmployeeSearchResult } from "./types";

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

export const EmployeeSearchResult_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeSearchResult on BasicGovEmployeeProfile {
    id
    workEmail
    firstName
    lastName
    role
    department {
      name {
        localized
      }
    }
  }
`);

export const fragmentToEmployee = (
  fragment?: FragmentType<typeof EmployeeSearchResult_Fragment> | null,
): EmployeeSearchResult | null => {
  const employee = getFragment(EmployeeSearchResult_Fragment, fragment);
  if (!employee || !employee.workEmail) return null;

  return {
    ...employee,
    workEmail: employee.workEmail, // NOTE: For some reason this errors otherwise
    department: employee.department?.name.localized,
  };
};
