import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import { toast } from "react-toastify";
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
import { navigate } from "../../helpers/router";
import { userTable } from "../../helpers/routes";
import { getLocale } from "../../helpers/localize";
import messages from "./messages";
import { enumToOptions } from "../form/formUtils";
import { getLanguage } from "../../model/localizedConstants";

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
  const locale = getLocale(intl);
  const methods = useForm<FormValues>({ defaultValues: initialUser });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateUser(initialUser.id, data)
      .then(() => {
        navigate(userTable(locale));
        toast.success(intl.formatMessage(messages.updateSuccess));
      })
      .catch(() => {
        toast.error(intl.formatMessage(messages.updateError));
      });
  };

  return (
    <section>
      <h2>{intl.formatMessage(messages.updateHeading)}</h2>
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
