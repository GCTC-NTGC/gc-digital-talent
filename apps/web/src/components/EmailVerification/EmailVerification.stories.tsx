import { StoryFn } from "@storybook/react";

import Toast from "@gc-digital-talent/toast";

import EmailVerification from "./EmailVerification";

export default {
  component: EmailVerification,
};

const Template: StoryFn<typeof EmailVerification> = (args) => {
  return (
    <>
      <EmailVerification {...args} />
      <Toast />
    </>
  );
};

export const ContactEmail = Template.bind({});
ContactEmail.args = {
  emailAddress: "example@example.org",
  successUrl: "/example/success",
  skipUrl: "/example/skip",
};
