import { StoryFn } from "@storybook/react-vite";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Button from "./Button";
import type { ButtonProps } from "./Button";
import { BaseButtonLinkProps } from "../../utils/btnStyles";

export default {
  component: Button,
  args: {
    label: "Button label",
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
  Omit<ButtonProps, "color" | "ref"> & { label: string }
> = ({ label }) => (
  <div className="flex flex-col items-start gap-y-6">
    {modes.map((mode) => (
      <div key={mode}>
        <p className="mb-3 text-xl">{mode}</p>
        <div className="mb-3 grid justify-start gap-3 xs:grid-cols-2 sm:grid-cols-3 sm:items-center md:grid-cols-6">
          {colors.map((color) => (
            <Button
              mode={mode}
              color={color}
              key={`${color}-${mode}`}
              icon={InformationCircleIcon}
              counter={99}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="mb-3 grid justify-start gap-3 xs:grid-cols-2 sm:grid-cols-4 sm:items-center">
          <Button
            mode={mode}
            color="primary"
            disabled
            icon={InformationCircleIcon}
            counter={99}
          >
            {label} (disabled)
          </Button>
          <Button
            mode={mode}
            color="primary"
            size="sm"
            icon={InformationCircleIcon}
            counter={99}
          >
            {label} (sm)
          </Button>
          <Button
            mode={mode}
            color="primary"
            size="md"
            icon={InformationCircleIcon}
            counter={99}
          >
            {label} (md)
          </Button>
          <Button
            mode={mode}
            color="primary"
            size="lg"
            icon={InformationCircleIcon}
            counter={99}
          >
            {label} (lg)
          </Button>
        </div>
        <div className="max-w-max bg-gray-700 p-3 dark:bg-gray-100">
          <Button
            mode={mode}
            color="white"
            icon={InformationCircleIcon}
            counter={99}
          >
            {label} (white)
          </Button>
        </div>
      </div>
    ))}
  </div>
);

export const Default = {
  render: Template,
};
