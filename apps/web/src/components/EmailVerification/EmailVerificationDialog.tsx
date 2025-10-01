import { useState, ReactNode } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { EmailType, graphql } from "@gc-digital-talent/graphql";

import { subtitles } from "./messages";
import SubmitACodeContextMessage from "./SubmitACodeContextMessage";
import SendVerificationEmailSubform from "./SendVerificationEmailSubform";
import { useEmailVerification } from "./EmailVerificationProvider";

const EmailVerificationSubmitACode_Mutation = graphql(/* GraphQL */ `
  mutation EmailVerificationSubmitACode($code: String!) {
    verifyUserEmails(code: $code) {
      id
    }
  }
`);

interface SubmitACodeFormValues {
  verificationCode: string;
}

export interface EmailVerificationProps {
  emailType: EmailType;
  emailAddress: string | null;
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

  const [isOpen, setOpen] = useState<boolean>(defaultOpen);

  const {
    emailAddressContacted,
    setRequestACodeMessage,
    setSubmitACodeMessage,
    setEmailAddressContacted,
  } = useEmailVerification();

  const [, executeSubmitACodeMutation] = useMutation(
    EmailVerificationSubmitACode_Mutation,
  );

  const submitACodeFormMethods = useForm<SubmitACodeFormValues>({
    defaultValues: {
      verificationCode: "",
    },
  });

  // Reset all the states back, for example, when closing the dialog.
  const resetDialog = () => {
    setEmailAddressContacted(null);
    setRequestACodeMessage(null);
    setSubmitACodeMessage(null);
    // setCanRequestCode(true);
    submitACodeFormMethods.reset();
  };

  // Close or open the dialog
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    setOpen(open);
  };

  /*  Populate the initial email address in the form.
   *  This can change if the email address is updated and the dialog is reopened.
   *  Therefore, it is a useEffect instead of using ReactHookForms default values.
   */
  // useEffect(() => {
  //   if (initialEmailAddress) {
  //     requestACodeFormMethods.setValue("emailAddress", initialEmailAddress);
  //   }
  // }, [initialEmailAddress, requestACodeFormMethods]);

  const submitHandlerSubmitACode: SubmitHandler<SubmitACodeFormValues> = ({
    verificationCode,
  }): Promise<void> => {
    setRequestACodeMessage(null);
    if (!emailAddressContacted) {
      setSubmitACodeMessage("must-request-code");
      return Promise.resolve();
    }
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
          {intl.formatMessage({
            defaultMessage: "Email verification",
            id: "7Q61+y",
            description: "Title for email verification dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <SendVerificationEmailSubform
            emailType={dialogEmailType}
            emailAddress={initialEmailAddress}
          />
          {/* "Submit a code" part of dialog */}
          <FormProvider {...submitACodeFormMethods}>
            <form
              onSubmit={submitACodeFormMethods.handleSubmit(
                submitHandlerSubmitACode,
              )}
            >
              <div className="mb-6 flex flex-col gap-6">
                {emailAddressContacted ? (
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
                ) : null}
                <SubmitACodeContextMessage />
              </div>
              <Dialog.Footer>
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Save and add email",
                    id: "exfH1c",
                    description: "Button to save and add email",
                  })}
                  submittedText={intl.formatMessage({
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
