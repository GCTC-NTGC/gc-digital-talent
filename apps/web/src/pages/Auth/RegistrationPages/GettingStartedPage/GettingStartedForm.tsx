import { defineMessage, useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { FormProvider, useForm } from "react-hook-form";

import { Heading, Separator } from "@gc-digital-talent/ui";
import {
  Input,
  RadioGroup,
  Submit,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  Language,
  GettingStartedInitialValuesFragment,
  EmailType,
} from "@gc-digital-talent/graphql";

import EmailVerification, {
  useEmailVerification,
} from "~/components/EmailVerification/EmailVerification";
import { API_CODE_VERIFICATION_FAILED } from "~/components/EmailVerification/constants";
import Caption from "~/components/BasicInformation/Caption";

import labels from "./labels";

export const sectionTitle = defineMessage({
  defaultMessage: "Getting started",
  id: "QXiUo/",
  description: "Main heading in getting started page.",
});

export const GettingStartedInitialValues_Query = graphql(/** GraphQL */ `
  fragment GettingStartedInitialValues on User {
    firstName
    lastName
    preferredLang {
      value
    }
    email
  }
`);

export const GettingStartedOptions_Query = graphql(/** GraphQL */ `
  fragment GettingStartedOptions on Query {
    languages: localizedEnumStrings(enumName: "Language") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export interface FormValues {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  preferredLang: string | null;
  verificationCode: string | null;
}

const initialValuesToFormValues = (
  initialValues: GettingStartedInitialValuesFragment,
): FormValues => {
  return {
    firstName: initialValues.firstName ?? null,
    lastName: initialValues.lastName ?? null,
    email: initialValues.email ?? null,
    preferredLang: initialValues.preferredLang?.value ?? null,
    verificationCode: null, // not stored in db
  };
};

export interface GettingStartedFormProps {
  initialValuesQuery: FragmentType<typeof GettingStartedInitialValues_Query>;
  optionsQuery: FragmentType<typeof GettingStartedOptions_Query>;
  onSubmit: (formValues: FormValues) => Promise<void>;
}

export const GettingStartedForm = ({
  initialValuesQuery,
  optionsQuery,
  onSubmit,
}: GettingStartedFormProps) => {
  const intl = useIntl();

  const {
    state: { emailAddressContacted },
    actions: { setSubmitVerificationCodeContextMessage: setSubmitCodeMessage },
  } = useEmailVerification();

  const initialValues = getFragment(
    GettingStartedInitialValues_Query,
    initialValuesQuery,
  );

  const options = getFragment(GettingStartedOptions_Query, optionsQuery);

  const formMethods = useForm<FormValues>({
    defaultValues: initialValuesToFormValues(initialValues),
  });

  const submitHandler = (formValues: FormValues): Promise<void> => {
    if (!emailAddressContacted) {
      // the user hasn't tried to get a verification email yet
      setSubmitCodeMessage("must-request-code");
      return Promise.resolve(); // block form submission
    }
    return onSubmit(formValues).catch((reason: Error) => {
      if (reason.message == API_CODE_VERIFICATION_FAILED) {
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
      }
    });
  };

  return (
    <>
      <Heading
        level="h2"
        size="h3"
        icon={FlagIcon}
        color="secondary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(sectionTitle)}
      </Heading>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Before we take you to your profile, we need to collect some required information to complete your account set up.",
          id: "x6saT3",
          description: "Message after main heading in create account page.",
        })}
      </p>
      <div className="mb-6">
        <EmailVerification.RequestVerificationCodeForm
          emailType={EmailType.Contact}
          emailAddress={initialValues.email ?? null}
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
          {/* always allow context message to be displayed */}
          <div className="mb-6">
            <EmailVerification.SubmitVerificationCodeContextMessage />
          </div>
          {/* only show personal information inputs if a code has already been requested */}
          {emailAddressContacted ? (
            <>
              <div className="mb-6 grid gap-6 xs:grid-cols-2">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  label={intl.formatMessage(labels.firstName)}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  label={intl.formatMessage(labels.lastName)}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <div className="mb-6">
                <RadioGroup
                  idPrefix="required-lang-preferences"
                  legend={intl.formatMessage(labels.preferredLang)}
                  id="preferredLang"
                  name="preferredLang"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  items={localizedEnumToOptions(options?.languages, intl)}
                  defaultSelected={Language.En}
                />
              </div>
            </>
          ) : null}
          <div className="mb-6">
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
            <Separator decorative orientation="horizontal" />
          </div>
          <div className="flex flex-col items-center gap-x-3 gap-y-1.5 sm:flex-row sm:justify-end">
            <div>
              <Submit
                mode="solid"
                color="primary"
                text={intl.formatMessage(commonMessages.saveAndContinue)}
                submittedText={intl.formatMessage(
                  commonMessages.saveAndContinue,
                )}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default GettingStartedForm;
