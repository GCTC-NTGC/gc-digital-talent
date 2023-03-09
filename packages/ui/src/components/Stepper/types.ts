import React from "react";

export type StepState = "active" | "completed" | "disabled" | "error";

export type IconType = React.FC<React.SVGProps<SVGSVGElement>>;

export type StepType = {
  href: string;
  icon: IconType;
  label: React.ReactNode;
  completed?: boolean;
  error?: boolean;
};
