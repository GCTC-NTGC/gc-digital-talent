import { ReactNode } from "react";

import { Maybe } from "@gc-digital-talent/graphql";

type ErrorMessageKey =
  | "NO_PROFILE"
  | "NOT_GOVERNMENT_EMAIL"
  | "NOT_VERIFIED_GOVERNMENT_EMPLOYEE";
export type ErrorSeverity = "warning" | "error";

export interface ErrorMessage {
  title?: ReactNode;
  body: ReactNode;
}

export type ErrorMessages = Record<ErrorMessageKey, ErrorMessage>;
export type ErrorSeverities = Record<ErrorMessageKey, ErrorSeverity>;

export interface EmployeeSearchResult {
  id: string;
  workEmail: string;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  role?: Maybe<string>;
  department?: Maybe<string>;
}
