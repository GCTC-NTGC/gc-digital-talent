import { StepType } from "./types";

// eslint-disable-next-line import/prefer-default-export
export const defaultSteps: StepType[] = [
  {
    href: "/step-one",
    label: "Step One",
    completed: true,
  },
  {
    href: "/step-two",
    label: "Step Two",
    error: true,
  },
  {
    href: "/step-three",
    label: "Step Three",
    disabled: true,
  },
  {
    href: "/step-four",
    label: "Step Four",
    disabled: true,
  },
  {
    href: "/step-five",
    label: "Step Five",
    disabled: true,
  },
];
