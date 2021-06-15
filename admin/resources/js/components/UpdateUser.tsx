import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Language,
  UpdateUserInput,
  User,
  useUpdateUserMutation,
} from "../api/generated";
import errorMessages from "./form/errorMessages";
import Input from "./form/Input";
import Select from "./form/Select";
import Submit from "./form/Submit";

type FormValues = UpdateUserInput;
interface UpdateUserFormProps {
  initialUser: User;
  handleUpdateUser: (id: string, data: FormValues) => Promise<FormValues>;
}

export const UpdateUserForm: React.FunctionComponent<UpdateUserFormProps> = ({
  initialUser,
  handleUpdateUser,
}) => {
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
      <h2>Update a User</h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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

export const UpdateUser: React.FunctionComponent<{ initialUser: User }> = ({
  initialUser,
}) => {
  const [_result, executeMutation] = useUpdateUserMutation();
  const handleUpdateUser = (id: string, data: UpdateUserInput) =>
    executeMutation({ id, user: data }).then((result) => {
      if (result.data?.updateUser) {
        return result.data?.updateUser;
      }
      return Promise.reject(result.error);
    });

  return (
    <UpdateUserForm
      initialUser={initialUser}
      handleUpdateUser={handleUpdateUser}
    />
  );
};
