import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import commonMessages from "../commonMessages";
import {
  Language,
  UpdateUserInput,
  User,
  useUpdateUserMutation,
  useUserQuery,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Input from "../form/Input";
import Select from "../form/Select";
import Submit from "../form/Submit";

const messages = defineMessages({
  headingTitle: {
    id: "updateUser.headingTitle",
    defaultMessage: "Update User",
    description: "Title displayed on the Update a User form.",
  },
  emailLabel: {
    id: "updateUser.field.emailLabel",
    defaultMessage: "Email: ",
    description: "Label displayed on the Update a User form Email field.",
  },
  firstNameLabel: {
    id: "updateUser.field.firstNameLabel",
    defaultMessage: "First Name: ",
    description: "Label displayed on the Update a User form First Name field.",
  },
  lastNameLabel: {
    id: "updateUser.field.lastNameLabel",
    defaultMessage: "Last Name: ",
    description: "Label displayed on the Update a User form Last Name field.",
  },
  telephoneLabel: {
    id: "updateUser.field.telephoneLabel",
    defaultMessage: "Telephone: ",
    description: "Label displayed on the Update a User form Telephone field.",
  },
  preferredLanguageLabel: {
    id: "updateUser.field.preferredLanguageLabel",
    defaultMessage: "Preferred Language: ",
    description:
      "Label displayed on the Update a User form Preferred Language field.",
  },
  preferredLanguagePlaceholder: {
    id: "updateUser.field.preferredLanguagePlaceholder",
    defaultMessage: "Select a language...",
    description:
      "Option value displayed on the Update a User form Preferred Language field for blank.",
  },
  preferredLanguageEnglish: {
    id: "updateUser.field.preferredLanguageEnglish",
    defaultMessage: "English",
    description:
      "Option value displayed on the Update a User form Preferred Language field for English.",
  },
  preferredLanguageFrench: {
    id: "updateUser.field.preferredLanguageFrench",
    defaultMessage: "French",
    description:
      "Option value displayed on the Update a User form Preferred Language field for French.",
  },
  userNotFound: {
    id: "updateUser.userNotFound",
    defaultMessage: "User {userId} not found.",
    description: "Message displayed for user not found.",
  },
});

type FormValues = UpdateUserInput;
interface UpdateUserFormProps {
  initialUser: User;
  handleUpdateUser: (id: string, data: FormValues) => Promise<FormValues>;
}

export const UpdateUserForm: React.FunctionComponent<UpdateUserFormProps> = ({
  initialUser,
  handleUpdateUser,
}) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({ defaultValues: initialUser });
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateUser(initialUser.id, data)
      .then(reset) // Reset form with returned data. This resets isDirty flag.
      .catch(() => {
        // Something went wrong with handleUserUpdate.
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
            value={initialUser.email}
            disabled
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
                label: intl.formatMessage(
                  messages.preferredLanguagePlaceholder,
                ),
                disabled: true,
              },
              {
                value: Language.En,
                label: intl.formatMessage(messages.preferredLanguageEnglish),
              },
              {
                value: Language.Fr,
                label: intl.formatMessage(messages.preferredLanguageFrench),
              },
            ]}
          />
          <Submit />
        </form>
      </FormProvider>
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

  const [, executeMutation] = useUpdateUserMutation();
  const handleUpdateUser = (id: string, data: UpdateUserInput) =>
    /* We must pick only the fields belonging to UpdateUserInput, because its possible
       the data object contains other props at runtime, and this will cause the
       graphql operation to fail. */
    executeMutation({
      id,
      user: pick(data, ["firstName", "lastName", "telephone", "preferredLang"]),
    }).then((result) => {
      if (result.data?.updateUser) {
        return result.data?.updateUser;
      }
      return Promise.reject(result.error);
    });

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)} {error.message}
      </p>
    );
  return userData?.user ? (
    <UpdateUserForm
      initialUser={userData?.user}
      handleUpdateUser={handleUpdateUser}
    />
  ) : (
    <p>{intl.formatMessage(messages.userNotFound, { userId })}</p>
  );
};

export default UpdateUser;
