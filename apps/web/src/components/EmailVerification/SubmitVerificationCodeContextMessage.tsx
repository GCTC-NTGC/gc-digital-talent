import { useIntl } from "react-intl";

import { assertUnreachable } from "@gc-digital-talent/helpers";
import { Notice } from "@gc-digital-talent/ui";

import { useEmailVerification } from "./EmailVerification";

export type ContextMessage = "must-request-code";

const SubmitVerificationCodeContextMessage = () => {
  const intl = useIntl();

  const {
    state: { submitVerificationCodeContextMessage: message },
  } = useEmailVerification();

  if (message == null) return null;

  switch (message) {
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
