import { pick } from "lodash";
import * as React from "react";
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

type FormValues = UpdateCmoAssetInput;
interface UpdateCmoAssetFormProps {
  initialCmoAsset: CmoAsset;
  handleUpdateCmoAsset: (id: string, data: FormValues) => Promise<FormValues>;
}

export const UpdateCmoAssetForm: React.FunctionComponent<UpdateCmoAssetFormProps> =
  ({ initialCmoAsset, handleUpdateCmoAsset }) => {
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
        <h2>Update CMO Asset</h2>
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

export const UpdateCmoAsset: React.FunctionComponent<{ cmoAssetId: string }> =
  ({ cmoAssetId }) => {
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

    if (fetching) return <p>Loading...</p>;
    if (error) return <p>Oh no... {error.message}</p>;
    return cmoAssetData?.cmoAsset ? (
      <UpdateCmoAssetForm
        initialCmoAsset={cmoAssetData.cmoAsset}
        handleUpdateCmoAsset={handleUpdateCmoAsset}
      />
    ) : (
      <p>{`CMO Asset ${cmoAssetId} not found.`}</p>
    );
  };
