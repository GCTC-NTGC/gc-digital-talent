import { pick } from "lodash";
import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input, Submit, TextArea } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { errorMessages, commonMessages } from "@common/messages";
import { cmoAssetTablePath } from "../../adminRoutes";
import {
  CmoAsset,
  UpdateCmoAssetInput,
  useGetCmoAssetQuery,
  useUpdateCmoAssetMutation,
} from "../../api/generated";
import messages from "./messages";
import DashboardContentContainer from "../DashboardContentContainer";

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
        <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
          {intl.formatMessage(messages.updateHeading)}
        </h2>
        <div data-h2-container="b(center, s)">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
        </div>
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
            {intl.formatMessage(commonMessages.loadingError)} {error.message}
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
        <p>{intl.formatMessage(messages.notFound, { cmoAssetId })}</p>
      </DashboardContentContainer>
    );
  };
