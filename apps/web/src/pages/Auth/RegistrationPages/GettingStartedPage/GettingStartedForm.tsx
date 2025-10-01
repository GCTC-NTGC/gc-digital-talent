import { useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";

import { Button, Heading, Separator, Well } from "@gc-digital-talent/ui";
import {
  BasicForm,
  FieldLabels,
  Input,
  RadioGroup,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  Language,
  GettingStartedInitialValues_QueryFragment,
  EmailType,
} from "@gc-digital-talent/graphql";

import SendVerificationEmailSubform from "~/components/EmailVerification/SendVerificationEmailSubform";
import RequestACodeContextMessage from "~/components/EmailVerification/RequestACodeContextMessage";
import SubmitACodeContextMessage from "~/components/EmailVerification/SubmitACodeContextMessage";
import { useEmailVerification } from "~/components/EmailVerification/EmailVerificationProvider";

import labels from "./labels";
import messages from "./messages";

export const GettingStartedInitialValues_Query = graphql(/** GraphQL */ `
  fragment GettingStartedInitialValues_Query on User {
    firstName
    lastName
    preferredLang {
      value
    }
    email
  }
`);

export const GettingStartedOptions_Query = graphql(/** GraphQL */ `
  fragment GettingStartedOptions_Query on Query {
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
  initialValues: GettingStartedInitialValues_QueryFragment,
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

  const { emailAddressContacted, setSubmitACodeMessage } =
    useEmailVerification();

  const initialValues = getFragment(
    GettingStartedInitialValues_Query,
    initialValuesQuery,
  );

  const options = getFragment(GettingStartedOptions_Query, optionsQuery);

  const formattedLabels = Object.entries(labels)
    .map(([key, value]) => [key, intl.formatMessage(value)])
    .reduce<FieldLabels>(
      (acc, value) => ({ ...acc, [value[0]]: value[1] }),
      {},
    );

  const handlePersonalFormSubmit = (formValues: FormValues): Promise<void> => {
    if (!emailAddressContacted) {
      // the use hasn't tried to get a verification email yet
      setSubmitACodeMessage("must-request-code");
      return Promise.resolve(); // block form submission
    }
    return onSubmit(formValues);
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
        {intl.formatMessage(messages.gettingStartedSectionTitle)}
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
        <SendVerificationEmailSubform
          emailType={EmailType.Contact}
          emailAddress={initialValues.email ?? null}
        />
      </div>
      <div className="mb-6">
        <RequestACodeContextMessage />
      </div>

      <BasicForm
        onSubmit={handlePersonalFormSubmit}
        labels={formattedLabels}
        options={{
          defaultValues: initialValuesToFormValues(initialValues),
        }}
      >
        <>
          {emailAddressContacted ? (
            <>
              <div className="mb-6 grid gap-6 xs:grid-cols-2">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  label={formattedLabels.firstName}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  label={formattedLabels.lastName}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <div className="mb-6">
                <RadioGroup
                  idPrefix="required-lang-preferences"
                  legend={formattedLabels.preferredLang}
                  id="preferredLang"
                  name="preferredLang"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  items={localizedEnumToOptions(options?.languages, intl)}
                  defaultSelected={Language.En}
                />
              </div>
              <div className="mb-6 flex flex-col gap-6">
                <Input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  label={formattedLabels.verificationCode}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
            </>
          ) : null}
          <div className="mb-6">
            <SubmitACodeContextMessage />
          </div>
          <div className="mb-6">
            <Well>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "By registering and providing your email address, you agree to receive email communication from GC Digital Talent and its partner functional communities in the Government of Canada. You can control which types of notifications you receive and how you receive them in your account settings page.",
                  id: "sHEsjv",
                  description:
                    "Message on getting started page about the contact email address",
                })}
              </p>
            </Well>
          </div>
          <div className="-mx-6 sm:-mx-9">
            <Separator decorative orientation="horizontal" />
          </div>
          <div className="flex flex-col items-center gap-x-3 gap-y-1.5 sm:flex-row sm:justify-end">
            <div>
              <Button mode="solid" color="primary" type="submit">
                {intl.formatMessage({
                  defaultMessage: "Save and continue",
                  id: "MQB4IA",
                  description:
                    "Button text to save a form step and continue to the next one",
                })}
              </Button>
            </div>
          </div>
        </>
      </BasicForm>
    </>
  );
};

export default GettingStartedForm;
