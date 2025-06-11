import { Meta, StoryFn } from "@storybook/react-vite";

import SignUpPage from "./SignUpPage";

export default {
  component: SignUpPage,
} as Meta;

const Template: StoryFn = () => <SignUpPage />;

export const Default = Template.bind({});
