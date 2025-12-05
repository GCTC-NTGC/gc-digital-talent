import { useIntl } from "react-intl";

import { assertUnreachable } from "@gc-digital-talent/helpers";
import { Notice } from "@gc-digital-talent/ui";

import { useEmailVerification } from "./EmailVerification";

export type ContextMessage = "contact-matches-work" | "must-request-code";

const SubmitVerificationCodeContextMessage = () => {
  const intl = useIntl();

  const {
    state: { submitVerificationCodeContextMessage: message },
  } = useEmailVerification();

  if (message == null) return null;

  switch (message) {
    case "contact-matches-work":
      return (
        <Notice.Root>
          <Notice.Title>
            {intl.formatMessage({
              defaultMessage:
                "Your contact email will be used to verify your employee status",
              id: "PvS4Lq",
              description:
                "Title for a message informing the user that their contact email will be used as a work email.",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "We noticed that the email you've provided is also a Government of Canada employee work email. Once verified, this email will automatically act as both your contact email and the email used to verify your status as an employee.",
                id: "zn/6gt",
                description:
                  "Body for a message informing the user that their contact email will be used as a work email.",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      );
    case "must-request-code":
      return (
        <Notice.Root color="error">
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  'You need to verify your email in order to continue. Please use the "Send verification email" button and enter the code you receive into the field that appears.',
                id: "t7hBcy",
                description:
                  "Body for a message informing the user that they must request a code.",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      );
    default:
      return assertUnreachable(message);
  }
};

export default SubmitVerificationCodeContextMessage;
