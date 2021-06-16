import React from "react";
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

type FormValues = CreateUserInput;
interface CreateUserFormProps {
  handleCreateUser: (data: FormValues) => Promise<CreateUserMutation["createUser"]>;
}

export const CreateUserForm: React.FunctionComponent<CreateUserFormProps> = ({
  handleCreateUser,
}) => {
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
      <h2>Create a User</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            label="Email: "
            type="text"
            name="email"
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="firstName"
            label="First Name: "
            type="text"
            name="firstName"
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="lastName"
            label="Last Name: "
            type="text"
            name="lastName"
            rules={{ required: errorMessages.required }}
          />
          <Input
            id="telephone"
            label="Telephone: "
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
            label="Preferred Language: "
            name="preferredLang"
            rules={{ required: errorMessages.required }}
            options={[
              { value: "", text: "Select a language..." },
              { value: Language.En, text: "English" },
              { value: Language.Fr, text: "French" },
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

  return (
    <CreateUserForm
      handleCreateUser={handleCreateUser}
    />
  );
};
