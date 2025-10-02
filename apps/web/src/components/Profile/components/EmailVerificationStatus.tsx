import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";

import { Maybe } from "@gc-digital-talent/graphql";

interface EmailVerificationStatusProps {
  isEmailVerified?: Maybe<boolean>;
}

const EmailVerificationStatus = ({
  isEmailVerified,
}: EmailVerificationStatusProps) => {
  const intl = useIntl();

  return isEmailVerified ? (
    <CheckCircleIcon
      className="size-6 text-success"
      aria-label={intl.formatMessage({
        defaultMessage: "Verified",
        id: "GMglI5",
        description: "The email address has been verified to be owned by user",
      })}
    />
  ) : null;
};

export default EmailVerificationStatus;
