import { Meta, StoryFn } from "@storybook/react";

import SignInPage from "./SignInPage";

export default {
  component: SignInPage,
} as Meta;

const Template: StoryFn = () => <SignInPage />;

export const Default = {
  render: Template,
};
