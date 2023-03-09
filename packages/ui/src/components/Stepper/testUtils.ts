import {
  AcademicCapIcon,
  BanknotesIcon,
  CakeIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";
import { faker } from "@faker-js/faker";

import { StepType } from "./types";

faker.seed(0);

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
    completed: true,
  },
  {
    href: "/step-four",
    label: faker.lorem.sentence(),
    icon: DevicePhoneMobileIcon,
    completed: true,
  },
  {
    href: "/step-five",
    label: "Step Five",
    icon: EnvelopeIcon,
    completed: true,
  },
];
