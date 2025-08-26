import { useState, useEffect } from "react";
import { IntlShape, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
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

const getDescription = (
  emailType: NonNullable<EmailVerificationProps["emailType"]>,
  intl: IntlShape,
) => {
  switch (emailType) {
    case EmailType.Work:
      return intl.formatMessage({
        defaultMessage:
          "In order to verify your work email, the domain must match a known Government of Canada email pattern (e.g. @canada.ca, @department.gc.ca, etc.).",
        id: "RiaRHW",
        description: "Work email title paragraph",
      });
    case EmailType.Contact:
    default:
      return intl.formatMessage({
        defaultMessage:
          "This email will be used by recruitment and HR teams to contact you about opportunities and will also receive notifications about your applications and other platform details.",
        id: "Dd8fch",
        description: "Contact email title paragraph",
      });
  }
};

const getLabel = (
  emailType: NonNullable<EmailVerificationProps["emailType"]>,
  intl: IntlShape,
) => {
  switch (emailType) {
    case EmailType.Work:
      return intl.formatMessage(commonMessages.workEmail);
    case EmailType.Contact:
    default:
      return intl.formatMessage(commonMessages.email);
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

/**
 * EmailVerification component handles the process of verifying a user's email address
 * by sending a verification code and allowing the user to submit the code for validation.
 *
 * @param {EmailVerificationProps} props - The props for the component, including emailType, emailAddress, onVerificationSuccess, and optional onSkip.
 * @returns {JSX.Element} The rendered email verification dialog.
 */
export const EmailVerification = ({
  emailType = EmailType.Contact,
  onVerificationSuccess,
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

  const [canRequestCode, setCanRequestCode] = useState<boolean>(true);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    if (!canRequestCode) {
      timerId = setTimeout(() => {
        setCanRequestCode(true);
      }, CODE_REQUEST_THROTTLE_DELAY_MS);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [canRequestCode]);

  const requestACode = () => {
    if (!canRequestCode) {
      return;
    }
    executeSendEmailMutation({
      emailType,
    })
      .then((result) => {
        if (!result.data?.sendUserEmailVerification?.id) {
          throw new Error("Send email error");
        }
        // eslint-disable-next-line testing-library/no-debugging-utils
        logger.debug("A code was sent");
        setCanRequestCode(false);
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
            <p className="font-bold">
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
              {canRequestCode ? (
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
    <div className="flex flex-col gap-6">
      <p>{getDescription(emailType, intl)}</p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          <div className="flex gap-2">
            <Input
              id="emailAddress"
              name="emailAddress"
              type="text"
              label={getLabel(emailType, intl)}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Button
              type="button"
              onClick={requestACode}
              mode="solid"
              className="self-end font-bold"
            >
              {intl.formatMessage({
                defaultMessage: "Send verification email",
                id: "xKj/Lr",
                description: "Button to send verification code",
              })}
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              id="verificationCode"
              name="verificationCode"
              type="text"
              label={intl.formatMessage({
                defaultMessage: "Verification code",
                id: "T+ypau",
                description: "label for verification code input",
              })}
            />
          </div>
          <div className="mt-6 flex flex-col items-center gap-6 xs:flex-row">
            {canRequestCode ? (
              <div className="order-1 flex flex-col text-center xs:order-2 xs:ml-auto xs:flex-row xs:gap-x-[1ch]">
                {intl.formatMessage({
                  defaultMessage: "Didn’t receive a code?",
                  id: "MvD/iS",
                  description: "intro to request a new code",
                })}
                <Button
                  type="button"
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
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save and add email",
                id: "+cbj04",
                description: "Button to submit verification code",
              })}
            />
            <Button color="warning" mode="inline">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EmailVerification;
