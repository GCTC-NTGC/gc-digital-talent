import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  errorMessages,
  Input,
  Select,
  Submit,
  navigate,
  userTablePath,
  enumToOptions,
  getLanguage,
} from "common";
import {
  Language,
  CreateUserInput,
  CreateUserMutation,
  useCreateUserMutation,
} from "../../api/generated";
import messages from "./messages";

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
        navigate(userTablePath());
        toast.success(intl.formatMessage(messages.createSuccess));
      })
      .catch(() => {
        toast.error(intl.formatMessage(messages.createError));
      });
  };

  return (
    <section>
      <h2>{intl.formatMessage(messages.createHeading)}</h2>
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
            nullSelection={intl.formatMessage(
              messages.preferredLanguagePlaceholder,
            )}
            rules={{ required: errorMessages.required }}
            options={enumToOptions(Language).map(({ value }) => ({
              value,
              label: intl.formatMessage(getLanguage(value)),
            }))}
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
