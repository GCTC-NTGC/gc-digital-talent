import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Input, Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { Heading } from "@gc-digital-talent/ui";
import { errorMessages } from "@gc-digital-talent/i18n";

import {
  UpdateUserSubInput,
  UpdateUserSubMutation,
  User,
} from "~/api/generated";

type FormValues = {
  sub: string;
};

interface UpdateUserSubFormProps {
  user: User;
  onUpdateSub: (
    submitData: UpdateUserSubInput,
  ) => Promise<UpdateUserSubMutation["updateUserSub"]>;
}

const UpdateUserSubForm = ({ user, onUpdateSub }: UpdateUserSubFormProps) => {
  const intl = useIntl();

  const methods = useForm<FormValues>({
    defaultValues: {
      sub: user?.authInfo?.sub ?? undefined,
    },
  });

  const { handleSubmit } = methods;

  const handleUpdateSub = async (formValues: FormValues) => {
    return onUpdateSub({
      userId: user.id,
      sub: formValues.sub,
    }).then(() => {
      toast.success(
        intl.formatMessage({
          defaultMessage: "Subject updated successfully!",
          id: "GOCEuh",
          description:
            "Message displayed to user when subject field has been updated successfully.",
        }),
      );
    });
  };

  return (
    <section data-h2-container="base(left, s)">
      <Heading level="h3" size="h4" data-h2-margin-bottom="base(x1)">
        {intl.formatMessage({
          defaultMessage: "Update subject",
          id: "NuT+Rx",
          description: "Heading label for update a user's subject form",
        })}
      </Heading>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleUpdateSub)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
        >
          <Input
            id="sub"
            label={intl.formatMessage({
              defaultMessage: "Subject",
              id: "m4rXNt",
              description: "Label displayed on the user form subject field.",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            type="text"
            name="sub"
            context={intl.formatMessage({
              defaultMessage:
                "The 'subject' is a string that uniquely identifies a user's sign in identity.",
              id: "WLcP98",
              description:
                "Additional context describing the purpose of the users's 'subject' field.",
            })}
          />
          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default UpdateUserSubForm;
