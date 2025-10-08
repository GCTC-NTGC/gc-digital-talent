import { useEffect, useRef, useState } from "react";
import { defineMessage, MessageDescriptor, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Input, Submit } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { EmailType, graphql } from "@gc-digital-talent/graphql";
import {
  emptyToNull,
  notEmpty,
  workEmailDomainRegex,
} from "@gc-digital-talent/helpers";

import { useEmailVerification } from "./EmailVerification";

export const CODE_REQUEST_THROTTLE_DELAY_S = 60;

export const descriptions: Record<EmailType, MessageDescriptor> = {
  WORK: defineMessage({
    defaultMessage:
      "To verify your work email, the domain must match a known Government of Canada email pattern (e.g. @canada.ca, @department.gc.ca, etc.).",
    id: "cw6MTQ",
    description: "Work email title paragraph",
  }),
  CONTACT: defineMessage({
    defaultMessage:
      "This email will be used by recruitment and HR teams to contact you about opportunities, as well as to send notifications about your applications and other platform details.",
    id: "fa+z9W",
    description: "Contact email title paragraph",
  }),
};

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

  const [canRequestCode, setCanRequestCode] = useState<boolean>(true); // can the user request a code (or do they have to wait)

  const formMethods = useForm<FormValues>({
    defaultValues: {
      emailType: dialogEmailType,
      emailAddress: initialEmailAddress ?? undefined,
    },
  });

  const watchEmailAddressInput = formMethods.watch("emailAddress");

  const timerIdRef = useRef<ReturnType<typeof setTimeout>>(null); // timer for throttling requests

  const isThereAnEmailInUseError = (
    result: Awaited<ReturnType<typeof executeMutation>>,
  ): boolean =>
    result.error?.graphQLErrors.some((graphQLError) => {
      const validationErrors = graphQLError.extensions.validation;

      if (
        !!validationErrors &&
        typeof validationErrors === "object" &&
        "sendUserEmailsVerificationInput.emailAddress" in validationErrors &&
        Array.isArray(
          validationErrors["sendUserEmailsVerificationInput.emailAddress"],
        )
      ) {
        return validationErrors[
          "sendUserEmailsVerificationInput.emailAddress"
        ].some((validationError) => validationError === "EmailAddressInUse");
      }
      return false;
    }) ?? false;

  const submitHandler: SubmitHandler<FormValues> = ({
    emailAddress,
    emailType,
  }): Promise<void> => {
    setRequestCodeMessage(null);
    setSubmitCodeMessage(null);
    if (!canRequestCode) {
      setRequestCodeMessage("throttled");
      return Promise.resolve();
    }
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
      if (isThereAnEmailInUseError(result)) {
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
      if (!result.data?.sendUserEmailsVerification?.id) {
        throw new Error("Send email error");
      }
    });

    return mutationResult.then(() => {
      setRequestCodeMessage("request-sent");
      setCanRequestCode(false);
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
      setRequestCodeMessage("address-changed");
      setCanRequestCode(true);
    } else if (
      notEmpty(sentAddress) &&
      notEmpty(formAddress) &&
      sentAddress == formAddress &&
      requestCodeMessage == "address-changed"
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

  useEffect(() => {
    // When the user can't request a code (for example, they justed request one) then wait before allowing it again.
    if (!canRequestCode) {
      timerIdRef.current = setTimeout(() => {
        setCanRequestCode(true);
        setRequestCodeMessage(null);
      }, CODE_REQUEST_THROTTLE_DELAY_S * 1000);
    }

    // When the user can request a code (for example, the timer expired) then remove the timer
    if (canRequestCode) {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    }

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [canRequestCode, setRequestCodeMessage]);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(submitHandler)}
        className="mb-6 flex flex-col gap-6"
      >
        <p>{intl.formatMessage(descriptions[dialogEmailType])}</p>
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
