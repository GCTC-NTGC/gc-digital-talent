import React from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import {
  Input,
  Select,
  Submit,
  enumToOptions,
  MultiSelectField,
} from "@gc-digital-talent/forms";
import { getLanguage, getRole, errorMessages } from "@gc-digital-talent/i18n";
import { emptyToNull, emptyToUndefined } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import {
  Language,
  CreateUserInput,
  CreateUserMutation,
  useCreateUserMutation,
  LegacyRole,
} from "~/api/generated";

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

export const CreateUserForm = ({ handleCreateUser }: CreateUserFormProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
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
                id: "D45cvR",
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
            <MultiSelectField
              id="legacyRoles"
              name="legacyRoles"
              label={intl.formatMessage({
                defaultMessage: "Roles",
                id: "kwNyl6",
                description: "Label displayed on the user form roles field.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select zero or more roles",
                id: "SQqD4j",
                description:
                  "Placeholder displayed on the user form roles field.",
              })}
              options={enumToOptions(LegacyRole).map(({ value }) => ({
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
            <div data-h2-align-self="base(flex-start)">
              <Submit />
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

const CreateUserPage = () => {
  const [, executeMutation] = useCreateUserMutation();
  const handleCreateUser = (data: CreateUserInput) =>
    executeMutation({ user: data }).then((result) => {
      if (result.data?.createUser) {
        return result.data?.createUser;
      }
      return Promise.reject(result.error);
    });

  return <CreateUserForm handleCreateUser={handleCreateUser} />;
};

export default CreateUserPage;
