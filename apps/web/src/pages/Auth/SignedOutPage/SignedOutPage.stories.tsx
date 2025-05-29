import { Meta, StoryFn } from "@storybook/react";

import SignedOutPage from "./SignedOutPage";

export default {
  component: SignedOutPage,
} as Meta;

const Template: StoryFn = () => <SignedOutPage />;

export const Default = {
  render: Template,
};
