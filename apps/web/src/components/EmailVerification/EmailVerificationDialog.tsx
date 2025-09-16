import { useState, useEffect, ReactNode, useRef, ComponentProps } from "react";
import { useIntl } from "react-intl";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { EmailType, graphql } from "@gc-digital-talent/graphql";
import {
  emptyToNull,
  notEmpty,
  workEmailDomainRegex,
} from "@gc-digital-talent/helpers";

import { descriptions, labels, subtitles } from "./messages";
import RequestACodeContextMessage from "./RequestACodeContextMessage";
import SubmitACodeContextMessage from "./SubmitACodeContextMessage";

export const CODE_REQUEST_THROTTLE_DELAY_S = 60;

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
  const [emailAddressContacted, setEmailAddressContacted] = useState<
    string | null
  >(null); // what address was an email sent to
  const [requestACodeMessage, setRequestACodeMessage] =
    useState<ComponentProps<typeof RequestACodeContextMessage>["message"]>(
      null,
    ); // messages that can be shown for the top half of the dialog where you can request a code
  const [submitACodeMessage, setSubmitACodeMessage] =
    useState<ComponentProps<typeof SubmitACodeContextMessage>["message"]>(null); // messages that can be shown for the bottom half of the dialog where you can submit a code

  const [canRequestCode, setCanRequestCode] = useState<boolean>(true); // can the user request a code (or do they have to wait)

  const [, executeSubmitACodeMutation] = useMutation(
    EmailVerificationSubmitACode_Mutation,
  );
  const requestACodeFormMethods = useForm<RequestACodeFormValues>({
    defaultValues: {
      emailAddress: initialEmailAddress ?? undefined,
      emailType: dialogEmailType,
    },
  });

  const watchEmailAddressInput = useWatch({
    control: requestACodeFormMethods.control,
    name: "emailAddress",
  });

  const submitACodeFormMethods = useForm<SubmitACodeFormValues>({
    defaultValues: {
      verificationCode: "",
    },
  });

  const timerIdRef = useRef<ReturnType<typeof setTimeout>>(null); // timer for throttling requests

  // Reset all the states back, for example, when closing the dialog.
  const resetDialog = () => {
    setEmailAddressContacted(null);
    setRequestACodeMessage(null);
    setSubmitACodeMessage(null);
    setCanRequestCode(true);
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }
    requestACodeFormMethods.reset();
    submitACodeFormMethods.reset();
  };

  // Close or open the dialog
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    setOpen(open);
  };

  // When the user can't request a code (for example, the justed request one) then wait before allowing it again.
  useEffect(() => {
    if (!canRequestCode) {
      timerIdRef.current = setTimeout(() => {
        setCanRequestCode(true);
        setRequestACodeMessage(null);
      }, CODE_REQUEST_THROTTLE_DELAY_S * 1000);
    }

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [canRequestCode]);

  const submitHandlerRequestACode: SubmitHandler<RequestACodeFormValues> = ({
    emailAddress,
    emailType,
  }): Promise<void> => {
    setRequestACodeMessage(null);
    setSubmitACodeMessage(null);
    if (!canRequestCode) {
      setRequestACodeMessage("throttled");
      return Promise.reject(new Error("Wait before trying again."));
    }
    let emailTypes: EmailType[];
    switch (emailType) {
      case EmailType.Contact.toString():
        if (workEmailDomainRegex.test(emailAddress)) {
          // Appears to be a valid work email address.  We'll update both at the same time.
          emailTypes = [EmailType.Contact, EmailType.Work];
          setSubmitACodeMessage("contact-matches-work");
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
        setRequestACodeMessage("request-sent");
        setCanRequestCode(false);
        setEmailAddressContacted(emailAddress);
      })
      .catch(() => {
        toast.error(intl.formatMessage(errorMessages.error));
      });
  };

  const submitHandlerSubmitACode: SubmitHandler<SubmitACodeFormValues> = ({
    verificationCode,
  }): Promise<void> => {
    setRequestACodeMessage(null);
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
        handleDialogOpenChange(false);

        //fire event to parent
        onVerificationSuccess();
      })
      .catch(() => {
        submitACodeFormMethods.setError(
          "verificationCode",
          {
            message: intl.formatMessage({
              defaultMessage:
                "The code you’ve entered is invalid. Please request a new code.",
              id: "SYEKUz",
              description: "Error message when the code is not valid.",
            }),
          },
          { shouldFocus: true },
        );
      });
  };

  // watch the form to see if the user changes the address input after requesting a code
  useEffect(() => {
    const sentAddress = emptyToNull(emailAddressContacted);
    const formAddress = emptyToNull(watchEmailAddressInput);
    if (
      notEmpty(sentAddress) &&
      notEmpty(formAddress) &&
      sentAddress != formAddress
    ) {
      // show message
      setRequestACodeMessage("address-changed");
    } else if (
      notEmpty(sentAddress) &&
      notEmpty(formAddress) &&
      sentAddress == formAddress &&
      requestACodeMessage == "address-changed"
    ) {
      // clear message if they undo the change
      setRequestACodeMessage(null);
    }
  }, [emailAddressContacted, requestACodeMessage, watchEmailAddressInput]);

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
        <Dialog.Header
          subtitle={intl.formatMessage(subtitles[dialogEmailType])}
        >
          {
            <h2 className="text-lg font-bold">
              {intl.formatMessage({
                defaultMessage: "Email verification",
                id: "7Q61+y",
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
              <p>{intl.formatMessage(descriptions[dialogEmailType])}</p>
              <div className="flex gap-2">
                <div className="grow">
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    label={intl.formatMessage(labels[dialogEmailType])}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                      pattern:
                        dialogEmailType == EmailType.Work
                          ? {
                              value: workEmailDomainRegex,
                              message: intl.formatMessage({
                                defaultMessage:
                                  "This does not appear to be a Government of Canada email. If you are entering a Government of Canada email and still getting this error, please contact our support team.",
                                id: "BLOt/e",
                                description:
                                  "Description for rule pattern on work email field",
                              }),
                            }
                          : undefined,
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
              <RequestACodeContextMessage message={requestACodeMessage} />
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
                {emailAddressContacted ? (
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
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                    />
                    <SubmitACodeContextMessage message={submitACodeMessage} />
                  </>
                ) : null}
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
                  onClick={() => handleDialogOpenChange(false)}
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
