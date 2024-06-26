import { useIntl } from "react-intl";
import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "urql";

import { Button, Heading, Link } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { graphql } from "@gc-digital-talent/graphql";
import { useLogger } from "@gc-digital-talent/logger";

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
  const logger = useLogger();
  const [, executeSendEmailMutation] = useMutation(
    SendUserEmailVerification_Mutation,
  );
  const [, executeVerifyUserEmailMutation] = useMutation(
    VerifyUserEmail_Mutation,
  );
  const methods = useForm<FormValues>({});
  const navigate = useNavigate();

  const requestACode = async () => {
    executeSendEmailMutation({
      id: "0",
    })
      .then((result) => {
        if (!result.data?.sendUserEmailVerification?.id) {
          throw new Error("Send email error");
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage(errorMessages.error));
      });
    logger.debug("A code was sent");
  };

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    executeVerifyUserEmailMutation({
      id: "0",
      code: data.verificationCode,
    })
      .then((result) => {
        if (!result.data?.verifyUserEmail?.id) {
          throw new Error("Verify code error");
        }
        console.debug(`navigating to ${successUrl}`);
        navigate(successUrl);
      })
      .catch(() => {
        toast.error(
          <>
            <p>
              <strong>
                {intl.formatMessage({
                  defaultMessage: "The code entered was incorrect.",
                  id: "2xBxZ9",
                  description:
                    "Title for error message when the code is not valid.",
                })}
              </strong>
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Please review the code and try entering it again. If you're still having trouble, try sending a new code using the link provided. Send a new code.",
                id: "NFQurH",
                description: "Error message when the code is not valid.",
              })}
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
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-align-items="base(center)"
            data-h2-gap="base(x1)"
          >
            <div
              data-h2-text-align="base(center)"
              data-h2-order="base(1) p-tablet(2)"
            >
              {intl.formatMessage({
                defaultMessage: "Didn’t receive a code?",
                id: "MvD/iS",
                description: "intro to request a new code",
              })}
              <span data-h2-white-space="base(pre) p-tablet(normal)">
                {/* conditional newline */}
                {"\n"}
              </span>
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
            <Submit data-h2-order="base(2) p-tablet(1)" />
            {skipUrl ? (
              <Link
                color="secondary"
                mode="inline"
                href={skipUrl}
                data-h2-order="base(2) p-tablet(1)"
              >
                {intl.formatMessage({
                  defaultMessage: "Skip for now",
                  id: "eoIad5",
                  description: "label for skip button",
                })}
              </Link>
            ) : null}
            <div
              data-h2-flex-grow="base(1) p-tablet(2)"
              data-h2-display="base(none) p-tablet(block)"
              data-h2-order="base(2) p-tablet(1)"
            />
            {/* conditional spacer */}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EmailVerification;
