import { ReactNode } from "react";

import { Maybe } from "@gc-digital-talent/graphql";

export interface EmployeeSearchValue {
  id?: string;
  workEmail?: Maybe<string>;
}

type ErrorMessageKey = "NO_PROFILE" | "NOT_GOVERNMENT_EMAIL";

export interface ErrorMessage {
  title?: ReactNode;
  body: ReactNode;
}

export type ErrorMessages = Record<ErrorMessageKey, ErrorMessage>;
