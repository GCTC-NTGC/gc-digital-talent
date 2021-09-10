import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { Input, Submit, TextArea } from "gc-digital-talent-common/components";
import {
  navigate,
  operationalRequirementTablePath,
} from "gc-digital-talent-common/helpers";
import { errorMessages } from "gc-digital-talent-common/messages";
import {
  CreateOperationalRequirementInput,
  useCreateOperationalRequirementMutation,
} from "../../api/generated";
import messages from "./messages";
import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = CreateOperationalRequirementInput;
interface CreateOperationalRequirementFormProps {
  handleCreateOperationalRequirement: (data: FormValues) => Promise<FormValues>;
}

export const CreateOperationalRequirementForm: React.FunctionComponent<CreateOperationalRequirementFormProps> =
  ({ handleCreateOperationalRequirement }) => {
    const intl = useIntl();
    const methods = useForm<FormValues>();
    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      return handleCreateOperationalRequirement(data)
        .then(() => {
          navigate(operationalRequirementTablePath());
          toast.success(intl.formatMessage(messages.createSuccess));
        })
        .catch(() => {
          toast.error(intl.formatMessage(messages.createError));
        });
    };
    return (
      <section>
        <h2>{intl.formatMessage(messages.createHeading)}</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="key"
              name="key"
              label={intl.formatMessage(messages.keyLabel)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage(messages.nameLabelEn)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage(messages.nameLabelFr)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <TextArea
              id="description_en"
              name="description.en"
              label={intl.formatMessage(messages.descriptionLabelEn)}
              rules={{ required: errorMessages.required }}
            />
            <TextArea
              id="description_fr"
              name="description.fr"
              label={intl.formatMessage(messages.descriptionLabelFr)}
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
    <DashboardContentContainer>
      <CreateOperationalRequirementForm
        handleCreateOperationalRequirement={handleCreateOperationalRequirement}
      />
    </DashboardContentContainer>
  );
};
