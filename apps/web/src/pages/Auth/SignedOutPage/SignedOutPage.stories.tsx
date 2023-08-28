import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import SignedOutPage from "./SignedOutPage";

export default {
  component: SignedOutPage,
  title: "Pages/Signed Out Page",
} as Meta;

const Template: StoryFn = () => <SignedOutPage />;

export const Default = Template.bind({});
