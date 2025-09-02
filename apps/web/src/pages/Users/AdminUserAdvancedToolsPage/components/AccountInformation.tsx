import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";
import { useWatch } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import {
  FragmentType,
  getFragment,
  graphql,
  Language,
} from "@gc-digital-talent/graphql";
import { Button, TableOfContents } from "@gc-digital-talent/ui";
import {
  BasicForm,
  Input,
  localizedEnumToOptions,
  Select,
  SwitchInput,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { workEmailDomainRegex } from "@gc-digital-talent/helpers";

export const ACCOUNT_INFORMATION_ID = "account-information";

export const accountInformationTitle = defineMessage({
  defaultMessage: "Account information",
  id: "Y/szKZ",
  description: "Title for a users account information",
});

interface FormValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  telephone?: string;
  preferredLang?: Language;
  isGovEmployee?: boolean;
  workEmail?: string;
}

const GovernmentEmployeeFields = () => {
  const intl = useIntl();
  const isGovEmployee = useWatch<FormValues>({ name: "isGovEmployee" });
  return (
    <>
      <SwitchInput
        name="isGovEmployee"
        id="isGovEmployee"
        label={intl.formatMessage(commonMessages.governmentEmployee)}
      />
      {isGovEmployee && (
        <Input
          id="workEmail"
          name="workEmail"
          type="email"
          label={intl.formatMessage(commonMessages.workEmail)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
            pattern: {
              value: workEmailDomainRegex,
              message: intl.formatMessage({
                defaultMessage:
                  "This does not appear to be a Government of Canada email. If you are entering a Government of Canada email and still getting this error, please contact our support team.",
                id: "BLOt/e",
                description: "Description for rule pattern on work email field",
              }),
            },
          }}
        />
      )}
    </>
  );
};

const UpdateAccountInformation_Mutation = graphql(/** GraphQL */ `
  mutation UpdateAccountInformation($id: ID!, $input: UpdateUserAsAdminInput!) {
    updateUserAsAdmin(id: $id, user: $input) {
      id
    }
  }
`);

const AccountInformationForm_Fragment = graphql(/** GraphQL */ `
  fragment AccountInformationForm on User {
    id
    firstName
    lastName
    email
    telephone
    preferredLang {
      value
    }
    isGovEmployee
    workEmail
  }
`);

export const AccountInformationFormOptions_Fragment = graphql(/** GraphQL */ `
  fragment AccountInformationFormOptions on Query {
    languages: localizedEnumStrings(enumName: "Language") {
      value
      label {
        en
        fr
      }
    }
  }
`);

interface AccountInformationProps {
  query: FragmentType<typeof AccountInformationForm_Fragment>;
  optionsQuery: FragmentType<typeof AccountInformationFormOptions_Fragment>;
}

const AccountInformation = ({
  query,
  optionsQuery,
}: AccountInformationProps) => {
  const intl = useIntl();
  const user = getFragment(AccountInformationForm_Fragment, query);
  const options = getFragment(
    AccountInformationFormOptions_Fragment,
    optionsQuery,
  );
  const [{ fetching }, executeMutation] = useMutation(
    UpdateAccountInformation_Mutation,
  );

  const languageOptions = localizedEnumToOptions(options?.languages, intl);

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update account information.",
        id: "rAK3Dh",
        description: "Error message when updating a users account information",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    if (fetching) return;

    await executeMutation({ id: user.id, input: { id: user.id, ...values } })
      .then((res) => {
        if (res.error || !res.data?.updateUserAsAdmin?.id) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Updated account information successfully!",
            id: "f9I5Tf",
            description:
              "Success message when updating a users account information",
          }),
        );
      })
      .catch(handleError);
  };

  return (
    <TableOfContents.Section id={ACCOUNT_INFORMATION_ID}>
      <TableOfContents.Heading
        icon={UserCircleIcon}
        color="secondary"
        className="mt-0 mb-6"
      >
        {intl.formatMessage(accountInformationTitle)}
      </TableOfContents.Heading>
      <BasicForm<FormValues>
        onSubmit={handleSubmit}
        options={{
          defaultValues: {
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            email: user?.email ?? "",
            telephone: user?.telephone ?? "",
            preferredLang: user?.preferredLang?.value ?? undefined,
            isGovEmployee: user?.isGovEmployee ?? false,
            workEmail: user?.workEmail ?? "",
          },
        }}
      >
        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "First name",
              id: "+btI+S",
              description: "Label for first name input",
            })}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            label={intl.formatMessage({
              defaultMessage: "Last name",
              id: "zDIBle",
              description: "Label for last name input",
            })}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <Input
            id="email"
            name="email"
            type="email"
            label={intl.formatMessage(commonMessages.email)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <Input
            id="telephone"
            name="telephone"
            type="tel"
            label={intl.formatMessage(commonMessages.telephone)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div className="mb-6 flex flex-col gap-6">
          <Select
            id="preferredLang"
            name="preferredLang"
            options={languageOptions}
            label={intl.formatMessage(
              commonMessages.preferredCommunicationLanguage,
            )}
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <GovernmentEmployeeFields />
        </div>
        <Button type="submit">
          {intl.formatMessage({
            defaultMessage: "Update information",
            id: "puB/J+",
            description:
              "Submit button text to update user account information",
          })}
        </Button>
      </BasicForm>
    </TableOfContents.Section>
  );
};

export default AccountInformation;
