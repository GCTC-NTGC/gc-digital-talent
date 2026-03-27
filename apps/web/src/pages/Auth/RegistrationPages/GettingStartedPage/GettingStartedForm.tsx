import { defineMessage, useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { FormProvider, useForm } from "react-hook-form";
import { ReactNode } from "react";

import { Heading, Link, Notice } from "@gc-digital-talent/ui";
import { RadioGroup } from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { graphql, FragmentType, getFragment } from "@gc-digital-talent/graphql";
import { getRuntimeVariable } from "@gc-digital-talent/env";

import { getFullNameLabel } from "~/utils/nameUtils";
import EmailVerification from "~/components/EmailVerification/EmailVerification";

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
  isEmployee: "true" | "false" | null;
}

interface BottomHalfProps {
  isEmployee: boolean;
  workEmail: string | null | undefined;
  isWorkEmailVerified: boolean | null | undefined;
}

// dynamically swap out the bottom half of the form depending on state
const BottomHalf = ({
  isEmployee,
  workEmail,
  isWorkEmailVerified,
}: BottomHalfProps) => {
  // not an employee
  if (!isEmployee) return <BottomHalfNotEmployee />;

  // employee with verified work email
  if (workEmail?.length && isWorkEmailVerified)
    return <BottomHalfEmployeeWithEmail />;

  // employee, but no work email
  return (
    <EmailVerification.Provider>
      <BottomHalfEmployeeNoEmail initialWorkEmail={workEmail} />
    </EmailVerification.Provider>
  );
};

export interface GettingStartedFormProps {
  initialValuesQuery: FragmentType<typeof GettingStartedInitialValues_Query>;
}

const GettingStartedForm = ({
  initialValuesQuery,
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
                  <Link href={uri} color="black" size="sm">
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
          <form>
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
      />
    </>
  );
};

export default GettingStartedForm;
