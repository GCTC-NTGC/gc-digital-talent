import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Input, Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { Heading } from "@gc-digital-talent/ui";
import { errorMessages } from "@gc-digital-talent/i18n";
import {
  UpdateUserSubInput,
  UpdateUserSubMutation,
  UserAuthInfo,
} from "@gc-digital-talent/graphql";

interface FormValues {
  sub: string;
}

interface UpdateUserSubFormProps {
  authInfo: UserAuthInfo | undefined | null;
  onUpdateSub: (
    submitData: UpdateUserSubInput,
  ) => Promise<UpdateUserSubMutation["updateUserSub"]>;
}

const UpdateUserSubForm = ({
  authInfo,
  onUpdateSub,
}: UpdateUserSubFormProps) => {
  const intl = useIntl();

  const methods = useForm<FormValues>({
    defaultValues: {
      sub: authInfo?.sub ?? undefined,
    },
  });

  const { handleSubmit } = methods;

  const handleUpdateSub = async (formValues: FormValues) => {
    return onUpdateSub({
      userId: authInfo?.id ?? "",
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
    <section className="max-w-2xl">
      <Heading level="h3" size="h4">
        {intl.formatMessage({
          defaultMessage: "Update subject",
          id: "NuT+Rx",
          description: "Heading label for update a user's subject form",
        })}
      </Heading>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleUpdateSub)}
          className="flex flex-col gap-y-6"
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
          <div className="self-start">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default UpdateUserSubForm;
