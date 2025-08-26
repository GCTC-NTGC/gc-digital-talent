import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { EmailType } from "@gc-digital-talent/graphql";

import EmailVerificationDialog from "./EmailVerificationDialog";

export default {
  component: EmailVerificationDialog,
};

const Template: StoryFn<typeof EmailVerificationDialog> = (args) => {
  return <EmailVerificationDialog {...args} />;
};

export const ContactEmail = Template.bind({});
ContactEmail.args = {
  emailType: EmailType.Contact,
  emailAddress: "user@example.com",
  onVerificationSuccess: action("onVerificationSuccess"),
};

export const WorkEmail = Template.bind({});
WorkEmail.args = {
  emailType: EmailType.Work,
  emailAddress: "user@canada.ca",
  onVerificationSuccess: action("onVerificationSuccess"),
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  emailType: EmailType.Contact,
  emailAddress: "user@example.com",
  onVerificationSuccess: action("onVerificationSuccess"),
};
ErrorState.play = ({ canvasElement }) => {
  // Simulate entering an invalid code and submitting to show error state
  const input = canvasElement.querySelector('input[name="verificationCode"]');
  if (input) {
    input.value = "wrong";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
  const form = canvasElement.querySelector("form");
  if (form) {
    form.dispatchEvent(new Event("submit", { bubbles: true }));
  }
};
