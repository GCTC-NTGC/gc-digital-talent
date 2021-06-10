import { gql, useMutation } from "@apollo/client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import errorMessages from "./form/errorMessages";
import Input from "./form/Input";
import Select from "./form/Select";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  preferredLang: "en" | "fr";
}

interface CreateUserFormProps {
  handleCreateUser: (data: User) => Promise<void>;
}

export const CreateUserForm: React.FunctionComponent<CreateUserFormProps> = ({
  handleCreateUser,
}) => {
  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    preferredLang: "en" | "fr";
  }

  const { handleSubmit, control } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const { firstName, lastName, email, telephone, preferredLang } = data;
    await handleCreateUser({
      firstName,
      lastName,
      email,
      telephone,
      preferredLang,
    });
  };

  return (
    <section>
      <h2>Create a User</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="First Name: "
          type="text"
          control={control}
          name="firstName"
          rules={{ required: true }}
          ruleMessages={{
            required: errorMessages.required,
          }}
        />
        <Input
          label="Last Name: "
          type="text"
          control={control}
          name="lastName"
          rules={{ required: true }}
          ruleMessages={{
            required: errorMessages.required,
          }}
        />
        <Input
          label="Email: "
          type="email"
          control={control}
          name="email"
          rules={{ required: true }}
          ruleMessages={{
            required: errorMessages.required,
          }}
        />
        <Input
          label="Telephone: "
          type="tel"
          control={control}
          name="telephone"
          rules={{
            required: true,
            pattern: /^\+[1-9]\d{1,14}$/,
          }}
          ruleMessages={{
            required: errorMessages.required,
            pattern: errorMessages.telephone,
          }}
        />
        <Select
          label="Preferred Language: "
          control={control}
          name="preferredLang"
          rules={{ required: true }}
          ruleMessages={{
            required: errorMessages.required,
          }}
          options={[
            { value: "", text: "Select a language..." },
            { value: "en", text: "English" },
            { value: "fr", text: "French" },
          ]}
        />
        <input type="submit" />
      </form>
    </section>
  );
};

const CREATE_USER = gql`
  mutation createUser($user: User!) {
    createUser(user: $user) {
      firstName
      lastName
      email
      telephone
      preferredLang
    }
  }
`;

const CreateUser: React.FunctionComponent = (props) => {
  const [createUser] = useMutation<{ createUser: User }>(CREATE_USER);

  const handleCreateUser = async (data: User) => {
    await createUser({ variables: { ...data } });
  };

  return <CreateUserForm handleCreateUser={handleCreateUser} />;
};

export default CreateUser;
