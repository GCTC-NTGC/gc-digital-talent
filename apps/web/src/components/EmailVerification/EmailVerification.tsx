import { useIntl } from "react-intl";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button, Heading, Link } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

type FormValues = {
  verificationCode: string;
};

interface EmailVerificationProps {
  // The email address that the code was sent to.  Displayed to the user.
  emailAddress: string;
  // Where the user is navigated if verification is successful.
  successUrl: string;
  // Where is user navigated if they choose to skip.  Skip button removed if prop not provided.
  skipUrl?: string;
}

const EmailVerification = ({
  emailAddress,
  successUrl,
  skipUrl,
}: EmailVerificationProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({});
  const navigate = useNavigate();

  const requestACode = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    console.debug("A code was sent");
  };

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
      console.debug(`navigating to ${successUrl}`);
      navigate(successUrl);
    } catch (e) {
      console.debug(
        intl.formatMessage({
          defaultMessage: "The code entered was incorrect.",
          id: "2xBxZ9",
          description: "Title for error message when the code is not valid.",
        }),
        intl.formatMessage({
          defaultMessage:
            "Please review the code and try entering it again. If you're still having trouble, try sending a new code using the link provided. Send a new code.",
          id: "NFQurH",
          description: "Error message when the code is not valid.",
        }),
      );
    }
  };

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
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
        {intl.formatMessage(
          {
            defaultMessage:
              "Please verify your email address by entering the 6 character code that has been sent to {emailAddress}.",
            id: "MZ0uNW",
            description: "instructions for email verification form",
          },
          {
            emailAddress,
          },
        )}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
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
          <div
            data-h2-margin-top="base(x1)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
            data-h2-gap="base(x1)"
          >
            <Submit />
            {skipUrl ? (
              <Link color="secondary" mode="inline" href={skipUrl}>
                {intl.formatMessage({
                  defaultMessage: "Skip for now",
                  id: "eoIad5",
                  description: "label for skip button",
                })}
              </Link>
            ) : null}
            <div data-h2-flex-grow="base(2)" data-h2-text-align="base(end)">
              {intl.formatMessage({
                defaultMessage: "Didn’t receive a code?",
                id: "MvD/iS",
                description: "intro to request a new code",
              })}{" "}
              <Button
                type="button" // doesn't participate in the form
                mode="inline"
                color="black"
                onClick={requestACode}
              >
                {intl.formatMessage({
                  defaultMessage: "Send another one.",
                  id: "hx8mTr",
                  description: "button to request a new code",
                })}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EmailVerification;
