import { useState, useEffect, ReactNode } from "react";
import { IntlShape, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog, Well } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { EmailType, graphql } from "@gc-digital-talent/graphql";
import { workEmailDomainRegex } from "@gc-digital-talent/helpers";

const EmailVerificationRequestACode_Mutation = graphql(/* GraphQL */ `
  mutation EmailVerificationRequestACode(
    $input: SendUserEmailsVerificationInput!
  ) {
    sendUserEmailsVerification(sendUserEmailsVerificationInput: $input) {
      id
    }
  }
`);

const EmailVerificationSubmitACode_Mutation = graphql(/* GraphQL */ `
  mutation EmailVerificationSubmitACode($code: String!) {
    verifyUserEmails(code: $code) {
      id
    }
  }
`);

const getDescription = (
  emailType: EmailVerificationProps["emailType"],
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
  emailType: EmailVerificationProps["emailType"],
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
  emailType: EmailVerificationProps["emailType"],
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

interface RequestACodeFormValues {
  emailAddress: string;
  emailType: string;
}

interface SubmitACodeFormValues {
  verificationCode: string;
}

export interface EmailVerificationProps {
  emailType: EmailType;
  emailAddress?: string | null;
  onVerificationSuccess: () => void;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export const EmailVerificationDialog = ({
  emailType: dialogEmailType,
  emailAddress: initialEmailAddress,
  onVerificationSuccess,
  children,
  defaultOpen = false,
}: EmailVerificationProps) => {
  const intl = useIntl();
  const [, executeRequestACodeMutation] = useMutation(
    EmailVerificationRequestACode_Mutation,
  );
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);
  const [showVerificationInput, setShowVerificationInput] = useState(false); // show the bottom half of the form where you can submit the code
  const [showEmailSentMessage, setShowEmailSentMessage] = useState(false); // a confirmation message that the verification email was sent
  const [
    showContactEmailIsWorkEmailMessage,
    setContactEmailIsWorkEmailMessage,
  ] = useState(false); // a message informing the user that the contact email will be used as a work email

  const [, executeSubmitACodeMutation] = useMutation(
    EmailVerificationSubmitACode_Mutation,
  );
  const requestACodeFormMethods = useForm<RequestACodeFormValues>({
    defaultValues: {
      emailAddress: initialEmailAddress ?? undefined,
      emailType: dialogEmailType,
    },
  });
  const submitACodeFormMethods = useForm<SubmitACodeFormValues>({});

  const [canRequestCode, setCanRequestCode] = useState<boolean>(true);

  const resetDialog = () => {
    setShowEmailSentMessage(false);
    setContactEmailIsWorkEmailMessage(false);
    requestACodeFormMethods.reset();
    submitACodeFormMethods.reset();
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    setOpen(open);
  };

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

  const submitHandlerRequestACode: SubmitHandler<RequestACodeFormValues> = ({
    emailAddress,
    emailType,
  }): Promise<void> => {
    setShowEmailSentMessage(false);
    setContactEmailIsWorkEmailMessage(false);
    if (!canRequestCode) {
      throw new Error("Can't request a code");
    }
    let emailTypes: EmailType[];
    switch (emailType) {
      case EmailType.Contact.toString():
        if (workEmailDomainRegex.test(emailAddress)) {
          // Appears to be a valid work email address.  We'll update both at the same time.
          emailTypes = [EmailType.Contact, EmailType.Work];
          setContactEmailIsWorkEmailMessage(true);
        } else {
          emailTypes = [EmailType.Contact];
        }
        break;
      case EmailType.Work.toString():
        emailTypes = [EmailType.Work];
        break;
      default:
        throw new Error("Unexpected email type: " + emailType);
    }
    const mutationResult = executeRequestACodeMutation({
      input: {
        emailAddress,
        emailTypes,
      },
    }).then((result) => {
      if (!result.data?.sendUserEmailsVerification?.id) {
        throw new Error("Send email error");
      }
    });

    return mutationResult
      .then(() => {
        setShowEmailSentMessage(true);
        setCanRequestCode(false);
        setShowVerificationInput(true); // show the verification code input after email is sent
      })
      .catch(() => {
        toast.error(intl.formatMessage(errorMessages.error));
      });
  };

  const submitHandlerSubmitACode: SubmitHandler<SubmitACodeFormValues> = ({
    verificationCode,
  }): Promise<void> => {
    setShowEmailSentMessage(false);
    const mutationResult = executeSubmitACodeMutation({
      code: verificationCode,
    }).then((result) => {
      if (!result.data?.verifyUserEmails?.id) {
        throw new Error("Verify code error");
      }
    });

    return mutationResult
      .then(() => {
        // close the dialog
        setOpen(false);

        //fire event to parent
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
                    onClick={requestACodeFormMethods.handleSubmit(
                      submitHandlerRequestACode,
                    )}
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
    <Dialog.Root open={isOpen} onOpenChange={handleDialogOpenChange}>
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
        <Dialog.Header subtitle={getSubtitle(dialogEmailType, intl)}>
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
          {/* "Request a code" part of dialog */}
          <FormProvider {...requestACodeFormMethods}>
            <form
              onSubmit={requestACodeFormMethods.handleSubmit(
                submitHandlerRequestACode,
              )}
              className="mb-6 flex flex-col gap-6"
            >
              <p>{getDescription(dialogEmailType, intl)}</p>
              <div className="flex gap-2">
                <div className="grow">
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="text"
                    label={getLabel(dialogEmailType, intl)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                </div>
                <div className="self-end">
                  <Submit
                    mode="solid"
                    className="font-bold"
                    text={intl.formatMessage({
                      defaultMessage: "Send verification email",
                      id: "xKj/Lr",
                      description: "Button to send verification code",
                    })}
                  />
                </div>
              </div>
              {showEmailSentMessage ? (
                <Well color="success">
                  <p className="font-bold">
                    {intl.formatMessage({
                      defaultMessage: "Verification email sent!",
                      id: "oepQr+",
                      description:
                        "Title for a message confirming that the verification email was sent.",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Please enter the code you received in the field provided. Didn’t receive a code? You can request a new one using the button provided.",
                      id: "UOpnBD",
                      description:
                        "Body for a message confirming that the verification email was sent.",
                    })}
                  </p>
                </Well>
              ) : null}
            </form>
          </FormProvider>
          {/* "Submit a code" part of dialog */}
          <FormProvider {...submitACodeFormMethods}>
            <form
              onSubmit={submitACodeFormMethods.handleSubmit(
                submitHandlerSubmitACode,
              )}
            >
              <div className="mb-6 flex flex-col gap-6">
                {showVerificationInput && (
                  <>
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
                    {showContactEmailIsWorkEmailMessage ? (
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
                              "PWe noticed that the email you’ve provided is also a Government of Canada employee email. Once verified, this email will automatically act as both your contact email and the email used to verify your status as an employee.",
                            id: "ZM84gk",
                            description:
                              "Body for a message informing the user that their contact email will be used as a work email.",
                          })}
                        </p>
                      </Well>
                    ) : null}
                  </>
                )}
              </div>
              <Dialog.Footer>
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Save and add email",
                    id: "exfH1c",
                    description: "Button to save and add email",
                  })}
                />
                <Button
                  color="warning"
                  mode="inline"
                  onClick={() => setOpen(false)}
                >
                  {intl.formatMessage(commonMessages.cancel)}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EmailVerificationDialog;
