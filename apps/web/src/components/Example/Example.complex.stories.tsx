import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import Example from "./Example";

type PagePropsAndCustomArgs = React.ComponentProps<typeof Example> & {
  footer?: string;
};

const meta = {
  component: Example,
  render: ({ footer, ...args }) => (
    <>
      <Example {...args} />
      {footer && <span>{footer}</span>}
    </>
  ),
  argTypes: {
    color: {
      options: ["primary", "secondary"],
      control: { type: "radio" },
    },
  },
  parameters: {
    chromatic: { viewports: CHROMATIC_VIEWPORTS },
  },
} satisfies Meta<PagePropsAndCustomArgs>;
export default meta;

type Story = StoryObj<typeof meta>;

export const CustomFooter: Story = {
  args: {
    footer: "CustomFooter",
    color: "primary",
    showBorder: false,
  },
} satisfies Story;
