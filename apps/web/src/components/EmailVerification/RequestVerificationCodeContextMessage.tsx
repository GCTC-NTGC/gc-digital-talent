import { useIntl } from "react-intl";

import { assertUnreachable } from "@gc-digital-talent/helpers";
import { Well } from "@gc-digital-talent/ui";

import { useEmailVerification } from "./EmailVerification";

export type ContextMessage =
  | { code: "request-sent" }
  | { code: "throttled"; remainingSeconds: number }
  | { code: "address-changed" };

const RequestVerificationCodeContextMessage = () => {
  const intl = useIntl();

  const {
    state: { requestVerificationCodeContextMessage: message },
  } = useEmailVerification();

  if (message == null) return null;

  switch (message.code) {
    case "request-sent":
      return (
        <Well color="success" id="unsaved-emailAddress">
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Verification email sent!",
              id: "oepQr+",
              description:
                "Title for a message confirming that the verification email was sent.",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please enter the code you received in the field provided. Didn’t receive a code? You can request a new one using the button provided.",
              id: "UOpnBD",
              description:
                "Body for a message confirming that the verification email was sent.",
            })}
          </p>
        </Well>
      );
    case "throttled":
      return (
        <Well color="error" id="unsaved-emailAddress">
          <p>
            {intl.formatMessage(
              {
                defaultMessage: `Please wait {delay, plural,
                    one { # second }
                    other { # seconds }
                  } before requesting another verification email.`,
                id: "Vl0+/x",
                description:
                  "Body for a message informing the user that they must wait before requesting another email.",
              },
              {
                delay: message.remainingSeconds,
              },
            )}
          </p>
        </Well>
      );
    case "address-changed":
      return (
        <Well color="error" id="unsaved-emailAddress">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "The email provided has changed since the last verification code was sent. Please request a new verification email.",
              id: "F2ChSj",
              description:
                "Body for a message informing the user that they changed the address and need to request a new code.",
            })}
          </p>
        </Well>
      );
    default:
      return assertUnreachable(message);
  }
};

export default RequestVerificationCodeContextMessage;
