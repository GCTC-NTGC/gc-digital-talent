import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import { toast } from "react-toastify";
import { Select, Submit, Input, MultiSelect } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { enumToOptions, unpackIds } from "@common/helpers/formUtils";
import { errorMessages, commonMessages } from "@common/messages";
import { getLanguage, getRole } from "@common/constants/localizedConstants";
import { phoneNumberRegex } from "@common/constants/regularExpressions";
import { useAdminRoutes } from "../../adminRoutes";
import {
  Language,
  Role,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
  useUpdateUserAsAdminMutation,
  useUserQuery,
} from "../../api/generated";

import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = Pick<
  UpdateUserAsAdminInput,
  | "bilingualEvaluation"
  | "comprehensionLevel"
  | "currentCity"
  | "currentProvince"
  | "estimatedLanguageAbility"
  | "expectedSalary"
  | "firstName"
  | "hasDiploma"
  | "hasDisability"
  | "isGovEmployee"
  | "interestedInLaterOrSecondment"
  | "isIndigenous"
  | "isVisibleMinority"
  | "isWoman"
  | "jobLookingStatus"
  | "languageAbility"
  | "lastName"
  | "locationExemptions"
  | "locationPreferences"
  | "lookingForBilingual"
  | "lookingForEnglish"
  | "lookingForFrench"
  | "roles"
  | "preferredLang"
  | "telephone"
  | "verbalLevel"
  | "wouldAcceptTemporary"
  | "writtenLevel"
  | "sub"
> & {
  acceptedOperationalRequirements: string[] | undefined;
  cmoAssets: string[] | undefined;
  currentClassification: string;
  expectedClassifications: string[] | undefined;
  pools: string[] | undefined;
  poolCandidates: string[] | undefined;
};
interface UpdateUserFormProps {
  initialUser: User;
  handleUpdateUser: (
    id: string,
    data: UpdateUserAsAdminInput,
  ) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;
}

export const UpdateUserForm: React.FunctionComponent<UpdateUserFormProps> = ({
  initialUser,
  handleUpdateUser,
}) => {
  const intl = useIntl();
  const paths = useAdminRoutes();

  const dataToFormValues = (data: User): FormValues => ({
    ...data,

    acceptedOperationalRequirements: unpackIds(
      data.acceptedOperationalRequirements,
    ),
    cmoAssets: unpackIds(data.cmoAssets),
    currentClassification: data.currentClassification
      ? data.currentClassification.id
      : "",
    expectedClassifications: unpackIds(data.expectedClassifications),
    pools: unpackIds(data.pools),
    poolCandidates: unpackIds(data.poolCandidates),
  });

  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsAdminInput => ({
    ...values,
    acceptedOperationalRequirements: {
      sync: values.acceptedOperationalRequirements,
    },
    cmoAssets: {
      sync: values.cmoAssets,
    },
    currentClassification: {
      connect: values.currentClassification,
    },
    expectedClassifications: {
      sync: values.expectedClassifications,
    },
    pools: {
      create: undefined,
    },
    poolCandidates: {
      create: undefined,
    },
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialUser),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateUser(initialUser.id, formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.userTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "User updated successfully!",
            description:
              "Message displayed to user after user is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating user failed",
            description:
              "Message displayed to user after user fails to get updated.",
          }),
        );
      });
  };

  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Update User",
          description: "Title displayed on the update a user form.",
        })}
      </h2>
      <div data-h2-container="b(center, s)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              label={intl.formatMessage({
                defaultMessage: "Email",
                description: "Label displayed on the user form email field.",
              })}
              type="email"
              name="email"
              value={initialUser.email}
              disabled
              hideOptional
            />
            <Input
              id="firstName"
              label={intl.formatMessage({
                defaultMessage: "First Name",
                description:
                  "Label displayed on the user form first name field.",
              })}
              type="text"
              name="firstName"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="lastName"
              label={intl.formatMessage({
                defaultMessage: "Last Name",
                description:
                  "Label displayed on the user form last name field.",
              })}
              type="text"
              name="lastName"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="telephone"
              label={intl.formatMessage({
                defaultMessage: "Telephone",
                description:
                  "Label displayed on the user form telephone field.",
              })}
              type="tel"
              name="telephone"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                pattern: {
                  value: phoneNumberRegex,
                  message: intl.formatMessage(errorMessages.telephone),
                },
              }}
            />
            <Select
              id="preferredLang"
              label={intl.formatMessage({
                defaultMessage: "Preferred Language",
                description:
                  "Label displayed on the user form preferred language field.",
              })}
              name="preferredLang"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a language...",
                description:
                  "Placeholder displayed on the user form preferred language field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={enumToOptions(Language).map(({ value }) => ({
                value,
                label: intl.formatMessage(getLanguage(value)),
              }))}
            />
            <Input
              id="sub"
              label={intl.formatMessage({
                defaultMessage: "Subject",
                description: "Label displayed on the user form subject field.",
              })}
              type="text"
              name="sub"
              context={intl.formatMessage({
                defaultMessage:
                  "The 'subject' is a string that uniquely identifies a user's login identity.",
                description:
                  "Additional context describing the purpose of the users's 'subject' field.",
              })}
            />
            <MultiSelect
              id="roles"
              name="roles"
              label={intl.formatMessage({
                defaultMessage: "Roles",
                description: "Label displayed on the user form roles field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select zero or more roles...",
                description:
                  "Placeholder displayed on the user form roles field.",
              })}
              options={enumToOptions(Role).map(({ value }) => ({
                value,
                label: intl.formatMessage(getRole(value)),
              }))}
              context={intl.formatMessage({
                defaultMessage:
                  "The roles grant additional functionality to a user's login.",
                description:
                  "Additional context describing the purpose of the users's 'role' field.",
              })}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const UpdateUser: React.FunctionComponent<{ userId: string }> = ({
  userId,
}) => {
  const intl = useIntl();
  const [{ data: userData, fetching, error }] = useUserQuery({
    variables: { id: userId },
  });

  const [, executeMutation] = useUpdateUserAsAdminMutation();
  const handleUpdateUser = (id: string, data: UpdateUserAsAdminInput) =>
    /* We must pick only the fields belonging to UpdateUserInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      user: pick(data, [
        "bilingualEvaluation",
        "comprehensionLevel",
        "currentCity",
        "currentProvince",
        "estimatedLanguageAbility",
        "expectedSalary",
        "firstName",
        "hasDiploma",
        "hasDisability",
        "isGovEmployee",
        "interestedInLaterOrSecondment",
        "isIndigenous",
        "isVisibleMinority",
        "isWoman",
        "jobLookingStatus",
        "languageAbility",
        "lastName",
        "locationExemptions",
        "locationPreferences",
        "lookingForBilingual",
        "lookingForEnglish",
        "lookingForFrench",
        "roles",
        "preferredLang",
        "telephone",
        "verbalLevel",
        "wouldAcceptTemporary",
        "writtenLevel",
        "sub",
        "acceptedOperationalRequirements",
        "cmoAssets",
        "currentClassification",
        "expectedClassifications",
        "pools",
        "poolCandidates",
      ]),
    }).then((result) => {
      if (result.data?.updateUserAsAdmin) {
        return result.data.updateUserAsAdmin;
      }
      return Promise.reject(result.error);
    });

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );
  return userData?.user ? (
    <DashboardContentContainer>
      <UpdateUserForm
        initialUser={userData?.user}
        handleUpdateUser={handleUpdateUser}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "User {userId} not found.",
            description: "Message displayed for user not found.",
          },
          { userId },
        )}
      </p>
    </DashboardContentContainer>
  );
};

export default UpdateUser;
