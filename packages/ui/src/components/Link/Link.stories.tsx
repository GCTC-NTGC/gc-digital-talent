import { StoryFn } from "@storybook/react-vite";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Link from "./Link";
import type { LinkProps } from "./Link";
import { BaseButtonLinkProps } from "../../utils/btnStyles";

export default {
  component: Link,
  args: {
    label: "Link label",
  },
  argTypes: {
    label: {
      name: "label",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

const colors: BaseButtonLinkProps["color"][] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
  "black",
];

const modes: BaseButtonLinkProps["mode"][] = [
  "solid",
  "placeholder",
  "text",
  "inline",
];

const Template: StoryFn<
  Omit<LinkProps, "color" | "ref"> & { label: string }
> = ({ label }) => (
  <div className="flex flex-col items-start gap-y-6">
    {modes.map((mode) => (
      <div key={mode}>
        <p className="mb-3 text-xl">{mode}</p>
        <div className="mb-3 grid justify-start gap-3 xs:grid-cols-2 sm:grid-cols-3 sm:items-center md:grid-cols-6">
          {colors.map((color) => (
            <Link
              href="#"
              mode={mode}
              color={color}
              key={`${color}-${mode}`}
              icon={InformationCircleIcon}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="mb-3 grid justify-start gap-3 xs:grid-cols-2 sm:grid-cols-4 sm:items-center">
          <Link
            href="#"
            mode={mode}
            color="primary"
            disabled
            icon={InformationCircleIcon}
          >
            {label} (disabled)
          </Link>
          <Link
            href="#"
            mode={mode}
            color="primary"
            size="sm"
            icon={InformationCircleIcon}
          >
            {label} (sm)
          </Link>
          <Link
            href="#"
            mode={mode}
            color="primary"
            size="md"
            icon={InformationCircleIcon}
          >
            {label} (md)
          </Link>
          <Link
            href="#"
            mode={mode}
            color="primary"
            size="lg"
            icon={InformationCircleIcon}
          >
            {label} (lg)
          </Link>
        </div>
        <div className="max-w-max bg-gray-700 p-3 dark:bg-gray-100">
          <Link href="#" mode={mode} color="white" icon={InformationCircleIcon}>
            {label} (white)
          </Link>
        </div>
      </div>
    ))}
  </div>
);

export const Default = {
  render: Template,
};

export const NewTab = {
  render: Template,

  args: {
    newTab: true,
    external: true,
  },
};
