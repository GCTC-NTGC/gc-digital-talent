import { useEffect } from "react";
import { useIntl } from "react-intl";
import type { SubmitHandler } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { ErrorCode, graphql } from "@gc-digital-talent/graphql";
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

const sendUserWorkEmailVerification_Mutation = graphql(/* GraphQL */ `
  mutation SendUserWorkEmailVerification($emailAddress: String!) {
    sendUserWorkEmailVerification(emailAddress: $emailAddress) {
      id
    }
  }
`);

interface FormValues {
  emailAddress: string;
}

interface RequestVerificationCodeFormProps {
  emailAddress: string | null;
}

const RequestVerificationCodeForm = ({
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

  const [, executeMutation] = useMutation(
    sendUserWorkEmailVerification_Mutation,
  );

  const formMethods = useForm<FormValues>({
    defaultValues: {
      emailAddress: initialEmailAddress ?? undefined,
    },
  });

  const watchEmailAddressInput = formMethods.watch("emailAddress");

  const submitHandler: SubmitHandler<FormValues> = ({
    emailAddress,
  }): Promise<void> => {
    setRequestCodeMessage(null);
    setSubmitCodeMessage(null);
    setEmailAddressContacted(emailAddress);

    const mutationResult = executeMutation({
      emailAddress,
    }).then((result) => {
      // check for the email being already in use
      const emailAddressInUse = result.error?.graphQLErrors.some((e) =>
        getValidationExtension(e.extensions)?.emailAddress?.includes(
          ErrorCode.EmailAddressInUse,
        ),
      );

      if (emailAddressInUse) {
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

      if (!result.data?.sendUserWorkEmailVerification?.id) {
        throw new Error("Send email error");
      }
    });

    return mutationResult.then(() => {
      setRequestCodeMessage({ code: "request-sent" });
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
    requestCodeMessage?.code,
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
              label={intl.formatMessage({
                defaultMessage: "Government work email",
                id: "2SU37a",
                description: "Label for work email in the verification form",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                pattern: {
                  value: workEmailDomainRegex,
                  message: intl.formatMessage({
                    defaultMessage:
                      "This does not appear to be a Government of Canada email. If you are entering a Government of Canada email and still getting this error, please contact our support team.",
                    id: "BLOt/e",
                    description:
                      "Description for rule pattern on work email field",
                  }),
                },
              }}
            />
          </div>
          <div className="w-full self-center xs:w-auto xs:self-end">
            <Submit
              color="secondary"
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
