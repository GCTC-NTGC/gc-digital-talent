import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { OperationContext, useMutation, useQuery } from "urql";
import pick from "lodash/pick";

import { toast } from "@gc-digital-talent/toast";
import {
  Select,
  Submit,
  Input,
  localizedEnumToOptions,
  Checkbox,
} from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import { emptyToNull, unpackMaybes } from "@gc-digital-talent/helpers";
import { NotFound, Pending, Heading } from "@gc-digital-talent/ui";
import {
  UpdateUserRolesInput,
  UpdateUserSubInput,
  Scalars,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
  graphql,
  UpdateUserDataQuery as UpdateUserDataQueryType,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useReturnPath from "~/hooks/useReturnPath";
import { getLabels } from "~/components/Profile/components/LanguageProfile/utils";

import UserRoleTable from "./components/IndividualRoleTable";
import DeleteUserSection from "./components/DeleteUserSection";
import UpdateUserSubForm from "./components/UpdateUserSubForm";
import {
  DeleteUser_Mutation,
  UpdateUserAsAdmin_Mutation,
  UpdateUserData_Query,
  UpdateUserRoles_Mutation,
  UpdateUserSub_Mutation,
} from "./operations";
import CommunityRoleTable from "./components/CommunityRoleTable";
import ProcessRoleTable from "./components/ProcessRoleTable";

export const UpdateUserOptions_Fragment = graphql(/* GraphQL */ `
  fragment UpdateUserOptions on Query {
    languages: localizedEnumStrings(enumName: "Language") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export type UpdateUserDataAuthInfoType = NonNullable<
  UpdateUserDataQueryType["user"]
>["authInfo"];

type PartialUser = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "preferredLang"
  | "preferredLanguageForInterview"
  | "preferredLanguageForExam"
  | "telephone"
  | "isGovEmployee"
  | "workEmail"
>;
type FormValues = Pick<
  UpdateUserAsAdminInput,
  | "email"
  | "firstName"
  | "lastName"
  | "preferredLang"
  | "preferredLanguageForInterview"
  | "preferredLanguageForExam"
  | "telephone"
  | "workEmail"
> & { isGovEmployee: string };
interface UpdateUserFormProps {
  initialUser: PartialUser;
  formOptionsQuery: FragmentType<typeof UpdateUserOptions_Fragment>;
  handleUpdateUser: (
    id: string,
    data: UpdateUserAsAdminInput,
  ) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;
}

export const UpdateUserForm = ({
  initialUser,
  formOptionsQuery,
  handleUpdateUser,
}: UpdateUserFormProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  const navigate = useNavigate();
  const paths = useRoutes();
  const formOptions = getFragment(UpdateUserOptions_Fragment, formOptionsQuery);

  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsAdminInput => ({
    ...values,
    id: initialUser.id,
    // empty string isn't valid according to API validation regex pattern, but null is valid.
    telephone: emptyToNull(values.telephone),
    // empty string will violate uniqueness constraints
    email: emptyToNull(values.email),
    // massage from FormValue type to UpdateUserAsAdminInput
    isGovEmployee: values.isGovEmployee ? true : false,
    // empty string will violate uniqueness constraints
    workEmail: emptyToNull(values.workEmail),
  });

  const dataToFormValues = ({
    email,
    firstName,
    lastName,
    telephone,
    preferredLang,
    preferredLanguageForExam,
    preferredLanguageForInterview,
    isGovEmployee,
    workEmail,
  }: PartialUser): FormValues => ({
    email,
    firstName,
    lastName,
    telephone,
    preferredLang: preferredLang?.value,
    preferredLanguageForExam: preferredLanguageForExam?.value,
    preferredLanguageForInterview: preferredLanguageForInterview?.value,
    isGovEmployee: isGovEmployee ? "true" : "",
    workEmail,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialUser),
  });
  const { handleSubmit } = methods;
  const navigateTo = useReturnPath(paths.userTable());

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    await handleUpdateUser(initialUser.id, formValuesToSubmitData(values))
      .then(async () => {
        await navigate(navigateTo);
        toast.success(
          intl.formatMessage({
            defaultMessage: "User updated successfully!",
            id: "evxvnW",
            description:
              "Message displayed to user after user is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating user failed",
            id: "5FFRV2",
            description:
              "Message displayed to user after user fails to get updated.",
          }),
        );
      });
  };

  const languageOptions = localizedEnumToOptions(
    unpackMaybes(formOptions?.languages),
    intl,
  );

  return (
    <section className="max-w-2xl">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
          <Input
            id="email"
            label={intl.formatMessage(commonMessages.email)}
            type="email"
            name="email"
          />
          <Input
            id="firstName"
            label={intl.formatMessage({
              defaultMessage: "First Name",
              id: "XKjVO0",
              description: "Label displayed on the user form first name field.",
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
              id: "oQnVSn",
              description: "Label displayed on the user form last name field.",
            })}
            type="text"
            name="lastName"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="telephone"
            label={intl.formatMessage(commonMessages.telephone)}
            type="tel"
            name="telephone"
          />
          <Select
            id="preferredLang"
            label={intl.formatMessage(
              commonMessages.preferredCommunicationLanguage,
            )}
            name="preferredLang"
            nullSelection={intl.formatMessage({
              defaultMessage: "Select a language",
              id: "uup5F2",
              description:
                "Placeholder displayed on the user form preferred communication language field.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={languageOptions}
          />
          <Select
            id="preferredLanguageForInterview"
            label={labels.prefSpokenInterviewLang}
            name="preferredLanguageForInterview"
            nullSelection={intl.formatMessage({
              defaultMessage: "Select a language",
              id: "0SEvhI",
              description:
                "Placeholder displayed on the user form preferred spoken interview language field.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={languageOptions}
          />
          <Select
            id="preferredLanguageForExam"
            label={labels.prefWrittenExamLang}
            name="preferredLanguageForExam"
            nullSelection={intl.formatMessage({
              defaultMessage: "Select a language",
              id: "98lXOH",
              description:
                "Placeholder displayed on the user form preferred written exam language  field.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={languageOptions}
          />
          <Checkbox
            id="isGovEmployee"
            name="isGovEmployee"
            value="true"
            label={intl.formatMessage({
              defaultMessage: "Government employee",
              id: "bOA3EH",
              description: "Label for the government employee field",
            })}
          />
          <Input
            id="workEmail"
            label={intl.formatMessage(commonMessages.workEmail)}
            type="email"
            name="workEmail"
          />
          <div className="self-start">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["Role"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of roles will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const UpdateUserPage = () => {
  const intl = useIntl();
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data, fetching, error }] = useQuery({
    query: UpdateUserData_Query,
    variables: { id: userId },
    context,
  });

  const [, executeUpdateMutation] = useMutation(UpdateUserAsAdmin_Mutation);
  const [, executeUpdateRolesMutation] = useMutation(UpdateUserRoles_Mutation);
  const [, executeUpdateSubMutation] = useMutation(UpdateUserSub_Mutation);

  const handleUpdateUser = (id: string, input: UpdateUserAsAdminInput) =>
    /* We must pick only the fields belonging to UpdateUserInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeUpdateMutation({
      id,
      user: {
        id,
        // Do not include email in the request if it is not part of form data
        // to prevent accidentally setting it to null
        email: input.email !== undefined ? emptyToNull(input.email) : undefined,
        ...pick(input, [
          "firstName",
          "lastName",
          "telephone",
          "preferredLang",
          "preferredLanguageForInterview",
          "preferredLanguageForExam",
          "sub",
          "roleAssignmentsInput",
          "isGovEmployee",
          "workEmail",
        ]),
      },
    }).then((result) => {
      if (result.data?.updateUserAsAdmin) {
        return result.data.updateUserAsAdmin;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const handleUpdateUserRoles = (input: UpdateUserRolesInput) =>
    executeUpdateRolesMutation({
      updateUserRolesInput: {
        ...input,
      },
    }).then((result) => {
      if (result.data?.updateUserRoles) {
        return result.data.updateUserRoles;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const handleUpdateUserSub = (input: UpdateUserSubInput) =>
    executeUpdateSubMutation({
      updateUserSubInput: {
        ...input,
      },
    }).then((result) => {
      if (result.data?.updateUserSub) {
        return result.data.updateUserSub;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const [, executeDeleteMutation] = useMutation(DeleteUser_Mutation);
  const handleDeleteUser = (id: string) =>
    executeDeleteMutation({
      id,
    }).then((result) => {
      if (result.data?.deleteUser) {
        return result.data.deleteUser;
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  const availableRoles = unpackMaybes(data?.roles);

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Update user",
          id: "Eydy42",
          description: "Page title for the user edit page",
        })}
      />
      <AdminContentWrapper>
        <Pending fetching={fetching} error={error}>
          {data?.user ? (
            <>
              <UpdateUserForm
                formOptionsQuery={data}
                initialUser={data.user}
                handleUpdateUser={handleUpdateUser}
              />
              <UpdateUserSubForm
                authInfo={data.user?.authInfo}
                onUpdateSub={handleUpdateUserSub}
              />
              <Heading level="h2" size="h3" className="font-bold">
                {intl.formatMessage(adminMessages.rolesAndPermissions)}
              </Heading>
              <UserRoleTable
                user={data.user}
                authInfo={data.user?.authInfo}
                availableRoles={availableRoles}
                onUpdateUserRoles={handleUpdateUserRoles}
              />
              <CommunityRoleTable
                user={data.user}
                authInfo={data.user?.authInfo}
                availableRoles={availableRoles}
                onUpdateUserRoles={handleUpdateUserRoles}
              />
              <ProcessRoleTable
                user={data.user}
                authInfo={data.user?.authInfo}
                availableRoles={availableRoles}
                onUpdateUserRoles={handleUpdateUserRoles}
              />
              <Heading level="h2" size="h3" className="font-bold">
                {intl.formatMessage(adminMessages.advancedTools)}
              </Heading>
              <DeleteUserSection
                user={data.user}
                onDeleteUser={handleDeleteUser}
              />
            </>
          ) : (
            <NotFound
              headingMessage={intl.formatMessage(commonMessages.notFound)}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage: "User {userId} not found.",
                    id: "0SoKjt",
                    description: "Message displayed for user not found.",
                  },
                  { userId },
                )}
              </p>
            </NotFound>
          )}
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <UpdateUserPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateUserPage";

export default UpdateUserPage;
