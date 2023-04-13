import React from "react";

export type StepState =
  | "active"
  | "completed"
  | "disabled"
  | "error"
  | "default";

export type IconType = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement>
>;

export type StepType = {
  href: string;
  icon: IconType;
  label: React.ReactNode;
  completed?: boolean;
  disabled?: boolean;
  error?: boolean;
};
