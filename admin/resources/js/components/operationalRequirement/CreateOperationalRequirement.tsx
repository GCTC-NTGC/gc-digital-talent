import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { Input, Submit, TextArea } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { errorMessages } from "@common/messages";
import { operationalRequirementTablePath } from "../../adminRoutes";
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
        <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
          {intl.formatMessage(messages.createHeading)}
        </h2>
        <div data-h2-container="b(center, s)">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="key"
                name="key"
                label={intl.formatMessage(messages.keyLabel)}
                context={intl.formatMessage({
                  defaultMessage:
                    "The 'key' is a string that uniquely identifies an Operational Requirement. It should be based on the Operational Requirement's English name, and it should be concise. A good example would be \"shift_work\". It may be used in the code to refer to this particular Operational Requirement, so it cannot be changed later.",
                  description:
                    "Additional context describing the purpose of the Operational Requirement's 'key' field.",
                })}
                type="text"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                  pattern: {
                    value: /^[a-z]+(_[a-z]+)*$/,
                    message: intl.formatMessage({
                      defaultMessage:
                        "Please use only lowercase letters and underscores.",
                    }),
                  },
                }}
              />
              <Input
                id="name_en"
                name="name.en"
                label={intl.formatMessage(messages.nameLabelEn)}
                type="text"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
              <Input
                id="name_fr"
                name="name.fr"
                label={intl.formatMessage(messages.nameLabelFr)}
                type="text"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
              <TextArea
                id="description_en"
                name="description.en"
                label={intl.formatMessage(messages.descriptionLabelEn)}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
              <TextArea
                id="description_fr"
                name="description.fr"
                label={intl.formatMessage(messages.descriptionLabelFr)}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
              <Submit />
            </form>
          </FormProvider>
        </div>
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
