import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Input,
  Submit,
  TextArea,
} from "gc-digital-talent-common/components";
import {
  navigate,
  cmoAssetTablePath,
} from "gc-digital-talent-common/helpers";
import { errorMessages } from "gc-digital-talent-common/messages";
import {
  CreateCmoAssetInput,
  useCreateCmoAssetMutation,
} from "../../api/generated";
import messages from "./messages";

type FormValues = CreateCmoAssetInput;
interface CreateCmoAssetFormProps {
  handleCreateCmoAsset: (data: FormValues) => Promise<FormValues>;
}

export const CreateCmoAssetForm: React.FunctionComponent<CreateCmoAssetFormProps> =
  ({ handleCreateCmoAsset }) => {
    const intl = useIntl();
    const methods = useForm<FormValues>();
    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      return handleCreateCmoAsset(data)
        .then(() => {
          navigate(cmoAssetTablePath());
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
              label={intl.formatMessage(messages.nameEnLabel)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage(messages.nameFrLabel)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <TextArea
              id="description_en"
              name="description.en"
              label={intl.formatMessage(messages.descriptionEnLabel)}
              rules={{ required: errorMessages.required }}
            />
            <TextArea
              id="description_fr"
              name="description.fr"
              label={intl.formatMessage(messages.descriptionFrLabel)}
              rules={{ required: errorMessages.required }}
            />
            <Submit />
          </form>
        </FormProvider>
      </section>
    );
  };

export const CreateCmoAsset: React.FunctionComponent = () => {
  const [_result, executeMutation] = useCreateCmoAssetMutation();
  const handleCreateCmoAsset = (data: CreateCmoAssetInput) =>
    executeMutation({ cmoAsset: data }).then((result) => {
      if (result.data?.createCmoAsset) {
        return result.data?.createCmoAsset;
      }
      return Promise.reject(result.error);
    });

  return <CreateCmoAssetForm handleCreateCmoAsset={handleCreateCmoAsset} />;
};
