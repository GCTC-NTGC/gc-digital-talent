import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Input } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  UpdateUserSubInput,
  UpdateUserSubMutation,
} from "@gc-digital-talent/graphql";

import { User } from "~/api/generated";

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
          defaultMessage: "Sub updated successfully",
          id: "SqduJp",
          description:
            "Message displayed to user when sub field has been updated.",
        }),
      );
    });
  };

  return (
    <section>
      <p>SPACE</p>
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
        </form>
      </FormProvider>
    </section>
  );
};

export default UpdateUserSubForm;
