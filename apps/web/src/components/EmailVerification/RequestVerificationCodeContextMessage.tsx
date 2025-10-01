import { useIntl } from "react-intl";

import { assertUnreachable } from "@gc-digital-talent/helpers";
import { Well } from "@gc-digital-talent/ui";

import { CODE_REQUEST_THROTTLE_DELAY_S } from "./SendVerificationEmailSubform";
import { useEmailVerification } from "./EmailVerificationProvider";

const RequestACodeContextMessage = () => {
  const intl = useIntl();

  const { requestACodeMessage: message } = useEmailVerification();

  if (message == null) return null;

  switch (message) {
    case "request-sent":
      return (
        <Well color="success">
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
        <Well color="error">
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Please wait {seconds}s before requesting another verification email.",
                id: "zIMhFQ",
                description:
                  "Body for a message informing the user that they must wait before requesting another email.",
              },
              {
                seconds: CODE_REQUEST_THROTTLE_DELAY_S,
              },
            )}
          </p>
        </Well>
      );
    case "address-changed":
      return (
        <Well color="error">
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
