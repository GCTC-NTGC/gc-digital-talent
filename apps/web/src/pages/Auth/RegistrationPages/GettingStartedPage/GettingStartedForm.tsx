import { defineMessage, useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { FormProvider, useForm } from "react-hook-form";

import { Heading } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { graphql, getFragment } from "@gc-digital-talent/graphql";
import { useFeatureFlags } from "@gc-digital-talent/env";

import EmailVerification from "~/components/EmailVerification/EmailVerification";
import PersonalInfoBox from "~/components/PersonalInfoBox/PersonalInfoBox";

import BottomHalfNotEmployee from "./components/BottomHalfNotEmployee";
import BottomHalfEmployeeWithEmail from "./components/BottomHalfEmployeeWithEmail";
import BottomHalfEmployeeNoEmail from "./components/BottomHalfEmployeeNoEmail";

export const GETTING_STARTED_FORM_ID = "getting-started-form";

export const sectionTitle = defineMessage({
  defaultMessage: "Getting started",
  id: "QXiUo/",
  description: "Main heading in getting started page.",
});

export const GettingStartedInitialValues_Query = graphql(/** GraphQL */ `
  fragment GettingStartedInitialValues on User {
    workEmail
    isWorkEmailVerified
    ...PersonalInfoBox
  }
`);

export interface FormValues {
  isEmployee: "true" | "false" | null;
}

interface BottomHalfProps {
  isEmployee: boolean;
  workEmail: string | null | undefined;
  isWorkEmailVerified: boolean | null | undefined;
  showButtonAlreadyHaveProfile: boolean;
}

// dynamically swap out the bottom half of the form depending on state
const BottomHalf = ({
  isEmployee,
  workEmail,
  isWorkEmailVerified,
  showButtonAlreadyHaveProfile,
}: BottomHalfProps) => {
  // not an employee
  if (!isEmployee)
    return (
      <BottomHalfNotEmployee
        showButtonAlreadyHaveProfile={showButtonAlreadyHaveProfile}
      />
    );

  // employee with verified work email
  if (workEmail?.length && isWorkEmailVerified)
    return (
      <BottomHalfEmployeeWithEmail
        showButtonAlreadyHaveProfile={showButtonAlreadyHaveProfile}
      />
    );

  // employee, but no work email
  return (
    <EmailVerification.Provider>
      <BottomHalfEmployeeNoEmail
        initialWorkEmail={workEmail}
        showButtonAlreadyHaveProfile={showButtonAlreadyHaveProfile}
      />
    </EmailVerification.Provider>
  );
};

export interface GettingStartedFormProps {
  initialValuesQuery: FragmentType<typeof GettingStartedInitialValues_Query>;
  canMigrateMyAccount?: boolean;
}

const GettingStartedForm = ({
  initialValuesQuery,
  canMigrateMyAccount,
}: GettingStartedFormProps) => {
  const intl = useIntl();

  const initialValues = getFragment(
    GettingStartedInitialValues_Query,
    initialValuesQuery,
  );

  const formMethods = useForm<FormValues>({
    defaultValues: {
      isEmployee: initialValues.workEmail ? "true" : "false",
    },
  });

  const watchIsEmployee = formMethods.watch("isEmployee");

  const featureFlags = useFeatureFlags();
  const showButtonAlreadyHaveProfile =
    featureFlags.authInAppMigration && !canMigrateMyAccount;

  return (
    <>
      <Heading
        id={GETTING_STARTED_FORM_ID}
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
      <div className="mb-6">
        <PersonalInfoBox query={initialValues} footer />
      </div>
      <div className="mb-6">
        <FormProvider {...formMethods}>
          <form>
            <RadioGroup
              idPrefix="isEmployee"
              name="isEmployee"
              legend={intl.formatMessage({
                defaultMessage: "Government employee status",
                id: "YMAXhb",
                description: "Employee status label",
              })}
              items={[
                {
                  value: "false",
                  label: intl.formatMessage({
                    defaultMessage: "I’m not an employee",
                    id: "4+/L3a",
                    description: "Is not an employee",
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
      {/* bottom half of page changes depending on user state */}
      <BottomHalf
        isEmployee={watchIsEmployee == "true"}
        workEmail={initialValues.workEmail}
        isWorkEmailVerified={initialValues.isWorkEmailVerified}
        showButtonAlreadyHaveProfile={showButtonAlreadyHaveProfile}
      />
    </>
  );
};

export default GettingStartedForm;
