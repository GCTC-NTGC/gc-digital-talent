import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";
import { useWatch } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import type { FragmentType, Language } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Button,
  Loading,
  TableOfContents,
  ToggleSection,
} from "@gc-digital-talent/ui";
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
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { workEmailDomainRegex } from "@gc-digital-talent/helpers";

import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import NullDisplay from "~/components/ToggleForm/NullDisplay";

import Display from "./Display";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "./validation/accountInformation";

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

export const AccountInformationForm_Fragment = graphql(/** GraphQL */ `
  fragment AccountInformationForm on User {
    id
    firstName
    lastName
    email
    isEmailVerified
    telephone
    preferredLang {
      value
      label {
        localized
      }
    }
    isGovEmployee
    workEmail
    isWorkEmailVerified
  }
`);

const AccountInformationFormOptions_Fragment = graphql(/** GraphQL */ `
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

  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { isEditing, setIsEditing } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon: UserCircleIcon,
  });

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
        setIsEditing(false);
      })
      .catch(handleError);
  };

  return (
    <TableOfContents.Section id={ACCOUNT_INFORMATION_ID} className="mb-18">
      <ToggleSection.Root
        id="account-information"
        open={isEditing}
        onOpenChange={setIsEditing}
      >
        <ToggleSection.Header
          icon={UserCircleIcon}
          color="secondary"
          level="h2"
          size="h3"
          toggle={
            !isNull ? (
              <ToggleForm.Trigger
                aria-label={intl.formatMessage({
                  defaultMessage: "Edit account information",
                  id: "io5nXU",
                  description:
                    "Button text to start editing account information",
                })}
              >
                {intl.formatMessage(commonMessages.editThisSection)}
              </ToggleForm.Trigger>
            ) : undefined
          }
        >
          {intl.formatMessage(accountInformationTitle)}
        </ToggleSection.Header>
        <ToggleSection.Content>
          <ToggleSection.InitialContent>
            {isNull ? <NullDisplay /> : <Display query={user} />}
          </ToggleSection.InitialContent>
          <ToggleSection.OpenContent>
            {fetching ? (
              <Loading inline />
            ) : (
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
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
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
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label={intl.formatMessage(commonMessages.email)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    label={intl.formatMessage(commonMessages.telephone)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
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
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOption,
                    )}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                  <GovernmentEmployeeFields />
                </div>
                <div className="mt-6 flex flex-col flex-wrap items-center gap-6 sm:flex-row sm:gap-3">
                  <Button
                    type="submit"
                    color="primary"
                    mode="solid"
                    disabled={fetching}
                  >
                    {intl.formatMessage(formMessages.saveChanges)}
                  </Button>
                  <ToggleSection.Close>
                    <Button mode="inline" color="warning">
                      {intl.formatMessage(commonMessages.cancel)}
                    </Button>
                  </ToggleSection.Close>
                </div>
              </BasicForm>
            )}
          </ToggleSection.OpenContent>
        </ToggleSection.Content>
      </ToggleSection.Root>
    </TableOfContents.Section>
  );
};

export default AccountInformation;
