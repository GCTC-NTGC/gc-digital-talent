import { StoryFn } from "@storybook/react";

import EmailVerification from "./EmailVerification";

export default {
  component: EmailVerification,
};

const Template: StoryFn<typeof EmailVerification> = (args) => {
  return <EmailVerification {...args} />;
};

export const ContactEmail = Template.bind({});
ContactEmail.args = {
  emailAddress: "example@example.org",
  successUrl: "/example/success",
  skipUrl: "/example/skip",
};
