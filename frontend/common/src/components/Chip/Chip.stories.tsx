import React from "react";
import { Story, Meta } from "@storybook/react";
import Chip from "./Chip";
import type { ChipProps } from "./Chip";

export default {
  component: Chip,
  title: "Components/Chip",
  args: {
    label: "IT Business Analyst / IT Project Management",
  },
  argTypes: {
    label: {
      name: "label",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
    onDismiss: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateDismissChip: Story<ChipProps> = (args) => {
  return <Chip {...args} />;
};
const TemplateNoDismissChip: Story<ChipProps> = (args) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onDismiss, ...argsWithNoDismiss } = args;
  return <Chip {...argsWithNoDismiss} />;
};

const TemplateMultiChip: Story<ChipProps> = (args) => {
  return (
    <>
      <Chip {...args} />
      <Chip {...args} />
      <Chip {...args} />
      <Chip {...args} />
      <Chip {...args} />
    </>
  );
};

export const ChipDismiss = TemplateDismissChip.bind({});
export const ChipNoDismiss = TemplateNoDismissChip.bind({});
export const ChipMulti = TemplateMultiChip.bind({});

const defaultLook: Partial<ChipProps> = {
  color: "neutral",
  mode: "outline",
};

ChipDismiss.args = defaultLook;
ChipNoDismiss.args = defaultLook;
ChipMulti.args = defaultLook;
