import { ReactNode } from "react";

export interface StepType {
  href: string;
  label: ReactNode;
  completed?: boolean | null;
  disabled?: boolean | null;
  error?: boolean | null;
}
