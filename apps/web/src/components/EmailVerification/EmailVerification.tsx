import { useState, useEffect, useReducer } from "react";
import { useIntl } from "react-intl";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Heading } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { graphql } from "@gc-digital-talent/graphql";
import { useLogger } from "@gc-digital-talent/logger";
import { useAuthorization } from "@gc-digital-talent/auth";

const SendUserEmailVerification_Mutation = graphql(/* GraphQL */ `
  mutation SendUserEmailVerification($id: ID!) {
    sendUserEmailVerification(id: $id) {
      id
      emailVerifiedAt
    }
  }
`);

const VerifyUserEmail_Mutation = graphql(/* GraphQL */ `
  mutation VerifyUserEmail($id: ID!, $code: String!) {
    verifyUserEmail(id: $id, code: $code) {
      id
      emailVerifiedAt
    }
  }
`);

const getTitle = (
  emailType: NonNullable<EmailVerificationProps["emailType"]>,
) => {
  switch (emailType) {
    // presumably we'll have more than one type eventually
    case "contact":
    default:
      return {
        defaultMessage: "Verify your contact email",
        id: "TguSOt",
        description: "Heading for email verification form",
      };
  }
};

const CODE_REQUEST_THROTTLE_DELAY_MS = 1000 * 60;

type FormValues = {
  verificationCode: string;
};

export interface EmailVerificationProps {
  emailType?: "contact";
  // The email address that the code was sent to.  Displayed to the user.
  emailAddress: string;
  // Event if verification is successful.
  onVerificationSuccess: () => void;
  // Event if they choose to skip.  Skip button removed if prop not provided.
  onSkip?: () => void;
}

const EmailVerification = ({
  emailType = "contact",
  emailAddress,
  onVerificationSuccess,
  onSkip,
}: EmailVerificationProps) => {
  const intl = useIntl();
  const logger = useLogger();
  const { userAuthInfo } = useAuthorization();
  const [, executeSendEmailMutation] = useMutation(
    SendUserEmailVerification_Mutation,
  );
  const [, executeVerifyUserEmailMutation] = useMutation(
    VerifyUserEmail_Mutation,
  );
  const methods = useForm<FormValues>({});

  const [noCodeRequestUntil, setNoCodeRequestUntil] = useState<number>(0);
  const msUntilCanRequestACode = Math.max(0, noCodeRequestUntil - Date.now());
  const canRequestACode = msUntilCanRequestACode === 0;
  const [, forceUpdate] = useReducer((x) => x + 1, 0); // https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate

  // if we can't send a code yet, set a timer for the point at which we can
  useEffect(() => {
    if (msUntilCanRequestACode > 0) {
      const interval = setInterval(() => {
        forceUpdate();
      }, msUntilCanRequestACode);

      return () => {
        clearInterval(interval);
      };
    }

    return () => {
      // nothing to clean up if we're not waiting for an interval
    };
  }, [msUntilCanRequestACode]);

  const requestACode = async () => {
    executeSendEmailMutation({
      id: userAuthInfo?.id,
    })
      .then((result) => {
        if (!result.data?.sendUserEmailVerification?.id) {
          throw new Error("Send email error");
        }
        logger.debug("A code was sent");
        setNoCodeRequestUntil(Date.now() + CODE_REQUEST_THROTTLE_DELAY_MS);
      })
      .catch(() => {
        toast.error(intl.formatMessage(errorMessages.error));
      });
  };

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    executeVerifyUserEmailMutation({
      id: userAuthInfo?.id,
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
                    mode="inline"
                    color="black"
                    onClick={requestACode}
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
        Icon={CheckBadgeIcon}
        color="primary"
        data-h2-text-align="base(center) p-tablet(left)"
      >
        {intl.formatMessage(getTitle(emailType))}
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
            ) : null}
            <Submit data-h2-order="base(2) p-tablet(1)" />
            {onSkip ? (
              <Button
                type="button"
                color="secondary"
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

export default EmailVerification;
