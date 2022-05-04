import React from "react";
import { Story, Meta } from "@storybook/react";
import { Pill } from "./Pill";
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

const TemplatePill: Story<PillProps & { content: string }> = (args) => {
  const { content, ...rest } = args;
  return <Pill {...rest}>{content}</Pill>;
};

const TemplateMultiPill: Story<PillProps & { content: string }> = (args) => {
  const { content, ...rest } = args;
  return (
    <>
      <Pill {...rest}>{content}</Pill>
      <Pill {...rest}>{content}</Pill>
      <Pill {...rest}>{content}</Pill>
      <Pill {...rest}>{content}</Pill>
      <Pill {...rest}>{content}</Pill>
    </>
  );
};

export const PillPrimary = TemplatePill.bind({});
export const PillPrimaryBlock = TemplatePill.bind({});
export const PillPrimaryOutline = TemplatePill.bind({});
export const PillSecondary = TemplatePill.bind({});
export const PillSecondaryOutline = TemplatePill.bind({});
export const PillNeutral = TemplatePill.bind({});
export const PillNeutralOutline = TemplatePill.bind({});
export const PillMulti = TemplateMultiPill.bind({});

PillPrimary.args = {
  color: "primary",
  mode: "solid",
};

PillPrimaryBlock.args = {
  color: "primary",
  mode: "solid",
  block: true,
};

PillPrimaryOutline.args = {
  color: "primary",
  mode: "outline",
};

PillSecondary.args = {
  color: "secondary",
  mode: "solid",
};

PillSecondaryOutline.args = {
  color: "secondary",
  mode: "outline",
};

PillNeutral.args = {
  color: "neutral",
  mode: "solid",
};

PillNeutralOutline.args = {
  color: "neutral",
  mode: "outline",
};

PillMulti.args = {
  color: "primary",
  mode: "solid",
};
