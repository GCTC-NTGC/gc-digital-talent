import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import pick from "lodash/pick";
import { toast } from "react-toastify";
import { Select, Submit, Input } from "gc-digital-talent-common/components";
import {
  navigate,
  enumToOptions,
  userTablePath,
} from "gc-digital-talent-common/helpers";
import {
  errorMessages,
  commonMessages,
} from "gc-digital-talent-common/messages";
import { getLanguage } from "gc-digital-talent-common/constants";
import {
  Language,
  UpdateUserInput,
  User,
  useUpdateUserMutation,
  useUserQuery,
} from "../../api/generated";
import messages from "./messages";
import DashboardContentContainer from "../DashboardContentContainer";

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
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateUser(initialUser.id, data)
      .then(() => {
        navigate(userTablePath());
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

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)} {error.message}
        </p>
      </DashboardContentContainer>
    );
  return userData?.user ? (
    <DashboardContentContainer>
      <UpdateUserForm
        initialUser={userData?.user}
        handleUpdateUser={handleUpdateUser}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>{intl.formatMessage(messages.userNotFound, { userId })}</p>
    </DashboardContentContainer>
  );
};

export default UpdateUser;
