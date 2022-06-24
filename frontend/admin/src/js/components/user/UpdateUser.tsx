import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import { toast } from "react-toastify";
import { Select, Submit, Input, MultiSelect } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { enumToOptions } from "@common/helpers/formUtils";
import { errorMessages, commonMessages } from "@common/messages";
import { getLanguage, getRole } from "@common/constants/localizedConstants";
import { emptyToNull } from "@common/helpers/util";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
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
  | "email"
  | "firstName"
  | "lastName"
  | "roles"
  | "preferredLang"
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

export const UpdateUserForm: React.FunctionComponent<UpdateUserFormProps> = ({
  initialUser,
  handleUpdateUser,
}) => {
  const intl = useIntl();
  const paths = useAdminRoutes();

  const formValuesToSubmitData = (
    values: FormValues,
  ): UpdateUserAsAdminInput => ({
    ...values,
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
        "email",
        "firstName",
        "lastName",
        "telephone",
        "preferredLang",
        "sub",
        "roles",
      ]),
    }).then((result) => {
      if (result.data?.updateUserAsAdmin) {
        return result.data.updateUserAsAdmin;
      }
      return Promise.reject(result.error);
    });

  return (
    <Pending fetching={fetching} error={error}>
      {" "}
      <DashboardContentContainer>
        {userData?.user ? (
          <UpdateUserForm
            initialUser={userData?.user}
            handleUpdateUser={handleUpdateUser}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "User {userId} not found.",
                  description: "Message displayed for user not found.",
                },
                { userId },
              )}
            </p>
          </NotFound>
        )}
      </DashboardContentContainer>
    </Pending>
  );
};

export default UpdateUser;
