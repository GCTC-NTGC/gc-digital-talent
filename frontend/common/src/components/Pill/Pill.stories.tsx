import React from "react";
import { Story, Meta } from "@storybook/react";
import Pill from "./Pill";
import type { PillProps } from "./Pill";

export default {
  component: Pill,
  title: "Components/Pill",
  args: {
    content: "IT Business Analyst / IT Project Management",
  },
  argTypes: {
    content: {
      name: "content",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
    onClick: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const colors: Array<"primary" | "secondary" | "neutral"> = [
  "primary",
  "secondary",
  "neutral",
];

const TemplatePill: Story<Omit<PillProps, "color"> & { content: string }> = (
  args,
) => {
  const { content, ...rest } = args;
  return (
    <>
      {colors.map((color) => (
        <Pill key={color} color={color} {...rest}>
          {content}
        </Pill>
      ))}
    </>
  );
};

export const PillSolid = TemplatePill.bind({});
export const PillBlock = TemplatePill.bind({});
export const PillOutline = TemplatePill.bind({});

PillSolid.args = {
  mode: "solid",
};

PillBlock.args = {
  mode: "solid",
  block: true,
};

PillOutline.args = {
  mode: "outline",
};
