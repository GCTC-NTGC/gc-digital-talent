import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input, Select, Submit } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLanguage } from "@common/constants/localizedConstants";
import { userTablePath } from "../../adminRoutes";
import {
  Language,
  CreateUserInput,
  CreateUserMutation,
  useCreateUserMutation,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

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
        toast.success(
          intl.formatMessage({
            defaultMessage: "User created successfully!",
            description:
              "Message displayed to user after user is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating user failed",
            description:
              "Message displayed to user after user fails to get created.",
          }),
        );
      });
  };

  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Create User",
          description: "Title displayed on the create a user form.",
        })}
      </h2>
      <div data-h2-container="b(center, s)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="email"
              label={intl.formatMessage({
                defaultMessage: "Email:",
                description: "Label displayed on the user form email field.",
              })}
              type="text"
              name="email"
              rules={{
                required: intl.formatMessage({
                  defaultMessage: "This field is required.",
                  description:
                    "Error message that this field must filled for the form to be valid.",
                }),
              }}
            />
            <Input
              id="firstName"
              label={intl.formatMessage({
                defaultMessage: "First Name:",
                description:
                  "Label displayed on the user form first name field.",
              })}
              type="text"
              name="firstName"
              rules={{
                required: intl.formatMessage({
                  defaultMessage: "This field is required.",
                  description:
                    "Error message that this field must filled for the form to be valid.",
                }),
              }}
            />
            <Input
              id="lastName"
              label={intl.formatMessage({
                defaultMessage: "Last Name:",
                description:
                  "Label displayed on the user form last name field.",
              })}
              type="text"
              name="lastName"
              rules={{
                required: intl.formatMessage({
                  defaultMessage: "This field is required.",
                  description:
                    "Error message that this field must filled for the form to be valid.",
                }),
              }}
            />
            <Input
              id="telephone"
              label={intl.formatMessage({
                defaultMessage: "Telephone:",
                description:
                  "Label displayed on the user form telephone field.",
              })}
              type="tel"
              name="telephone"
              rules={{
                required: intl.formatMessage({
                  defaultMessage: "This field is required.",
                  description:
                    "Error message that this field must filled for the form to be valid.",
                }),
                pattern: {
                  value: /^\+[1-9]\d{1,14}$/,
                  message: intl.formatMessage({
                    defaultMessage:
                      "This field must follow the pattern +123243234.",
                    description:
                      "Error message that the field must contain a phone number validated by the specified pattern.",
                  }),
                },
              }}
            />
            <Select
              id="preferredLang"
              label={intl.formatMessage({
                defaultMessage: "Preferred Language:",
                description:
                  "Label displayed on the user form preferred language field.",
              })}
              name="preferredLang"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a language...",
                description:
                  "Placeholder displayed on the user form preferred language field.",
              })}
              rules={{
                required: intl.formatMessage({
                  defaultMessage: "This field is required.",
                  description:
                    "Error message that this field must filled for the form to be valid.",
                }),
              }}
              options={enumToOptions(Language).map(({ value }) => ({
                value,
                label: intl.formatMessage(getLanguage(value)),
              }))}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
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
    <DashboardContentContainer>
      <CreateUserForm handleCreateUser={handleCreateUser} />
    </DashboardContentContainer>
  );
};
