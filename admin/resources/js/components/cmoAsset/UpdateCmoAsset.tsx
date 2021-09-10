import { pick } from "lodash";
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
import {
  errorMessages,
  commonMessages,
} from "gc-digital-talent-common/messages";
import {
  CmoAsset,
  UpdateCmoAssetInput,
  useGetCmoAssetQuery,
  useUpdateCmoAssetMutation,
} from "../../api/generated";
import messages from "./messages";

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
          navigate(cmoAssetTablePath());
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
      <p>{intl.formatMessage(messages.notFound, { cmoAssetId })}</p>
    );
  };
