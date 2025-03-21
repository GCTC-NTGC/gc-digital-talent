import { FieldError, FieldErrors, FieldValues, get } from "react-hook-form";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { EmployeeSearchResult } from "./types";

const isRecord = (value?: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object";
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

const isFieldError = (error?: unknown): error is FieldError => {
  if (isRecord(error)) {
    if ("type" in error && "message" in error) {
      return true;
    }
  }

  return false;
};

export const getErrors = (
  errors: FieldErrors | undefined,
  name: string,
): FieldError[] | undefined => {
  if (!errors) return undefined;
  const rawError: unknown = get(errors, name);

  if (Array.isArray(rawError)) {
    return unpackMaybes(rawError.filter(isFieldError));
  }

  return isFieldError(rawError) ? [rawError] : undefined;
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
