import { useIntl } from "react-intl";
import { HTMLProps, ReactNode } from "react";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import { FormProvider, useForm } from "react-hook-form";

import { Button, Heading } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

interface EmailVerificationProps {
  emailAddress: string;
}

const EmailVerification = ({ emailAddress }: EmailVerificationProps) => {
  const intl = useIntl();
  const methods = useForm<{ verificationCode: string }>({});

  return (
    <>
      <Heading
        level="h2"
        size="h3"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(0)"
        Icon={CheckBadgeIcon}
        color="primary"
      >
        {intl.formatMessage({
          defaultMessage: "Verify your contact email",
          id: "TguSOt",
          description: "Heading for email verification form",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Please verify your email address by entering the 6 character code that has been sent to gloria.bellefontaine@email.com.",
          id: "A0T5gu",
          description: "instructions for email verification form",
        })}
      </p>
      <FormProvider {...methods}>
        <form>
          <Input
            id="verificationCode"
            name="verificationCode"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "Verification code",
              id: "T+ypau",
              description: "label for verification code input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Submit />
          <Button color="secondary" mode="inline">
            {intl.formatMessage({
              defaultMessage: "Skip for now",
              id: "eoIad5",
              description: "label for skip button",
            })}
          </Button>
          <p>
            {intl.formatMessage({
              defaultMessage: "Didn’t receive a code? Send another one.",
              id: "fvHmIY",
              description: "link to request a new code",
            })}
          </p>
        </form>
      </FormProvider>
    </>
  );
};

export default EmailVerification;
