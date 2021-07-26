import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  CreateCmoAssetInput,
  useCreateCmoAssetMutation,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Input from "../form/Input";
import Submit from "../form/Submit";
import TextArea from "../form/TextArea";

const messages = defineMessages({
  headingTitle: {
    id: "createCmoAsset.headingTitle",
    defaultMessage: "Create CMO Asset",
    description: "Title displayed on the Create a CMO Asset form.",
  },
  keyLabel: {
    id: "createCmoAsset.field.keyLabel",
    defaultMessage: "Key: ",
    description: "Label displayed on the Create a CMO Asset form Key field.",
  },
  nameEnLabel: {
    id: "createCmoAsset.field.nameEnLabel",
    defaultMessage: "Name EN: ",
    description:
      "Label displayed on the Create a CMO Asset form Name (English) field.",
  },
  nameFrLabel: {
    id: "createCmoAsset.field.nameFrLabel",
    defaultMessage: "Name FR: ",
    description:
      "Label displayed on the Create a CMO Asset form Name (French) field.",
  },
  descriptionEnLabel: {
    id: "createCmoAsset.field.descriptionEnLabel",
    defaultMessage: "Description EN: ",
    description:
      "Label displayed on the Create a CMO Asset form Description (English) field.",
  },
  descriptionFrLabel: {
    id: "createCmoAsset.field.descriptionFrLabel",
    defaultMessage: "Description FR: ",
    description:
      "Label displayed on the Create a CMO Asset form Description (French) field.",
  },
});

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
          // TODO: Navigate to cmo asset dashboard
        })
        .catch(() => {
          // Something went wrong with handleCreateCmoAsset.
          // Do nothing.
        });
    };
    return (
      <section>
        <h2>{intl.formatMessage(messages.headingTitle)}</h2>
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
