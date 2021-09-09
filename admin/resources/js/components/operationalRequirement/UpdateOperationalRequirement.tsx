import { pick } from "lodash";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  Input,
  Submit,
  TextArea,
} from "gc-digital-talent-common/lib/components";
import {
  navigate,
  operationalRequirementTablePath,
} from "gc-digital-talent-common/lib/helpers";
import {
  errorMessages,
  commonMessages,
} from "gc-digital-talent-common/lib/messages";
import {
  OperationalRequirement,
  UpdateOperationalRequirementInput,
  useGetOperationalRequirementQuery,
  useUpdateOperationalRequirementMutation,
} from "../../api/generated";
import messages from "./messages";

type FormValues = UpdateOperationalRequirementInput;
interface UpdateOperationalRequirementFormProps {
  initialOperationalRequirement: OperationalRequirement;
  handleUpdateOperationalRequirement: (
    id: string,
    data: FormValues,
  ) => Promise<FormValues>;
}

export const UpdateOperationalRequirementForm: React.FunctionComponent<UpdateOperationalRequirementFormProps> =
  ({ initialOperationalRequirement, handleUpdateOperationalRequirement }) => {
    const intl = useIntl();
    const methods = useForm<FormValues>({
      defaultValues: initialOperationalRequirement,
    });
    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      return handleUpdateOperationalRequirement(
        initialOperationalRequirement.id,
        data,
      )
        .then(() => {
          navigate(operationalRequirementTablePath());
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

export const UpdateOperationalRequirement: React.FunctionComponent<{
  operationalRequirementId: string;
}> = ({ operationalRequirementId }) => {
  const intl = useIntl();
  const [{ data: operationalRequirementData, fetching, error }] =
    useGetOperationalRequirementQuery({
      variables: { id: operationalRequirementId },
    });
  const [, executeMutation] = useUpdateOperationalRequirementMutation();
  const handleUpdateOperationalRequirement = (
    id: string,
    data: UpdateOperationalRequirementInput,
  ) =>
    executeMutation({
      id,
      operationalRequirement: pick(data, [
        "key",
        "name.en",
        "name.fr",
        "description.en",
        "description.fr",
      ]),
    }).then((result) => {
      if (result.data?.updateOperationalRequirement) {
        return result.data?.updateOperationalRequirement;
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
  return operationalRequirementData?.operationalRequirement ? (
    <UpdateOperationalRequirementForm
      initialOperationalRequirement={
        operationalRequirementData.operationalRequirement
      }
      handleUpdateOperationalRequirement={handleUpdateOperationalRequirement}
    />
  ) : (
    <p>
      {intl.formatMessage(messages.operationalRequirementNotFound, {
        operationalRequirementId,
      })}
    </p>
  );
};
