import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";

import { toast } from "@common/components/Toast";
import { Select, Submit, Input, MultiSelect } from "@common/components/form";
import { enumToOptions } from "@common/helpers/formUtils";
import { errorMessages, commonMessages } from "@common/messages";
import { getLanguage, getRole } from "@common/constants/localizedConstants";
import { emptyToNull } from "@common/helpers/util";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import Heading from "@common/components/Heading/Heading";
import SEO from "@common/components/SEO/SEO";

import { useAdminRoutes } from "../../adminRoutes";
import {
  Language,
  Role,
  Scalars,
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

export const UpdateUserForm: React.FunctionComponent<UpdateUserFormProps> = ({
  initialUser,
  handleUpdateUser,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useAdminRoutes();

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
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Update User",
          id: "DguVoT",
          description: "Title displayed on the update a user form.",
        })}
      </Heading>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                id: "oQnVSn",
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
                id: "8L5kDc",
                description:
                  "Label displayed on the user form telephone field.",
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
                defaultMessage: "Select a language...",
                id: "0UY4v5",
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
                defaultMessage: "Select a language...",
                id: "fGAMy/",
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
                defaultMessage: "Select a language...",
                id: "F4Flho",
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
            <MultiSelect
              id="roles"
              name="roles"
              label={intl.formatMessage({
                defaultMessage: "Roles",
                id: "kwNyl6",
                description: "Label displayed on the user form roles field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select zero or more roles...",
                id: "Cw8pyL",
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
                id: "Z6sh9j",
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

type RouteParams = {
  userId: Scalars["ID"];
};

const UpdateUser = () => {
  const intl = useIntl();
  const { userId } = useParams<RouteParams>();
  const [{ data: userData, fetching, error }] = useUserQuery({
    variables: { id: userId || "" },
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
        email: emptyToNull(data.email),
        ...pick(data, [
          "firstName",
          "lastName",
          "telephone",
          "preferredLang",
          "preferredLanguageForInterview",
          "preferredLanguageForExam",
          "sub",
          "roles",
        ]),
      },
    }).then((result) => {
      if (result.data?.updateUserAsAdmin) {
        return result.data.updateUserAsAdmin;
      }
      return Promise.reject(result.error);
    });

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Update user",
          id: "Eydy42",
          description: "Page title for the user edit page",
        })}
      />
      <Pending fetching={fetching} error={error}>
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
                    id: "0SoKjt",
                    description: "Message displayed for user not found.",
                  },
                  { userId },
                )}
              </p>
            </NotFound>
          )}
        </DashboardContentContainer>
      </Pending>
    </>
  );
};

export default UpdateUser;
