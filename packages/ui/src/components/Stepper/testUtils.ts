import {
  AcademicCapIcon,
  BanknotesIcon,
  CakeIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";

import { StepType } from "./types";

// eslint-disable-next-line import/prefer-default-export
export const defaultSteps: Array<StepType> = [
  {
    href: "/step-one",
    label: "Step One",
    icon: AcademicCapIcon,
    completed: true,
  },
  {
    href: "/step-two",
    label: "Step Two",
    icon: BanknotesIcon,
    error: true,
  },
  {
    href: "/step-three",
    label: "Step Three",
    icon: CakeIcon,
    disabled: true,
  },
  {
    href: "/step-four",
    label: "Step Four",
    icon: DevicePhoneMobileIcon,
    disabled: true,
  },
  {
    href: "/step-five",
    label: "Step Five",
    icon: EnvelopeIcon,
    disabled: true,
  },
];
