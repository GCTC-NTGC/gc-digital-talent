import { defineMessage, useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { FormProvider, useForm } from "react-hook-form";
import { ReactNode } from "react";

import { Heading, Link, Notice } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  GettingStartedInitialValuesFragment,
} from "@gc-digital-talent/graphql";
import { getRuntimeVariable } from "@gc-digital-talent/env";

import { useEmailVerification } from "~/components/EmailVerification/EmailVerification";
import { API_CODE_VERIFICATION_FAILED } from "~/components/EmailVerification/constants";
import { getFullNameLabel } from "~/utils/nameUtils";

import labels from "./labels";
import BottomHalfNotEmployee from "./components/BottomHalfNotEmployee";
import BottomHalfEmployeeWithEmail from "./components/BottomHalfEmployeeWithEmail";
import BottomHalfEmployeeNoEmail from "./components/BottomHalfEmployeeNoEmail";

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
      label {
        localized
      }
    }
    email
    workEmail
    isWorkEmailVerified
    telephone
  }
`);

export interface FormValues {
  isEmployee: string | null;
  verificationCode: string | null;
}

const initialValuesToFormValues = (
  initialValues: GettingStartedInitialValuesFragment,
): FormValues => {
  return {
    isEmployee: initialValues.workEmail ? "true" : "false",
    verificationCode: null, // not stored in db
  };
};

const chooseBottomHalf = (
  isEmployee: boolean,
  workEmail: string | null | undefined,
  isWorkEmailVerified: boolean | null | undefined,
): ReactNode => {
  // not an employee
  if (!isEmployee) return <BottomHalfNotEmployee />;

  // employee with verified work email
  if (workEmail?.length && isWorkEmailVerified)
    return <BottomHalfEmployeeWithEmail />;

  // employee, but no work email
  return <BottomHalfEmployeeNoEmail initialWorkEmail={workEmail} />;
};

export interface GettingStartedFormProps {
  initialValuesQuery: FragmentType<typeof GettingStartedInitialValues_Query>;
  onSubmit: (formValues: FormValues) => Promise<void>;
}

const GettingStartedForm = ({
  initialValuesQuery,
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

  const formMethods = useForm<FormValues>({
    defaultValues: initialValuesToFormValues(initialValues),
  });

  const watchIsEmployee = formMethods.watch("isEmployee");

  const bottomHalf = chooseBottomHalf(
    watchIsEmployee == "true",
    initialValues.workEmail,
    initialValues.isWorkEmailVerified,
  );

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
        color="primary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(sectionTitle)}
      </Heading>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Before we take you to your profile, we need to collect some required information to complete your account setup. We’ve collected the following profile information from CanadaLogin. The email address connected to your CanadaLogin account will be used for all contact and notifications received from GC Digital Talent.",
          id: "BXawd7",
          description: "Message after main heading in create account page.",
        })}
      </p>
      <Notice.Root className="mb-6">
        <Notice.Title>
          {getFullNameLabel(
            initialValues.firstName,
            initialValues.lastName,
            intl,
          )}
        </Notice.Title>
        <Notice.Content>
          <p>{initialValues.email}</p>
          {initialValues.telephone ? <p>{initialValues.telephone}</p> : null}
          <p>
            {intl.formatMessage(labels.preferredLang) +
              intl.formatMessage(commonMessages.dividingColon) +
              initialValues.preferredLang?.label.localized}
          </p>
        </Notice.Content>
        <Notice.Footer>
          {intl.formatMessage(
            {
              defaultMessage:
                "Does this information look incorrect? You can update it by <a>visiting your profile on CanadaLogin</a>.",
              id: "hbbeY8",
              description: "Footer for create account page",
            },
            {
              a: (chunks: ReactNode) => {
                const uri = getRuntimeVariable("OAUTH_MANAGE_ACCOUNT_URI");
                return uri ? (
                  <Link href={uri} color="black">
                    {chunks}
                  </Link>
                ) : (
                  <span>{chunks}</span>
                );
              },
            },
          )}
        </Notice.Footer>
      </Notice.Root>

      <div className="mb-6">
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(submitHandler)}>
            <RadioGroup
              idPrefix="isEmployee"
              name="isEmployee"
              legend={intl.formatMessage({
                defaultMessage: "Government employee status",
                id: "44R2Zx",
                description:
                  "Label to select if the uer is a government employee or not",
              })}
              items={[
                {
                  value: "false",
                  label: intl.formatMessage({
                    defaultMessage: "I’m not an employee",
                    id: "t/RX4k",
                    description: "Not an employee",
                  }),
                },
                {
                  value: "true",
                  label: intl.formatMessage({
                    defaultMessage:
                      "I currently work for the Government of Canada",
                    id: "ub5Bh5",
                    description: "Is an employee",
                  }),
                },
              ]}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </form>
        </FormProvider>
      </div>
      {bottomHalf}
    </>
  );
};

export default GettingStartedForm;
