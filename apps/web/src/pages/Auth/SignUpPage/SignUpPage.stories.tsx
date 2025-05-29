import { Meta, StoryFn } from "@storybook/react";

import SignUpPage from "./SignUpPage";

export default {
  component: SignUpPage,
} as Meta;

const Template: StoryFn = () => <SignUpPage />;

export const Default = {
  render: Template,
};
