import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import SignUpPage from "./SignUpPage";

export default {
  component: SignUpPage,
  title: "Pages/Sign Up Page",
} as Meta;

const Template: StoryFn = () => <SignUpPage />;

export const Default = Template.bind({});
