import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import { widthOf, heightOf } from "@gc-digital-talent/storybook-helpers";

import Example from "./Example";

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

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
  parameters: {
    chromatic: { viewports: VIEWPORTS },
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
