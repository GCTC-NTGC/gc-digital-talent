import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { OperationContext, useQuery } from "urql";
import pick from "lodash/pick";

import { toast } from "@gc-digital-talent/toast";
import { Select, Submit, Input, enumToOptions } from "@gc-digital-talent/forms";
import {
  errorMessages,
  commonMessages,
  getLanguage,
} from "@gc-digital-talent/i18n";
import { emptyToNull, notEmpty } from "@gc-digital-talent/helpers";
import { NotFound, Pending, Heading } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";

import {
  UpdateUserRolesInput,
  UpdateUserSubInput,
  useUpdateUserRolesMutation,
  useUpdateUserSubMutation,
  Language,
  Scalars,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
  useUpdateUserAsAdminMutation,
  useUserQuery,
  useDeleteUserMutation,
} from "~/api/generated";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";

import UserRoleTable from "./components/IndividualRoleTable";
import TeamRoleTable from "./components/TeamRoleTable";
import DeleteUserSection from "./components/DeleteUserSection";
import UpdateUserSubForm from "./components/UpdateUserSubForm";

type FormValues = Pick<
  UpdateUserAsAdminInput,
  | "email"
  | "firstName"
  | "lastName"
  | "preferredLang"
  | "preferredLanguageForInterview"
  | "preferredLanguageForExam"
  | "telephone"
>;
interface UpdateUserFormProps {
  initialUser: User;
  handleUpdateUser: (
    id: string,
    data: UpdateUserAsAdminInput,
  ) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;
}

export const UpdateUserForm = ({
  initialUser,
  handleUpdateUser,
}: UpdateUserFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();

  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsAdminInput => ({
    ...values,
    id: initialUser.id,
    // empty string isn't valid according to API validation regex pattern, but null is valid.
    telephone: emptyToNull(values.telephone),
    // empty string will violate uniqueness constraints
    email: emptyToNull(values.email),
  });

  const dataToFormValues = (data: User): FormValues => ({
    ...data,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialUser),
  });
  const { handleSubmit } = methods;

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.userTable();

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleUpdateUser(initialUser.id, formValuesToSubmitData(data))
      .then(() => {
        navigate(navigateTo);
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

  return (
    <section data-h2-container="base(left, s)">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
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
            options={enumToOptions(Language).map(({ value }) => ({
              value,
              label: intl.formatMessage(getLanguage(value)),
            }))}
          />
          <Select
            id="preferredLanguageForInterview"
            label={intl.formatMessage({
              defaultMessage: "Preferred spoken interview language",
              id: "DB9pFd",
              description: "Title for preferred spoken interview language",
            })}
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
            options={enumToOptions(Language).map(({ value }) => ({
              value,
              label: intl.formatMessage(getLanguage(value)),
            }))}
          />
          <Select
            id="preferredLanguageForExam"
            label={intl.formatMessage({
              defaultMessage: "Preferred written exam language",
              id: "fg2wla",
              description: "Title for preferred written exam language",
            })}
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
            options={enumToOptions(Language).map(({ value }) => ({
              value,
              label: intl.formatMessage(getLanguage(value)),
            }))}
          />
          <div data-h2-align-self="base(flex-start)">
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

const UpdateUserData_Query = graphql(/* GraphQL */ `
  query UpdateUserData {
    roles {
      id
      name
      isTeamBased
      displayName {
        en
        fr
      }
    }
  }
`);

type RouteParams = {
  userId: Scalars["ID"];
};

const UpdateUserPage = () => {
  const intl = useIntl();
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data: rolesData, fetching: rolesFetching, error: rolesError }] =
    useQuery({ query: UpdateUserData_Query });
  const [{ data: userData, fetching, error }] = useUserQuery({
    variables: { id: userId },
    context,
  });

  const [, executeUpdateMutation] = useUpdateUserAsAdminMutation();
  const [, executeUpdateRolesMutation] = useUpdateUserRolesMutation();
  const [, executeUpdateSubMutation] = useUpdateUserSubMutation();

  const handleUpdateUser = (id: string, data: UpdateUserAsAdminInput) =>
    /* We must pick only the fields belonging to UpdateUserInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeUpdateMutation({
      id,
      user: {
        id,
        // Do not include email in the request if it is not part of form data
        // to prevent accidentally setting it to null
        email: data.email !== undefined ? emptyToNull(data.email) : undefined,
        ...pick(data, [
          "firstName",
          "lastName",
          "telephone",
          "preferredLang",
          "preferredLanguageForInterview",
          "preferredLanguageForExam",
          "sub",
          "roleAssignmentsInput",
        ]),
      },
    }).then((result) => {
      if (result.data?.updateUserAsAdmin) {
        return result.data.updateUserAsAdmin;
      }
      return Promise.reject(result.error);
    });

  const handleUpdateUserRoles = (data: UpdateUserRolesInput) =>
    executeUpdateRolesMutation({
      updateUserRolesInput: {
        ...data,
      },
    }).then((result) => {
      if (result.data?.updateUserRoles) {
        return result.data.updateUserRoles;
      }
      return Promise.reject(result.error);
    });

  const handleUpdateUserSub = (data: UpdateUserSubInput) =>
    executeUpdateSubMutation({
      updateUserSubInput: {
        ...data,
      },
    }).then((result) => {
      if (result.data?.updateUserSub) {
        return result.data.updateUserSub;
      }
      return Promise.reject(result.error);
    });

  const [, executeDeleteMutation] = useDeleteUserMutation();
  const handleDeleteUser = (id: string) =>
    executeDeleteMutation({
      id,
    }).then((result) => {
      if (result.data?.deleteUser) {
        return result.data.deleteUser;
      }
      return Promise.reject(result.error);
    });

  const availableRoles = rolesData?.roles.filter(notEmpty);

  return (
    <AdminContentWrapper>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Update user",
          id: "Eydy42",
          description: "Page title for the user edit page",
        })}
      />
      <Pending fetching={fetching || rolesFetching} error={error || rolesError}>
        {userData?.user ? (
          <>
            <UpdateUserForm
              initialUser={userData.user}
              handleUpdateUser={handleUpdateUser}
            />
            <UpdateUserSubForm
              user={userData.user}
              onUpdateSub={handleUpdateUserSub}
            />
            <Heading level="h2" size="h3" data-h2-font-weight="base(700)">
              {intl.formatMessage(adminMessages.rolesAndPermissions)}
            </Heading>
            <UserRoleTable
              user={userData.user}
              availableRoles={availableRoles || []}
              onUpdateUserRoles={handleUpdateUserRoles}
            />
            <TeamRoleTable
              user={userData.user}
              availableRoles={availableRoles || []}
              onUpdateUserRoles={handleUpdateUserRoles}
            />
            <Heading level="h2" size="h3" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Advanced tools",
                id: "KoKXUw",
                description: "Heading for making major changes to a user",
              })}
            </Heading>
            <DeleteUserSection
              user={userData.user}
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
  );
};

export default UpdateUserPage;
