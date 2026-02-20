import { Meta, StoryObj } from "@storybook/react-vite";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import StatusButton, { StatusButtonProps } from "./StatusButton";

const meta = {
  component: StatusButton,
  args: {
    label: "Status button",
    icon: PencilSquareIcon,
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
} satisfies Meta;

export default meta;

const colors: StatusButtonProps["color"][] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
  "black",
];

export const Default: StoryObj<typeof StatusButton> = {
  render: ({ label, ...rest }) => (
    <div className="flex flex-col items-start gap-y-6">
      {colors.map((color) => (
        <StatusButton {...rest} color={color} key={color} label={label}>
          {label}
        </StatusButton>
      ))}
    </div>
  ),
};
