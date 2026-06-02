import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Caption, Link, Separator } from "@gc-digital-talent/ui";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { EmailType, graphql } from "@gc-digital-talent/graphql";
import { Input, Submit } from "@gc-digital-talent/forms";

import useRoutes from "~/hooks/useRoutes";
import EmailVerification, {
  useEmailVerification,
} from "~/components/EmailVerification/EmailVerification";
import { API_CODE_VERIFICATION_FAILED } from "~/components/EmailVerification/constants";

import labels from "../labels";

const GettingStartedVerifyEmail_Mutation = graphql(/* GraphQL */ `
  mutation GettingStartedVerifyEmail($code: String!) {
    verifyUserEmails(code: $code) {
      id
    }
  }
`);

export interface FormValues {
  email: string | null;
  verificationCode: string | null;
}

const BottomHalfEmployeeNoEmail = ({
  initialWorkEmail,
}: {
  initialWorkEmail: string | null | undefined;
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const navigate = useNavigate();

  const {
    state: { emailAddressContacted },
    actions: { setSubmitVerificationCodeContextMessage: setSubmitCodeMessage },
  } = useEmailVerification();

  const [, executeVerifyEmailMutation] = useMutation(
    GettingStartedVerifyEmail_Mutation,
  );

  const formMethods = useForm<FormValues>({
    defaultValues: {
      email: initialWorkEmail,
    },
  });

  const submitHandler = async ({
    verificationCode,
  }: FormValues): Promise<void> => {
    if (!emailAddressContacted) {
      // the user hasn't tried to get a verification email yet
      setSubmitCodeMessage("must-request-code");
      return Promise.resolve(); // block form submission
    }
    if (!verificationCode) {
      throw new Error("No verification provided");
    }
    return executeVerifyEmailMutation({
      code: verificationCode,
    })
      .then((verifyEmailResult) => {
        // check if the email verification was successful
        if (
          verifyEmailResult.error?.graphQLErrors.some(
            (graphQLError) =>
              graphQLError.message == API_CODE_VERIFICATION_FAILED,
          )
        ) {
          formMethods.setError(
            "verificationCode",
            {
              message: intl.formatMessage({
                defaultMessage:
                  "The code you entered is not valid. Please check that the code entered matches the one you received in the email specified. If you’re still experiencing issues, try requesting a new code.",
                id: "s/+kmV",
                description: "Error message when the code is not valid.",
              }),
            },
            { shouldFocus: true },
          );
          throw new Error(API_CODE_VERIFICATION_FAILED);
        }
        if (!verifyEmailResult.data?.verifyUserEmails?.id) {
          throw new Error("Failed to verify email");
        }
      })
      .then(() => {
        // if successful, navigate away
        return navigate(
          paths.registrationExperience({
            from: from ?? undefined,
            isEmployee: true,
          }),
        );
      });
  };

  return (
    <>
      <div className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Get a head start on gaining access to employee tools by verifying your work email. If you’re prefer, you can skip this step and verify your work email at a later time in your GC employee profile, accessed through your applicant dashboard.",
          id: "c8DrIs",
          description:
            "Description about verifying work email on the getting started page",
        })}
      </div>
      <div className="mb-6">
        <EmailVerification.RequestVerificationCodeForm
          emailType={EmailType.Work}
          emailAddress={initialWorkEmail ?? null}
        />
      </div>
      <div className="mb-6">
        <EmailVerification.RequestVerificationCodeContextMessage />
      </div>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(submitHandler)}>
          {/* only show code input if a code has already been requested */}
          {emailAddressContacted ? (
            <div className="mb-6">
              <Input
                id="verificationCode"
                name="verificationCode"
                type="text"
                label={intl.formatMessage(labels.verificationCode)}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
          ) : null}
          <div className="mb-6">
            <EmailVerification.SubmitVerificationCodeContextMessage />
          </div>
          <div className="mb-9">
            <Caption>
              {intl.formatMessage({
                defaultMessage:
                  "By registering and providing your email address, you agree to receive email communication from GC Digital Talent and its partner functional communities in the Government of Canada. You can control which types of notifications you receive and how you receive them in your account settings page.",
                id: "sHEsjv",
                description:
                  "Message on getting started page about the contact email address",
              })}
            </Caption>
          </div>
          <div className="-mx-6 sm:-mx-9">
            <Separator decorative orientation="horizontal" space="none" />
          </div>
          <div className="mt-6 flex flex-col items-center gap-x-6 gap-y-1.5 sm:flex-row sm:justify-end">
            <Link
              mode="inline"
              href={paths.registrationExperience({
                from: from ?? undefined,
                isEmployee: true,
              })}
            >
              {intl.formatMessage({
                defaultMessage: "Verify later",
                id: "JDjqIL",
                description: "Button to skip the verification step",
              })}
            </Link>
            <Submit text={intl.formatMessage(commonMessages.saveAndContinue)} />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default BottomHalfEmployeeNoEmail;
