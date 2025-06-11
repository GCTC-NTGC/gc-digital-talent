import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentProps } from "react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Example from "./Example";

type PagePropsAndCustomArgs = ComponentProps<typeof Example> & {
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
    /*
    Chromatic modes allow for testing themes, viewports, and locales via snapshots in Chromatic.
    These should be used instead of creating multiple stories for variations of themes, viewports, or locales.
    REF: https://www.chromatic.com/docs/modes/.
    */
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<PagePropsAndCustomArgs>;
export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const Default: Story = {
  args: {
    footer: "CustomFooterText",
    color: "primary",
    showBorder: false,
  },
} satisfies Story;
