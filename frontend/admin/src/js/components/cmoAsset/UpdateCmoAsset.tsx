import pick from "lodash/pick";
import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input, Submit, TextArea } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { errorMessages, commonMessages } from "@common/messages";
import { useAdminRoutes } from "../../adminRoutes";
import {
  CmoAsset,
  UpdateCmoAssetInput,
  useGetCmoAssetQuery,
  useUpdateCmoAssetMutation,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = UpdateCmoAssetInput;
interface UpdateCmoAssetFormProps {
  initialCmoAsset: CmoAsset;
  handleUpdateCmoAsset: (id: string, data: FormValues) => Promise<FormValues>;
}

export const UpdateCmoAssetForm: React.FunctionComponent<
  UpdateCmoAssetFormProps
> = ({ initialCmoAsset, handleUpdateCmoAsset }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>({ defaultValues: initialCmoAsset });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleUpdateCmoAsset(initialCmoAsset.id, data)
      .then(() => {
        navigate(paths.cmoAssetTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "CMO Asset updated successfully!",
            description:
              "Message displayed to user after cmo asset is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating cmo asset failed",
            description:
              "Message displayed to user after cmo asset fails to get updated.",
          }),
        );
      });
  };
  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Update CMO Asset",
          description: "Title displayed on the update a cmo asset form.",
        })}
      </h2>
      <div data-h2-container="b(center, s)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                description:
                  "Label displayed on the create a cmo asset form name (English) field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_fr"
              name="name.fr"
              label={intl.formatMessage({
                defaultMessage: "Name (French)",
                description:
                  "Label displayed on the create a cmo asset form name (French) field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="description_en"
              name="description.en"
              label={intl.formatMessage({
                defaultMessage: "Description (English)",
                description:
                  "Label displayed on the create a cmo asset form description (English) field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="description_fr"
              name="description.fr"
              label={intl.formatMessage({
                defaultMessage: "Description (French)",
                description:
                  "Label displayed on the create a cmo asset form description (French) field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const UpdateCmoAsset: React.FunctionComponent<{
  cmoAssetId: string;
}> = ({ cmoAssetId }) => {
  const intl = useIntl();
  const [{ data: cmoAssetData, fetching, error }] = useGetCmoAssetQuery({
    variables: { id: cmoAssetId },
  });
  const [, executeMutation] = useUpdateCmoAssetMutation();
  const handleUpdateCmoAsset = (id: string, data: UpdateCmoAssetInput) =>
    executeMutation({
      id,
      cmoAsset: pick(data, [
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
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );
  return cmoAssetData?.cmoAsset ? (
    <DashboardContentContainer>
      <UpdateCmoAssetForm
        initialCmoAsset={cmoAssetData.cmoAsset}
        handleUpdateCmoAsset={handleUpdateCmoAsset}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>
        {intl.formatMessage(
          {
            defaultMessage: "CMO Asset {cmoAssetId} not found.",
            description: "Message displayed for cmo asset not found.",
          },
          { cmoAssetId },
        )}
      </p>
    </DashboardContentContainer>
  );
};
