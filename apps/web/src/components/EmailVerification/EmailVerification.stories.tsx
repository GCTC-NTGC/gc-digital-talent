import { StoryFn } from "@storybook/react";
import { action } from "storybook/actions";

import { EmailType } from "@gc-digital-talent/graphql";

import { EmailVerification } from "./EmailVerification";

export default {
  component: EmailVerification,
};

const Template: StoryFn<typeof EmailVerification> = (args) => {
  return <EmailVerification {...args} />;
};

export const ContactEmail = Template.bind({});
ContactEmail.args = {
  emailType: EmailType.Contact,
  emailAddress: "example@example.org",
  onSkip: action("onSkip"),
  onVerificationSuccess: action("onVerificationSuccess"),
};

export const WorkEmail = Template.bind({});
WorkEmail.args = {
  emailType: EmailType.Work,
  emailAddress: "example@gc.ca",
  onSkip: action("onSkip"),
  onVerificationSuccess: action("onVerificationSuccess"),
};
