import { Meta, StoryFn } from "@storybook/react-vite";

import SignInPage from "./SignInPage";

export default {
  component: SignInPage,
} as Meta;

const Template: StoryFn = () => <SignInPage />;

export const Default = Template.bind({});
