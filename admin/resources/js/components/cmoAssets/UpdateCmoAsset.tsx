import { pick } from "lodash";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  CmoAsset,
  UpdateCmoAssetInput,
  useGetCmoAssetQuery,
  useUpdateCmoAssetMutation,
} from "../../api/generated";
import errorMessages from "../form/errorMessages";
import Input from "../form/Input";
import Submit from "../form/Submit";
import TextArea from "../form/TextArea";
import commonMessages from "../commonMessages";

const messages = defineMessages({
  headingTitle: {
    id: "updateCmoAsset.headingTitle",
    defaultMessage: "Update CMO Asset",
    description: "Title displayed on the Update a CMO Asset form.",
  },
  keyLabel: {
    id: "updateCmoAsset.field.keyLabel",
    defaultMessage: "Key: ",
    description: "Label displayed on the Update a CMO Asset form Key field.",
  },
  nameEnLabel: {
    id: "updateCmoAsset.field.nameEnLabel",
    defaultMessage: "Name EN: ",
    description:
      "Label displayed on the Update a CMO Asset form Name (English) field.",
  },
  nameFrLabel: {
    id: "updateCmoAsset.field.nameFrLabel",
    defaultMessage: "Name FR: ",
    description:
      "Label displayed on the Update a CMO Asset form Name (French) field.",
  },
  descriptionEnLabel: {
    id: "updateCmoAsset.field.descriptionEnLabel",
    defaultMessage: "Description EN: ",
    description:
      "Label displayed on the Update a CMO Asset form Description (English) field.",
  },
  descriptionFrLabel: {
    id: "updateCmoAsset.field.descriptionFrLabel",
    defaultMessage: "Description FR: ",
    description:
      "Label displayed on the Update a CMO Asset form Description (French) field.",
  },
  cmoAssetNotFound: {
    id: "updateCmoAsset.cmoAssetNotFound",
    defaultMessage: "CMO Asset {cmoAssetId} not found.",
    description: "Message displayed for CMO Asset not found.",
  },
});

type FormValues = UpdateCmoAssetInput;
interface UpdateCmoAssetFormProps {
  initialCmoAsset: CmoAsset;
  handleUpdateCmoAsset: (id: string, data: FormValues) => Promise<FormValues>;
}

export const UpdateCmoAssetForm: React.FunctionComponent<UpdateCmoAssetFormProps> =
  ({ initialCmoAsset, handleUpdateCmoAsset }) => {
    const intl = useIntl();
    const methods = useForm<FormValues>({ defaultValues: initialCmoAsset });
    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      return handleUpdateCmoAsset(initialCmoAsset.id, data)
        .then(() => {
          // TODO: Navigate to cmo asset dashboard
        })
        .catch(() => {
          // Something went wrong with handleUpdateCmoAsset.
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

export const UpdateCmoAsset: React.FunctionComponent<{ cmoAssetId: string }> =
  ({ cmoAssetId }) => {
    const intl = useIntl();
    const [{ data: cmoAssetData, fetching, error }] = useGetCmoAssetQuery({
      variables: { id: cmoAssetId },
    });
    const [, executeMutation] = useUpdateCmoAssetMutation();
    const handleUpdateCmoAsset = (id: string, data: UpdateCmoAssetInput) =>
      executeMutation({
        id,
        cmoAsset: pick(data, [
          "key",
          "name.en",
          "name.fr",
          "description.en",
          "description.fr",
        ]),
      }).then((result) => {
        if (result.data?.updateCmoAsset) {
          return result.data?.updateCmoAsset;
        }
        return Promise.reject(result.error);
      });

    if (fetching)
      return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
    if (error)
      return (
        <p>
          {intl.formatMessage(commonMessages.loadingError)} {error.message}
        </p>
      );
    return cmoAssetData?.cmoAsset ? (
      <UpdateCmoAssetForm
        initialCmoAsset={cmoAssetData.cmoAsset}
        handleUpdateCmoAsset={handleUpdateCmoAsset}
      />
    ) : (
      <p>{intl.formatMessage(messages.cmoAssetNotFound, { cmoAssetId })}</p>
    );
  };
