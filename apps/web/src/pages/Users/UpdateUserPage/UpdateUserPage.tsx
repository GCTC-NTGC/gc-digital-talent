import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { OperationContext } from "urql";
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

import {
  useListRolesQuery,
  Language,
  Scalars,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
  useUpdateUserAsAdminMutation,
  useUserQuery,
} from "~/api/generated";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { getFullNameLabel } from "~/utils/nameUtils";

import adminMessages from "~/messages/adminMessages";
import UserRoleTable from "./components/IndividualRoleTable";
import { TeamRoleTable } from "./components/TeamRoleTable";

type FormValues = Pick<
  UpdateUserAsAdminInput,
  | "email"
  | "firstName"
  | "lastName"
  | "preferredLang"
  | "preferredLanguageForInterview"
  | "preferredLanguageForExam"
  | "telephone"
  | "sub"
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
    sub: emptyToNull(values.sub),
  });

  const methods = useForm<FormValues>({
    defaultValues: initialUser,
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleUpdateUser(initialUser.id, formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.userTable());
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
            label={intl.formatMessage({
              defaultMessage: "Email",
              id: "sZHcsV",
              description: "Label displayed on the user form email field.",
            })}
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
            label={intl.formatMessage({
              defaultMessage: "Telephone",
              id: "8L5kDc",
              description: "Label displayed on the user form telephone field.",
            })}
            type="tel"
            name="telephone"
          />
          <Select
            id="preferredLang"
            label={intl.formatMessage({
              defaultMessage: "Preferred Communication Language",
              id: "Vvc9/b",
              description:
                "Label displayed on the user form preferred communication language field.",
            })}
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
              defaultMessage: "Preferred Spoken Interview Language",
              id: "RIMCZn",
              description:
                "Label displayed on the user form preferred spoken interview language field.",
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
              defaultMessage: "Preferred Written Exam Language",
              id: "SxP9zE",
              description:
                "Label displayed on the user form preferred written exam language field.",
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
          <Input
            id="sub"
            label={intl.formatMessage({
              defaultMessage: "Subject",
              id: "m4rXNt",
              description: "Label displayed on the user form subject field.",
            })}
            type="text"
            name="sub"
            context={intl.formatMessage({
              defaultMessage:
                "The 'subject' is a string that uniquely identifies a user's login identity.",
              id: "I8v/Uy",
              description:
                "Additional context describing the purpose of the users's 'subject' field.",
            })}
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

type RouteParams = {
  userId: Scalars["ID"];
};

const UpdateUserPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { userId } = useParams<RouteParams>();
  const [{ data: rolesData, fetching: rolesFetching, error: rolesError }] =
    useListRolesQuery();
  const [{ data: userData, fetching, error }] = useUserQuery({
    variables: { id: userId || "" },
    context,
  });

  const [, executeMutation] = useUpdateUserAsAdminMutation();
  const handleUpdateUser = (id: string, data: UpdateUserAsAdminInput) =>
    /* We must pick only the fields belonging to UpdateUserInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
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
  const availableRoles = rolesData?.roles.filter(notEmpty);

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.users),
      url: routes.userTable(),
    },
    ...(userId
      ? [
          {
            label: getFullNameLabel(
              userData?.user?.firstName,
              userData?.user?.lastName,
              intl,
            ),
            url: routes.userView(userId),
          },
        ]
      : []),
    ...(userId
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Edit<hidden> user</hidden>",
              id: "0WIPpI",
              description: "Edit user breadcrumb text",
            }),
            url: routes.userUpdate(userId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
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
            <Heading level="h2" size="h3" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Roles and permissions",
                id: "m54J0C",
                description:
                  "Heading for updating a users roles and permissions",
              })}
            </Heading>
            <UserRoleTable
              user={userData.user}
              availableRoles={availableRoles || []}
              onUpdateUser={handleUpdateUser}
            />
            <TeamRoleTable
              user={userData.user}
              availableRoles={availableRoles || []}
              onUpdateUser={handleUpdateUser}
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
