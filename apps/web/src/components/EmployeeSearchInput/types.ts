import { ReactNode } from "react";

import { Maybe } from "@gc-digital-talent/graphql";

type ErrorMessageKey = "NO_PROFILE" | "NOT_GOVERNMENT_EMAIL";

export interface ErrorMessage {
  title?: ReactNode;
  body: ReactNode;
}

export type ErrorMessages = Record<ErrorMessageKey, ErrorMessage>;

export interface EmployeeSearchResult {
  id: string;
  workEmail: string;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  role?: Maybe<string>;
  department?: Maybe<string>;
}
