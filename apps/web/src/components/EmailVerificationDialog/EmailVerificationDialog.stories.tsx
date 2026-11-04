import type { StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { within, userEvent, screen } from "storybook/test";

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
      SendUserEmailsVerification: {
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

export const WorkEmail = Template.bind({});
WorkEmail.args = {
  emailAddress: "user@gc.ca",
};

export const CodeRequested = Template.bind({});
CodeRequested.args = {
  emailAddress: "user@gc.ca",
};
CodeRequested.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /send/i });
  await userEvent.click(submitBtn);
};

export const Throttled = Template.bind({});
Throttled.args = {
  emailAddress: "user@gc.ca",
};
Throttled.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /send/i });
  await userEvent.click(submitBtn);
  await userEvent.click(submitBtn);
};

export const EmailChanged = Template.bind({});
EmailChanged.args = {
  emailAddress: "user@gc.ca",
};
EmailChanged.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /send/i });
  const emailInput = dialog.getByRole("textbox", { name: /work email/i });
  await userEvent.click(submitBtn);
  await userEvent.clear(emailInput);
  await userEvent.type(emailInput, "user2@gc.ca");
  await userEvent.click(emailInput);
};

export const MustRequestCode = Template.bind({});
MustRequestCode.args = {
  emailAddress: "user@gc.ca",
};
MustRequestCode.play = async () => {
  const dialog = within(screen.getByRole("dialog"));
  const submitBtn = dialog.getByRole("button", { name: /save/i });
  await userEvent.click(submitBtn);
};
