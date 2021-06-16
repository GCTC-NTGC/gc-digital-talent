import React from "react";
import { SubmitHandler } from "react-hook-form";
import { Language, UpdateUserInput } from "../api/generated";
import errorMessages from "./form/errorMessages";
import Form from "./form/Form";
import Input from "./form/Input";
import Select from "./form/Select";

interface CreateUserFormProps {
  handleCreateUser: (data: UpdateUserInput) => Promise<void>;
}

export const CreateUserForm: React.FunctionComponent<CreateUserFormProps> = ({
  handleCreateUser,
}) => {
  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    preferredLang: Language.En | Language.Fr;
  }

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleCreateUser({ ...data });
  };

  return (
    <section>
      <h2>Create a User</h2>
      <Form onSubmit={onSubmit}>
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
          id="email"
          label="Email: "
          type="email"
          name="email"
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
        <input type="submit" />
      </Form>
    </section>
  );
};

export const CreateUser: React.FunctionComponent = () => {
  const handleCreateUser = async () => {
    // TODO: Use urql hook
  };
  return <CreateUserForm handleCreateUser={handleCreateUser} />;
};

export default CreateUser;
