import { ReactNode } from "react";

export type StepState =
  | "active"
  | "active-error"
  | "completed"
  | "disabled"
  | "error"
  | "default";

export interface StepType {
  href: string;
  label: ReactNode;
  completed?: boolean | null;
  disabled?: boolean | null;
  error?: boolean | null;
}
