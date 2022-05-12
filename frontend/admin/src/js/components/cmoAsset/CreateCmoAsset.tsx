import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input, Submit, TextArea } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { errorMessages } from "@common/messages";
import { keyStringRegex } from "@common/constants/regularExpressions";
import { useAdminRoutes } from "../../adminRoutes";
import {
  CreateCmoAssetInput,
  useCreateCmoAssetMutation,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = CreateCmoAssetInput;
interface CreateCmoAssetFormProps {
  handleCreateCmoAsset: (data: FormValues) => Promise<FormValues>;
}

export const CreateCmoAssetForm: React.FunctionComponent<
  CreateCmoAssetFormProps
> = ({ handleCreateCmoAsset }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateCmoAsset(data)
      .then(() => {
        navigate(paths.cmoAssetTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "CMO Asset created successfully!",
            description:
              "Message displayed to user after cmo asset is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating cmo asset failed",
            description:
              "Message displayed to user after cmo asset fails to get created.",
          }),
        );
      });
  };
  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Create CMO Asset",
          description: "Title displayed on the create a cmo asset form.",
        })}
      </h2>
      <div data-h2-container="b(center, s)">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="key"
              name="key"
              label={intl.formatMessage({
                defaultMessage: "Key",
                description:
                  "Label displayed on the create a cmo asset form key field.",
              })}
              context={intl.formatMessage({
                defaultMessage:
                  "The 'key' is a string that uniquely identifies a CMO Asset. It should be based on the CMO Asset's English name, and it should be concise. A good example would be \"information_management\". It may be used in the code to refer to this particular CMO Asset, so it cannot be changed later.",
                description:
                  "Additional context describing the purpose of the CMO Asset's 'key' field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                pattern: {
                  value: keyStringRegex,
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

export const CreateCmoAsset: React.FunctionComponent = () => {
  const [, executeMutation] = useCreateCmoAssetMutation();
  const handleCreateCmoAsset = (data: CreateCmoAssetInput) =>
    executeMutation({ cmoAsset: data }).then((result) => {
      if (result.data?.createCmoAsset) {
        return result.data?.createCmoAsset;
      }
      return Promise.reject(result.error);
    });

  return (
    <DashboardContentContainer>
      <CreateCmoAssetForm handleCreateCmoAsset={handleCreateCmoAsset} />
    </DashboardContentContainer>
  );
};
