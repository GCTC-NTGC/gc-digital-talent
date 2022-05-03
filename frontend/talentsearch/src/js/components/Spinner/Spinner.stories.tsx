import React from "react";
import type { Meta, Story } from "@storybook/react";

import Spinner from "./Spinner";

export default {
  component: Spinner,
  title: "Spinner",
} as Meta;

const Template: Story = () => <Spinner />;

export const Default = Template.bind({});
