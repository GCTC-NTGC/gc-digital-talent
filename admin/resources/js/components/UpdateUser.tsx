import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import errorMessages from "./form/errorMessages";
import Form from "./form/Form";
import Input from "./form/Input";
import Select from "./form/Select";
import Submit from "./form/Submit";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  preferredLang: "EN" | "FR";
}

interface UpdateUserFormProps {
  user: User;
  handleUpdateUser: (
    id: string,
    data: Omit<User, "email" | "id">,
  ) => Promise<User>;
}

// eslint-disable-next-line import/prefer-default-export
export const UpdateUserForm: React.FunctionComponent<UpdateUserFormProps> = ({
  user,
  handleUpdateUser,
}) => {
  interface FormValues {
    firstName: string;
    lastName: string;
    telephone: string;
    preferredLang: "EN" | "FR";
  }
  const methods = useForm<FormValues>({ defaultValues: user });
  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateUser(user.id, data)
      .then(() => reset(data)) // This resets the isDirty flag.
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
              { value: "EN", text: "English" },
              { value: "FR", text: "French" },
            ]}
          />
          <Submit />
        </form>
      </FormProvider>
    </section>
  );
};
