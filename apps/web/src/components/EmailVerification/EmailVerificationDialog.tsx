import { useState, useEffect, ReactNode } from "react";
import { IntlShape, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { EmailType, graphql } from "@gc-digital-talent/graphql";

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

const getSubtitle = (
  emailType: NonNullable<EmailVerificationProps["emailType"]>,
  intl: IntlShape,
) => {
  switch (emailType) {
    case EmailType.Work:
      return intl.formatMessage({
        defaultMessage:
          "Verify your Government of Canada work email to confirm your status as an employee.",
        id: "UoTwQ8",
        description: "Work email subtitle",
      });
    case EmailType.Contact:
    default:
      return intl.formatMessage({
        defaultMessage:
          "Add and verify a contact email that will be used for communication and notifications.",
        id: "upuqPk",
        description: "Contact email subtitle",
      });
  }
};

const CODE_REQUEST_THROTTLE_DELAY_MS = 1000 * 60;

interface FormValues {
  verificationCode: string;
}

export interface EmailVerificationProps {
  onCancel: () => void;
  emailType?: EmailType;
  emailAddress?: string | null;
  onVerificationSuccess: () => void;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export const EmailVerificationDialog = ({
  onCancel,
  emailType = EmailType.Contact,
  onVerificationSuccess,
  children,
  defaultOpen = false,
}: EmailVerificationProps) => {
  const intl = useIntl();
  const [, executeSendEmailMutation] = useMutation(
    SendUserEmailVerification_Mutation,
  );
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);
  const [showVerificationInput, setShowVerificationInput] = useState(false);

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

  const submitHandlerRequestACode = (): Promise<void> => {
    if (!canRequestCode) {
      return Promise.resolve();
    }
    return executeSendEmailMutation({
      emailType,
    })
      .then((result) => {
        if (!result.data?.sendUserEmailVerification?.id) {
          throw new Error("Send email error");
        }
        setCanRequestCode(false);
        setShowVerificationInput(true); // show the verification code input after email is sent
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
        onCancel();
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
                  {intl.formatMessage({
                    defaultMessage:
                      "If you're still having trouble, try sending a new code using the link provided.",
                    id: "NAobki",
                    description: "Instructions to send another code",
                  })}
                  <Button
                    type="button"
                    mode="text"
                    color="black"
                    onClick={submitHandlerRequestACode}
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

  const handleCancelClick = () => {
    // close the dialog
    setOpen(false);

    // fire event to parent
    onCancel();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {children || (
          <Button>
            {intl.formatMessage({
              defaultMessage: "Verify your email address",
              id: "2/S+Ro",
              description: "Button text for email verification dialog trigger",
            })}
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header subtitle={getSubtitle(emailType, intl)}>
          {
            <h2 className="text-lg font-bold">
              {intl.formatMessage({
                defaultMessage: "Email Verification",
                id: "pHrHab",
                description: "Title for email verification dialog",
              })}
            </h2>
          }
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col gap-6">
            <p>{getDescription(emailType, intl)}</p>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(submitHandlerRequestACode)}>
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
                  <Submit
                    mode="solid"
                    className="self-end font-bold"
                    text={intl.formatMessage({
                      defaultMessage: "Send verification email",
                      id: "xKj/Lr",
                      description: "Button to send verification code",
                    })}
                  />
                </div>
              </form>
            </FormProvider>
            {showVerificationInput && (
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
            )}
            <Dialog.Footer>
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
                    onClick={submitHandlerRequestACode}
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
              {/* <Submit
                text={intl.formatMessage({
                  defaultMessage: "Save and add email",
                  id: "exfH1c",
                  description: "Button to save and add email",
                })}
              /> */}
              <Button color="warning" mode="inline" onClick={handleCancelClick}>
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Footer>
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EmailVerificationDialog;
