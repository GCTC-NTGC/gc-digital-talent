import { StoryFn } from "@storybook/react";
import { action } from "storybook/actions";
import { within, userEvent, screen } from "storybook/test";

import { EmailType } from "@gc-digital-talent/graphql";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";

import EmailVerificationDialog from "./EmailVerificationDialog";

export default {
  component: EmailVerificationDialog,
  decorators: [MockGraphqlDecorator],
  parameters: {
    apiResponsesConfig: {
      latency: {
        min: 0,
        max: 0,
      },
    },
    apiResponses: {
      EmailVerificationRequestACode: {
        data: {
          sendUserEmailsVerification: {
            id: 1,
          },
        },
      },
    },
  },
};

const Template: StoryFn<typeof EmailVerificationDialog> = (args) => {
  return (
    <EmailVerificationDialog
      {...args}
      defaultOpen
      onVerificationSuccess={action("onVerificationSuccess")}
    />
  );
};

export const ContactEmail = Template.bind({});
ContactEmail.args = {
  emailType: EmailType.Contact,
  emailAddress: "user@example.com",
};

export const WorkEmail = Template.bind({});
WorkEmail.args = {
  emailType: EmailType.Work,
  emailAddress: "user@canada.ca",
};

export const CodeRequested = Template.bind({});
CodeRequested.args = {
  emailType: EmailType.Contact,
  emailAddress: "user@example.com",
};
CodeRequested.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /send/i });
  await userEvent.click(submitBtn);
};

export const Throttled = Template.bind({});
Throttled.args = {
  emailType: EmailType.Contact,
  emailAddress: "user@example.com",
};
Throttled.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /send/i });
  await userEvent.click(submitBtn);
  await userEvent.click(submitBtn);
};

export const EmailChanged = Template.bind({});
EmailChanged.args = {
  emailType: EmailType.Contact,
  emailAddress: "user@example.com",
};
EmailChanged.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /send/i });
  const emailInput = dialog.getByRole("textbox", { name: /contact/i });
  await userEvent.click(submitBtn);
  await userEvent.clear(emailInput);
  await userEvent.type(emailInput, "user2@example.com");
  await userEvent.click(emailInput);
};

export const ContactMatchesWork = Template.bind({});
ContactMatchesWork.args = {
  emailType: EmailType.Contact,
  emailAddress: "user@gc.ca",
};
ContactMatchesWork.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /send/i });
  await userEvent.click(submitBtn);
};

export const MustRequestCode = Template.bind({});
MustRequestCode.args = {
  emailType: EmailType.Contact,
  emailAddress: "user@gc.ca",
};
MustRequestCode.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /save/i });
  await userEvent.click(submitBtn);
};
