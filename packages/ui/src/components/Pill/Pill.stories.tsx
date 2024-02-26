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

const colors: Array<
  "primary" | "secondary" | "tertiary" | "quaternary" | "quinary"
> = ["primary", "secondary", "tertiary", "quaternary", "quinary"];
const stoplight: Array<"success" | "warning" | "error"> = [
  "success",
  "warning",
  "error",
];
const black: Array<"black"> = ["black"];

const TemplatePill: Story<Omit<PillProps, "color"> & { content: string }> = (
  args,
) => {
  const { content, ...rest } = args;
  return (
    <div data-h2-display="base(flex)">
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {colors.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Pill key={color} color={color} {...rest}>
              {content}
            </Pill>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {stoplight.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Pill key={color} color={color} {...rest}>
              {content}
            </Pill>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {black.map((color) => (
          <Pill key={color} color={color} {...rest}>
            {content}
          </Pill>
        ))}
      </div>
    </div>
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
