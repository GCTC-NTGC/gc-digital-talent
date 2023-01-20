import React from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { toast } from "@common/components/Toast";
import { Input, MultiSelect, Select, Submit } from "@common/components/form";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLanguage, getRole } from "@common/constants/localizedConstants";
import { errorMessages } from "@common/messages";
import { emptyToNull, emptyToUndefined } from "@common/helpers/util";
import Heading from "@common/components/Heading/Heading";

import { useAdminRoutes } from "../../adminRoutes";
import {
  Language,
  CreateUserInput,
  CreateUserMutation,
  useCreateUserMutation,
  Role,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = CreateUserInput;
interface CreateUserFormProps {
  handleCreateUser: (
    data: FormValues,
  ) => Promise<CreateUserMutation["createUser"]>;
}

const formValuesToData = (values: FormValues): CreateUserInput => ({
  ...values,
  // empty string isn't valid according to API validation regex pattern, but null is valid.
  telephone: emptyToNull(values.telephone),
  // empty string will violate uniqueness constraints
  email: emptyToNull(values.email),
  sub: emptyToUndefined(values.sub),
});

export const CreateUserForm: React.FunctionComponent<CreateUserFormProps> = ({
  handleCreateUser,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateUser(formValuesToData(data))
      .then(() => {
        navigate(paths.userTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "User created successfully!",
            id: "fAIozk",
            description:
              "Message displayed to user after user is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating user failed",
            id: "EfRVfk",
            description:
              "Message displayed to user after user fails to get created.",
          }),
        );
      });
  };

  return (
    <section data-h2-container="base(left, s)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Create User",
          id: "/uqLeF",
          description: "Title displayed on the create a user form.",
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
                id: "RYW3AP",
                description:
                  "Placeholder displayed on the user form preferred written exam language field.",
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

const CreateUser: React.FunctionComponent = () => {
  const [, executeMutation] = useCreateUserMutation();
  const handleCreateUser = (data: CreateUserInput) =>
    executeMutation({ user: data }).then((result) => {
      if (result.data?.createUser) {
        return result.data?.createUser;
      }
      return Promise.reject(result.error);
    });

  return (
    <DashboardContentContainer>
      <CreateUserForm handleCreateUser={handleCreateUser} />
    </DashboardContentContainer>
  );
};

export default CreateUser;
