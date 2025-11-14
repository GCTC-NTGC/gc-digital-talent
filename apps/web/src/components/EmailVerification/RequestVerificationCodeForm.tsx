import { useEffect } from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Input, Submit } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { EmailType, ErrorCode, graphql } from "@gc-digital-talent/graphql";
import {
  emptyToNull,
  notEmpty,
  workEmailDomainRegex,
} from "@gc-digital-talent/helpers";

import {
  getTooManyRequestsExtension,
  getValidationExtension,
} from "~/utils/graphqlExtensions";

import { useEmailVerification } from "./EmailVerification";

export const labels: Record<EmailType, MessageDescriptor> = {
  WORK: commonMessages.workEmail,
  CONTACT: commonMessages.email,
};

const SendUserEmailsVerification_Mutation = graphql(/* GraphQL */ `
  mutation SendUserEmailsVerification(
    $input: SendUserEmailsVerificationInput!
  ) {
    sendUserEmailsVerification(sendUserEmailsVerificationInput: $input) {
      id
    }
  }
`);

interface FormValues {
  emailAddress: string;
  emailType: string;
}

interface RequestVerificationCodeFormProps {
  emailType: EmailType;
  emailAddress: string | null;
}

const RequestVerificationCodeForm = ({
  emailType: dialogEmailType,
  emailAddress: initialEmailAddress,
}: RequestVerificationCodeFormProps) => {
  const intl = useIntl();

  const {
    state: {
      requestVerificationCodeContextMessage: requestCodeMessage,
      emailAddressContacted,
    },
    actions: {
      setRequestVerificationCodeContextMessage: setRequestCodeMessage,
      setSubmitVerificationCodeContextMessage: setSubmitCodeMessage,
      setEmailAddressContacted,
    },
  } = useEmailVerification();

  const [, executeMutation] = useMutation(SendUserEmailsVerification_Mutation);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      emailType: dialogEmailType,
      emailAddress: initialEmailAddress ?? undefined,
    },
  });

  const watchEmailAddressInput = formMethods.watch("emailAddress");

  const submitHandler: SubmitHandler<FormValues> = ({
    emailAddress,
    emailType,
  }): Promise<void> => {
    setRequestCodeMessage(null);
    setSubmitCodeMessage(null);

    let emailTypes: EmailType[];
    switch (emailType) {
      case EmailType.Contact.toString():
        if (workEmailDomainRegex.test(emailAddress)) {
          // Appears to be a valid work email address.  We'll update both at the same time.
          emailTypes = [EmailType.Contact, EmailType.Work];
          setSubmitCodeMessage("contact-matches-work");
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
    const mutationResult = executeMutation({
      input: {
        emailAddress,
        emailTypes,
      },
    }).then((result) => {
      // check for the email being already in use
      const validationErrors =
        result.error?.graphQLErrors
          .map((e) => getValidationExtension(e.extensions))
          .filter(notEmpty) ?? [];

      if (
        validationErrors.some((extension) =>
          extension["sendUserEmailsVerificationInput.emailAddress"].includes(
            ErrorCode.EmailAddressInUse,
          ),
        )
      ) {
        formMethods.setError(
          "emailAddress",
          {
            message: intl.formatMessage({
              defaultMessage: "This email address is already in use.",
              id: "wBKhHG",
              description:
                "Error message when the email address is already in use.",
            }),
          },
          { shouldFocus: true },
        );
      }

      // check if we're being throttled
      const tooManyRequestsErrors =
        result.error?.graphQLErrors
          .map((e) => getTooManyRequestsExtension(e.extensions))
          .filter(notEmpty) ?? [];

      if (tooManyRequestsErrors.length) {
        setRequestCodeMessage({
          code: "throttled",
          remainingSeconds: tooManyRequestsErrors[0].remaining_seconds,
        });
      }

      setEmailAddressContacted(null);
      if (!result.data?.sendUserEmailsVerification?.id) {
        throw new Error("Send email error");
      }
    });

    return mutationResult.then(() => {
      setRequestCodeMessage({ code: "request-sent" });
      setEmailAddressContacted(emailAddress);
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
      setRequestCodeMessage({ code: "address-changed" });
    } else if (
      notEmpty(sentAddress) &&
      notEmpty(formAddress) &&
      sentAddress == formAddress &&
      requestCodeMessage?.code == "address-changed"
    ) {
      // clear message if they undo the change
      setRequestCodeMessage(null);
    }
  }, [
    emailAddressContacted,
    requestCodeMessage,
    setRequestCodeMessage,
    watchEmailAddressInput,
  ]);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(submitHandler)}
        className="mb-6 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 xs:flex-row">
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
          <div className="w-full self-center xs:w-auto xs:self-end">
            <Submit
              className="block w-full"
              text={intl.formatMessage({
                defaultMessage: "Send verification email",
                id: "xKj/Lr",
                description: "Button to send verification code",
              })}
              submittedText={intl.formatMessage({
                defaultMessage: "Send verification email",
                id: "xKj/Lr",
                description: "Button to send verification code",
              })}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default RequestVerificationCodeForm;
