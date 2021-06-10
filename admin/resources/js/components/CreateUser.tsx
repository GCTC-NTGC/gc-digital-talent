import { gql, MutationFunctionOptions, useMutation } from "@apollo/client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import errorMessages from "./form/errorMessages";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const { firstName, lastName, email, telephone, preferredLang } = data;
    await handleCreateUser({
      firstName,
      lastName,
      email,
      telephone,
      preferredLang,
    });
    console.log(data);
  };

  return (
    // TODO: Remove duplicate code with Input controller, while still maintaining UX experience.
    <section>
      <h2>Create a User</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">First Name: </label>
          <input
            id="firstName"
            type="text"
            aria-invalid={errors.firstName ? "true" : "false"}
            {...register("firstName", { required: errorMessages.required })}
          />
          {errors.firstName && (
            <span role="alert">{errors.firstName.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="lastName">Last Name: </label>
          <input
            id="lastName"
            type="text"
            aria-invalid={errors.lastName ? "true" : "false"}
            {...register("lastName", { required: errorMessages.required })}
          />
          {errors.lastName && (
            <span role="alert">{errors.lastName.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="email"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email", { required: errorMessages.required })}
          />
          {errors.email && <span role="alert">{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="telephone">Telephone: </label>
          <input
            id="telephone"
            type="tel"
            aria-invalid={errors.telephone ? "true" : "false"}
            {...register("telephone", {
              required: true,
              pattern: /^\\+[1-9]\\d{1,14}$/,
            })}
          />
          {errors.telephone?.type === "required" && (
            <span role="alert">{errorMessages.required}</span>
          )}
          {errors.telephone?.type === "pattern" && (
            <span role="alert">{errorMessages.telephone}</span>
          )}
        </div>
        <div>
          <label htmlFor="preferredLang">Preferred Language: </label>
          <select
            id="preferredLang"
            aria-invalid={errors.preferredLang ? "true" : "false"}
            {...register("preferredLang", { required: errorMessages.required })}
          >
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
          {errors.preferredLang && (
            <span role="alert">{errors.preferredLang.message}</span>
          )}
        </div>
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

interface CreateUserProps {}

const CreateUser: React.FunctionComponent<CreateUserProps> = (props) => {
  const [createUser] = useMutation<{ createUser: User }>(CREATE_USER);

  const handleCreateUser = async (data: User) => {
    await createUser({ variables: { ...data } });
  };

  return <CreateUserForm handleCreateUser={handleCreateUser} />;
};

export default CreateUser;
