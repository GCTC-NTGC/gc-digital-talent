import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Language,
  CreateUserInput,
  CreateUserMutation,
  useCreateUserMutation,
} from "../api/generated";
import errorMessages from "./form/errorMessages";
import Input from "./form/Input";
import Select from "./form/Select";
import Submit from "./form/Submit";

const messages = defineMessages({
  headingTitle: {
    id: "createUser.headingTitle",
    defaultMessage: "Create User",
    description: "Title displayed on the Create a User form.",
  },
  emailLabel: {
    id: "createUser.field.emailLabel",
    defaultMessage: "Email: ",
    description: "Label displayed on the Create a User form Email field.",
  },
  firstNameLabel: {
    id: "createUser.field.firstNameLabel",
    defaultMessage: "First Name: ",
    description: "Label displayed on the Create a User form First Name field.",
  },
  lastNameLabel: {
    id: "createUser.field.lastNameLabel",
    defaultMessage: "Last Name: ",
    description: "Label displayed on the Create a User form Last Name field.",
  },
  telephoneLabel: {
    id: "createUser.field.telephoneLabel",
    defaultMessage: "Telephone: ",
    description: "Label displayed on the Create a User form Telephone field.",
  },
  preferredLanguageLabel: {
    id: "createUser.field.preferredLanguageLabel",
    defaultMessage: "Preferred Language: ",
    description:
      "Label displayed on the Create a User form Preferred Language field.",
  },
  preferredLanguagePlaceholder: {
    id: "createUser.field.preferredLanguagePlaceholder",
    defaultMessage: "Select a language...",
    description:
      "Option value displayed on the Create a User form Preferred Language field for blank.",
  },
  preferredLanguageEnglish: {
    id: "createUser.field.preferredLanguageEnglish",
    defaultMessage: "English",
    description:
      "Option value displayed on the Create a User form Preferred Language field for English.",
  },
  preferredLanguageFrench: {
    id: "createUser.field.preferredLanguageFrench",
    defaultMessage: "French",
    description:
      "Option value displayed on the Create a User form Preferred Language field for French.",
  },
});

type FormValues = CreateUserInput;
interface CreateUserFormProps {
  handleCreateUser: (
    data: FormValues,
  ) => Promise<CreateUserMutation["createUser"]>;
}

export const CreateUserForm: React.FunctionComponent<CreateUserFormProps> = ({
  handleCreateUser,
}) => {
  const intl = useIntl();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateUser(data)
      .then(() => {
        // TODO: Navigate to user dashboard.
      })
      .catch(() => {
        // Something went wrong with handleCreateUser.
        // Do nothing.
      });
  };

  return (
    <section>
      <h2>{intl.formatMessage(messages.headingTitle)}</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            label={intl.formatMessage(messages.emailLabel)}
            type="text"
            name="email"
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="firstName"
            label={intl.formatMessage(messages.firstNameLabel)}
            type="text"
            name="firstName"
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="lastName"
            label={intl.formatMessage(messages.lastNameLabel)}
            type="text"
            name="lastName"
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="telephone"
            label={intl.formatMessage(messages.telephoneLabel)}
            type="tel"
            name="telephone"
            rules={{
              required: errorMessages.required,
              pattern: {
                value: /^\+[1-9]\d{1,14}$/,
                message: errorMessages.telephone,
              },
            }}
          />
          <Select
            id="preferredLang"
            label={intl.formatMessage(messages.preferredLanguageLabel)}
            name="preferredLang"
            rules={{ required: errorMessages.required }}
            options={[
              {
                value: "",
                text: intl.formatMessage(messages.preferredLanguagePlaceholder),
              },
              {
                value: Language.En,
                text: intl.formatMessage(messages.preferredLanguageEnglish),
              },
              {
                value: Language.Fr,
                text: intl.formatMessage(messages.preferredLanguageFrench),
              },
            ]}
          />
          <Submit />
        </form>
      </FormProvider>
    </section>
  );
};

export const CreateUser: React.FunctionComponent = () => {
  const [_result, executeMutation] = useCreateUserMutation();
  const handleCreateUser = (data: CreateUserInput) =>
    executeMutation({ user: data }).then((result) => {
      if (result.data?.createUser) {
        return result.data?.createUser;
      }
      return Promise.reject(result.error);
    });

  return <CreateUserForm handleCreateUser={handleCreateUser} />;
};
