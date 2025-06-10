import { useState, useEffect } from "react";
import { IntlShape, useIntl } from "react-intl";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Heading } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { EmailType, graphql } from "@gc-digital-talent/graphql";
import { useLogger } from "@gc-digital-talent/logger";

const SendUserEmailVerification_Mutation = graphql(/* GraphQL */ `
  mutation SendUserEmailVerification($emailType: EmailType) {
    sendUserEmailVerification(emailType: $emailType) {
      id
    }
  }
`);

const VerifyUserEmail_Mutation = graphql(/* GraphQL */ `
  mutation VerifyUserEmail($emailType: EmailType, $code: String!) {
    verifyUserEmail(emailType: $emailType, code: $code) {
      id
    }
  }
`);

const getTitle = (
  emailType: NonNullable<EmailVerificationProps["emailType"]>,
  intl: IntlShape,
) => {
  switch (emailType) {
    case EmailType.Work:
      return intl.formatMessage({
        defaultMessage: "Verify your work email",
        id: "T7irec",
        description: "Verify your work email text",
      });
    case EmailType.Contact:
    default:
      return intl.formatMessage({
        defaultMessage: "Verify your contact email",
        id: "LpCMiC",
        description: "Verify your contact email text",
      });
  }
};

const CODE_REQUEST_THROTTLE_DELAY_MS = 1000 * 60;

interface FormValues {
  verificationCode: string;
}

export interface EmailVerificationProps {
  emailType?: EmailType;
  // The email address that the code was sent to.  Displayed to the user.
  emailAddress?: string | null;
  // Event if verification is successful.
  onVerificationSuccess: () => void;
  // Event if they choose to skip.  Skip button removed if prop not provided.
  onSkip?: () => void;
}

export const EmailVerification = ({
  emailType = EmailType.Contact,
  emailAddress,
  onVerificationSuccess,
  onSkip,
}: EmailVerificationProps) => {
  const intl = useIntl();
  const logger = useLogger();
  const [, executeSendEmailMutation] = useMutation(
    SendUserEmailVerification_Mutation,
  );
  const [, executeVerifyUserEmailMutation] = useMutation(
    VerifyUserEmail_Mutation,
  );
  const methods = useForm<FormValues>({});

  const [canRequestACode, setCanRequestACode] = useState<boolean>(true);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    if (!canRequestACode) {
      timerId = setTimeout(() => {
        setCanRequestACode(true);
      }, CODE_REQUEST_THROTTLE_DELAY_MS);
    }

    return () => clearTimeout(timerId);
  }, [canRequestACode]);

  const requestACode = () => {
    executeSendEmailMutation({
      emailType,
    })
      .then((result) => {
        if (!result.data?.sendUserEmailVerification?.id) {
          throw new Error("Send email error");
        }
        // eslint-disable-next-line testing-library/no-debugging-utils
        logger.debug("A code was sent");
        setCanRequestACode(false);
      })
      .catch(() => {
        toast.error(intl.formatMessage(errorMessages.error));
      });
  };

  const submitHandler: SubmitHandler<FormValues> = (data: FormValues) => {
    executeVerifyUserEmailMutation({
      emailType,
      code: data.verificationCode,
    })
      .then((result) => {
        if (!result.data?.verifyUserEmail?.id) {
          throw new Error("Verify code error");
        }
        onVerificationSuccess();
      })
      .catch(() => {
        toast.error(
          <>
            <p data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "The code entered was incorrect.",
                id: "2xBxZ9",
                description:
                  "Title for error message when the code is not valid.",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Please review the code and try entering it again.",
                id: "vm9mFv",
                description: "Error message when the code is not valid.",
              })}
              {canRequestACode ? (
                <>
                  {" "}
                  {intl.formatMessage({
                    defaultMessage:
                      "If you're still having trouble, try sending a new code using the link provided.",
                    id: "NAobki",
                    description: "Instructions to send another code",
                  })}{" "}
                  <Button
                    type="button"
                    mode="text"
                    color="black"
                    onClick={requestACode}
                    className="font-bold"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Send a new code.",
                      id: "8P9Rjx",
                      description: "Button text to send a new code",
                    })}
                  </Button>
                </>
              ) : null}
            </p>
          </>,
        );
      });
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
        icon={CheckBadgeIcon}
        color="secondary"
        data-h2-text-align="base(center) p-tablet(left)"
      >
        {getTitle(emailType, intl)}
      </Heading>
      <p>
        {emailAddress
          ? intl.formatMessage(
              {
                defaultMessage:
                  "Please verify your email address by entering the 6 character code that has been sent to {emailAddress}.",
                id: "MZ0uNW",
                description: "instructions for email verification form",
              },
              {
                emailAddress,
              },
            )
          : null}
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
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-align-items="base(center)"
            data-h2-gap="base(x1)"
          >
            {canRequestACode ? (
              <div
                data-h2-text-align="base(center)"
                data-h2-order="base(1) p-tablet(2)"
                data-h2-margin-left="p-tablet(auto)"
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column) p-tablet(row)"
                data-h2-gap="p-tablet(0 1ch)"
              >
                {intl.formatMessage({
                  defaultMessage: "Didn’t receive a code?",
                  id: "MvD/iS",
                  description: "intro to request a new code",
                })}
                <Button
                  type="button" // doesn't participate in the form
                  mode="text"
                  color="black"
                  onClick={requestACode}
                  className="font-bold"
                >
                  {intl.formatMessage({
                    defaultMessage: "Send another one.",
                    id: "hx8mTr",
                    description: "button to request a new code",
                  })}
                </Button>
              </div>
            ) : null}
            <Submit data-h2-order="base(2) p-tablet(1)" />
            {onSkip ? (
              <Button
                type="button"
                color="primary"
                mode="inline"
                onClick={onSkip}
                data-h2-order="base(2) p-tablet(1)"
              >
                {intl.formatMessage({
                  defaultMessage: "Skip for now",
                  id: "eoIad5",
                  description: "label for skip button",
                })}
              </Button>
            ) : null}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

const EmailVerificationApi = ({
  emailType,
  ...rest
}: EmailVerificationProps) => {
  const intl = useIntl();
  const logger = useLogger();
  const [, executeSendEmailMutation] = useMutation(
    SendUserEmailVerification_Mutation,
  );

  useEffect(() => {
    // Send initial verification email on page load
    executeSendEmailMutation({
      emailType,
    })
      .then((result) => {
        if (!result.data?.sendUserEmailVerification?.id) {
          throw new Error("Send email error");
        }
        // eslint-disable-next-line testing-library/no-debugging-utils
        logger.debug("Initial code was sent");
      })
      .catch(() => {
        toast.error(intl.formatMessage(errorMessages.error));
      });
  }, [emailType, executeSendEmailMutation, intl, logger]);

  return <EmailVerification emailType={emailType} {...rest} />;
};

export default EmailVerificationApi;
