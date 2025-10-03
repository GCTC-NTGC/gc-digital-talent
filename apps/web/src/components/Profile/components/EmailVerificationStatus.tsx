import { useIntl } from "react-intl";

import { Button, Chip } from "@gc-digital-talent/ui";

interface EmailVerificationStatusProps {
  isEmailVerified?: boolean;
  readOnly?: boolean;
  onClickVerify?: () => Promise<void>;
}

const EmailVerificationStatus = ({
  isEmailVerified,
  onClickVerify,
  readOnly,
}: EmailVerificationStatusProps) => {
  const intl = useIntl();

  return isEmailVerified ? (
    <Chip color="success" className="-mb-0.25">
      {intl.formatMessage({
        defaultMessage: "Verified",
        id: "GMglI5",
        description: "The email address has been verified to be owned by user",
      })}
    </Chip>
  ) : (
    <>
      <Chip color="error" className="-mb-0.25">
        {intl.formatMessage({
          defaultMessage: "Unverified",
          id: "tUIvbq",
          description:
            "The email address has not been verified to be owned by user",
        })}
      </Chip>
      {!readOnly && (
        <Button
          type="button"
          mode="inline"
          color="error"
          className="-mt-0.25"
          onClick={onClickVerify}
        >
          {intl.formatMessage({
            defaultMessage: "Verify now",
            id: "ADPfNp",
            description:
              "Button to start the email address verification process",
          })}
        </Button>
      )}
    </>
  );
};

export default EmailVerificationStatus;
