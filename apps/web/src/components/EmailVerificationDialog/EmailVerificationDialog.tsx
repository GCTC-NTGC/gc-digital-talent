import { useState, ReactNode } from "react";
import { defineMessage, MessageDescriptor, useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { EmailType, graphql } from "@gc-digital-talent/graphql";

import { API_CODE_VERIFICATION_FAILED } from "../EmailVerification/constants";
import EmailVerification, {
  useEmailVerification,
} from "../EmailVerification/EmailVerification";

const EmailVerificationSubmitACode_Mutation = graphql(/* GraphQL */ `
  mutation EmailVerificationSubmitACode($code: String!) {
    verifyUserEmails(code: $code) {
      id
    }
  }
`);

export const subtitles: Record<EmailType, MessageDescriptor> = {
  WORK: defineMessage({
    defaultMessage:
      "Verify your Government of Canada work email to confirm your status as an employee.",
    id: "UoTwQ8",
    description: "Work email subtitle",
  }),
  CONTACT: defineMessage({
    defaultMessage:
      "Add and verify a contact email that will be used for communication and notifications.",
    id: "upuqPk",
    description: "Contact email subtitle",
  }),
};

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
    state: { emailAddressContacted },
    actions: {
      setRequestVerificationCodeContextMessage: setRequestCodeMessage,
      setSubmitVerificationCodeContextMessage: setSubmitCodeMessage,
    },
  } = useEmailVerification();

  const formMethods = useForm<FormValues>();

  const submitHandler = (formValues: FormValues): Promise<void> => {
    setRequestCodeMessage(null);

    // can't submit this form until a code has been requested
    if (!emailAddressContacted) {
      setSubmitCodeMessage("must-request-code");
      return Promise.resolve();
    }
    // bubble to parent to execute mutation
    const submissionResult = onFormSubmit(formValues);

    return submissionResult.catch((reason: Error) => {
      if (reason.message == API_CODE_VERIFICATION_FAILED) {
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
      }
    });
  };

  return (
    <>
      {/* "Request a code" part of dialog */}
      <div className="mb-6">
        <EmailVerification.RequestVerificationCodeForm
          emailType={formEmailType}
          emailAddress={initialEmailAddress}
        />
      </div>
      <div className="mb-6">
        <EmailVerification.RequestVerificationCodeContextMessage />
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
          <EmailVerification.SubmitVerificationCodeContextMessage />
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
  onVerificationSuccess?: () => void;
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
      if (
        result.error?.graphQLErrors.some(
          (graphQLError) =>
            graphQLError.message == API_CODE_VERIFICATION_FAILED,
        )
      ) {
        throw new Error(API_CODE_VERIFICATION_FAILED);
      }
      if (!result.data?.verifyUserEmails?.id) {
        throw new Error("Verify code error");
      }
      // close the dialog
      setOpen(false);

      //fire event to parent
      onVerificationSuccess?.();
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
            <EmailVerification.Provider>
              <EmailVerificationForm
                formEmailType={dialogEmailType}
                initialEmailAddress={initialEmailAddress}
                onFormSubmit={handleFormSubmit}
                onClickCancel={() => setOpen(false)}
              />
            </EmailVerification.Provider>
          ) : null}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EmailVerificationDialog;
