import { ReactNode } from "react";

type ErrorMessageKey = "NO_PROFILE" | "NOT_GOVERNMENT_EMAIL";

export interface ErrorMessage {
  title?: ReactNode;
  body: ReactNode;
}

export type ErrorMessages = Record<ErrorMessageKey, ErrorMessage>;
