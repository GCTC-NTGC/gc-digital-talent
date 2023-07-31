import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import SignInPage from "./SignInPage";

export default {
  component: SignInPage,
  title: "Pages/Sign In Page",
} as Meta;

const Template: StoryFn = () => <SignInPage />;

export const Default = Template.bind({});
