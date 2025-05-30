import { StoryFn } from "@storybook/react";
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
  "white",
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
        <div className="flex flex-wrap items-center gap-3">
          {colors.map((color) => (
            <Button
              mode={mode}
              color={color}
              key={`${color}-${mode}`}
              icon={InformationCircleIcon}
            >
              {label}
            </Button>
          ))}
          <Button
            mode={mode}
            color="primary"
            disabled
            icon={InformationCircleIcon}
          >
            {label} (disabled)
          </Button>
          <Button
            mode={mode}
            color="primary"
            size="sm"
            icon={InformationCircleIcon}
          >
            {label} (sm)
          </Button>
          <Button
            mode={mode}
            color="primary"
            size="md"
            icon={InformationCircleIcon}
          >
            {label} (md)
          </Button>
          <Button
            mode={mode}
            color="primary"
            size="lg"
            icon={InformationCircleIcon}
          >
            {label} (lg)
          </Button>
        </div>
      </div>
    ))}
  </div>
);

export const Default = Template.bind({});
