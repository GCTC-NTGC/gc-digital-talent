import { useState, ReactNode } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { EmailType, graphql } from "@gc-digital-talent/graphql";

import { subtitles } from "./messages";
import SubmitACodeContextMessage from "./SubmitACodeContextMessage";
import SendVerificationEmailSubform from "./SendVerificationEmailSubform";
import EmailVerificationProvider, {
  useEmailVerification,
} from "./EmailVerificationProvider";
import RequestACodeContextMessage from "./RequestACodeContextMessage";

const EmailVerificationSubmitACode_Mutation = graphql(/* GraphQL */ `
  mutation EmailVerificationSubmitACode($code: String!) {
    verifyUserEmails(code: $code) {
      id
    }
  }
`);

interface FormValues {
  verificationCode: string;
}

interface EmailVerificationFormProps {
  formEmailType: EmailType;
  initialEmailAddress: string | null;
  onFormSubmit: (formValues: FormValues) => Promise<void>;
  onClickCancel: () => void;
}

const EmailVerificationForm = ({
  formEmailType,
  initialEmailAddress,
  onFormSubmit,
  onClickCancel,
}: EmailVerificationFormProps) => {
  const intl = useIntl();
  const {
    emailAddressContacted,
    setRequestACodeMessage,
    setSubmitACodeMessage,
  } = useEmailVerification();

  const formMethods = useForm<FormValues>();

  const submitHandler = (formValues: FormValues): Promise<void> => {
    setRequestACodeMessage(null);

    // can't submit this form until a code has been requested
    if (!emailAddressContacted) {
      setSubmitACodeMessage("must-request-code");
      return Promise.resolve();
    }
    // bubble to parent to execute mutation
    const submissionResult = onFormSubmit(formValues);

    return submissionResult.catch(() => {
      formMethods.setError(
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
    <>
      {/* "Request a code" part of dialog */}
      <div className="mb-6">
        <SendVerificationEmailSubform
          emailType={formEmailType}
          emailAddress={initialEmailAddress}
        />
      </div>
      <div className="mb-6">
        <RequestACodeContextMessage />
      </div>
      {/* "Submit a code" part of dialog */}
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(submitHandler)}>
          <div className="mb-6">
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
          </div>
          <SubmitACodeContextMessage />
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
            <Button color="warning" mode="inline" onClick={onClickCancel}>
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </Dialog.Footer>
        </form>
      </FormProvider>
    </>
  );
};

export interface EmailVerificationDialogProps {
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
}: EmailVerificationDialogProps) => {
  const intl = useIntl();

  const [isOpen, setOpen] = useState<boolean>(defaultOpen);

  const [, executeMutation] = useMutation(
    EmailVerificationSubmitACode_Mutation,
  );

  const handleFormSubmit = (formValues: FormValues): Promise<void> => {
    return executeMutation({
      code: formValues.verificationCode,
    }).then((result) => {
      if (!result.data?.verifyUserEmails?.id) {
        throw new Error("Verify code error");
      }
      // close the dialog
      setOpen(false);

      //fire event to parent
      onVerificationSuccess();
    });
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
          {isOpen ? (
            // reset everything on close as it is removed from the DOM
            <EmailVerificationProvider>
              <EmailVerificationForm
                formEmailType={dialogEmailType}
                initialEmailAddress={initialEmailAddress}
                onFormSubmit={handleFormSubmit}
                onClickCancel={() => setOpen(false)}
              />
            </EmailVerificationProvider>
          ) : null}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EmailVerificationDialog;
