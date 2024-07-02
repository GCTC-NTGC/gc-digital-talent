import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import EmailVerification from "./EmailVerification";

export default {
  component: EmailVerification,
};

const Template: StoryFn<typeof EmailVerification> = (args) => {
  return <EmailVerification {...args} />;
};

export const ContactEmail = Template.bind({});
ContactEmail.args = {
  emailType: "contact",
  emailAddress: "example@example.org",
  onSkip: action("onSkip"),
  onVerificationSuccess: action("onVerificationSuccess"),
};
