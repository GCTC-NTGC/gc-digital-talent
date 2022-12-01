import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import pick from "lodash/pick";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { toast } from "@common/components/Toast";
import { Input, Submit, TextArea } from "@common/components/form";
import { errorMessages, commonMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import Heading from "@common/components/Heading/Heading";

import { useAdminRoutes } from "../../adminRoutes";
import {
  CmoAsset,
  Scalars,
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
  const navigate = useNavigate();
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
            id: "Kdfiu3",
            description:
              "Message displayed to user after cmo asset is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating cmo asset failed",
            id: "+e8VZ8",
            description:
              "Message displayed to user after cmo asset fails to get updated.",
          }),
        );
      });
  };
  return (
    <section data-h2-container="base(left, s)">
      <Heading level="h1" size="h2">
        {intl.formatMessage({
          defaultMessage: "Update CMO Asset",
          id: "5JRGJY",
          description: "Title displayed on the update a cmo asset form.",
        })}
      </Heading>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                id: "U6V+uR",
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
                id: "pHVKt/",
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
                id: "zgaPwN",
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
                id: "oVWttp",
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

type RouteParams = {
  cmoAssetId: Scalars["ID"];
};

const UpdateCmoAsset = () => {
  const intl = useIntl();
  const { cmoAssetId } = useParams<RouteParams>();
  const [{ data: cmoAssetData, fetching, error }] = useGetCmoAssetQuery({
    variables: { id: cmoAssetId || "" },
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

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        {cmoAssetData?.cmoAsset ? (
          <UpdateCmoAssetForm
            initialCmoAsset={cmoAssetData.cmoAsset}
            handleUpdateCmoAsset={handleUpdateCmoAsset}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "CMO Asset {cmoAssetId} not found.",
                  id: "rE/ytf",
                  description: "Message displayed for cmo asset not found.",
                },
                { cmoAssetId },
              )}
            </p>
          </NotFound>
        )}
      </DashboardContentContainer>
    </Pending>
  );
};

export default UpdateCmoAsset;
