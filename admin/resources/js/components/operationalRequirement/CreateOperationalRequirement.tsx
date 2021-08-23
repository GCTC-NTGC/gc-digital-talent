import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  CreateOperationalRequirementInput,
  useCreateOperationalRequirementMutation,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Input from "../form/Input";
import Submit from "../form/Submit";
import TextArea from "../form/TextArea";

type FormValues = CreateOperationalRequirementInput;
interface CreateOperationalRequirementFormProps {
  handleCreateOperationalRequirement: (data: FormValues) => Promise<FormValues>;
}

export const CreateOperationalRequirementForm: React.FunctionComponent<CreateOperationalRequirementFormProps> =
  ({ handleCreateOperationalRequirement }) => {
    const methods = useForm<FormValues>();
    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      return handleCreateOperationalRequirement(data)
        .then(() => {
          // TODO: Navigate to cmo asset dashboard
        })
        .catch(() => {
          // Something went wrong with handleCreateOperationalRequirement.
          // Do nothing.
        });
    };
    return (
      <section>
        <h2>Create Operational Requirement</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="key"
              name="key"
              label="Key: "
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="name_en"
              name="name.en"
              label="Name: "
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label="Name FR: "
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <TextArea
              id="description_en"
              name="description.en"
              label="Description: "
              rules={{ required: errorMessages.required }}
            />
            <TextArea
              id="description_fr"
              name="description.fr"
              label="Description FR: "
              rules={{ required: errorMessages.required }}
            />
            <Submit />
          </form>
        </FormProvider>
      </section>
    );
  };

export const CreateOperationalRequirement: React.FunctionComponent = () => {
  const [_result, executeMutation] = useCreateOperationalRequirementMutation();
  const handleCreateOperationalRequirement = (
    data: CreateOperationalRequirementInput,
  ) =>
    executeMutation({ operationalRequirement: data }).then((result) => {
      if (result.data?.createOperationalRequirement) {
        return result.data?.createOperationalRequirement;
      }
      return Promise.reject(result.error);
    });

  return (
    <CreateOperationalRequirementForm
      handleCreateOperationalRequirement={handleCreateOperationalRequirement}
    />
  );
};
