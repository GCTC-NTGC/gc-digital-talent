import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Example from "./Example";

// The default export metadata controls how Storybook lists your stories and provides information used by addons.
const meta = {
  component: Example,
  // You can also define args at the component level. They will apply to all the component's stories unless you overwrite them. To do so, use the args key on the default CSF export.
  argTypes: {
    showBorder: { control: "boolean" },
  },
  args: {
    showBorder: true,
  },
} satisfies Meta<typeof Example>;
export default meta;

type Story = StoryObj<typeof meta>;

// Use the named exports of a CSF file to define your component’s stories. We recommend you use UpperCamelCase for your story exports.
export const WithDefaultArgs: Story = {
  args: {
    subtitle: "WithDefaultArgs",
    color: "primary",
  },
};

// A story can use a custom render function
export const WithRenderFunction = {
  name: "With render function",
  render: () => (
    <Example subtitle="WithRenderFunction" color="primary" showBorder />
  ),
};

export const WithArgCompositionAndParameters: Story = {
  args: {
    // combine args for multiple stories of the same component.
    ...WithDefaultArgs.args,
  },
  parameters: {
    // Parameters are a set of static, named metadata about a story, typically used to control the behavior of Storybook features and addons.
    backgrounds: {
      default: "white",
      values: [{ name: "white", value: "#fff" }],
    },
    themeKey: "iap",
  },
};
