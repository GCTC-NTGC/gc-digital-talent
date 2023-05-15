import React from "react";

import { IconType } from "../../types";

export type StepState =
  | "active"
  | "completed"
  | "disabled"
  | "error"
  | "default";

export type StepType = {
  href: string;
  icon: IconType;
  label: React.ReactNode;
  completed?: boolean | null;
  disabled?: boolean | null;
  error?: boolean | null;
};
