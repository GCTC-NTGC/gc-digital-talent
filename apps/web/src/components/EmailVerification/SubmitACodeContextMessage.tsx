import { useIntl } from "react-intl";

import { assertUnreachable } from "@gc-digital-talent/helpers";
import { Well } from "@gc-digital-talent/ui";

interface SubmitACodeContextMessageProps {
  message: null | "contact-matches-work";
}

const SubmitACodeContextMessage = ({
  message,
}: SubmitACodeContextMessageProps) => {
  const intl = useIntl();

  if (message == null) return null;

  switch (message) {
    case "contact-matches-work":
      return (
        <Well color="black">
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage:
                "Your contact email will be used to verify your employee status",
              id: "PvS4Lq",
              description:
                "Title for a message informing the user that their contact email will be used as a work email.",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "We noticed that the email you've provided is also a Government of Canada employee work email. Once verified, this email will automatically act as both your contact email and the email used to verify your status as an employee.",
              id: "zn/6gt",
              description:
                "Body for a message informing the user that their contact email will be used as a work email.",
            })}
          </p>
        </Well>
      );

    default:
      return assertUnreachable(message);
  }
};

export default SubmitACodeContextMessage;
