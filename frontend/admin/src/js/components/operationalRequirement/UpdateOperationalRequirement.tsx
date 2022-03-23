import pick from "lodash/pick";
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Input, Submit, TextArea } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { errorMessages, commonMessages } from "@common/messages";
import { useAdminRoutes } from "../../adminRoutes";
import {
  OperationalRequirement,
  UpdateOperationalRequirementInput,
  useGetOperationalRequirementQuery,
  useUpdateOperationalRequirementMutation,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = UpdateOperationalRequirementInput;
interface UpdateOperationalRequirementFormProps {
  initialOperationalRequirement: OperationalRequirement;
  handleUpdateOperationalRequirement: (
    id: string,
    data: FormValues,
  ) => Promise<FormValues>;
}

export const UpdateOperationalRequirementForm: React.FunctionComponent<
  UpdateOperationalRequirementFormProps
> = ({ initialOperationalRequirement, handleUpdateOperationalRequirement }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
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
        navigate(paths.operationalRequirementTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Operational Requirement updated successfully!",
            description:
              "Message displayed to user after operational requirement is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating operational requirement failed",
            description:
              "Message displayed to user after operational requirement fails to get updated.",
          }),
        );
      });
  };
  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Update Operational Requirement",
          description:
            "Title displayed on the update a operational requirement form.",
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
                  "Label displayed on the operational requirement form name (English) field.",
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
                  "Label displayed on the operational requirement form name (French) field.",
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
                  "Label displayed on the operational requirement form description (English) field.",
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
                  "Label displayed on the operational requirement form description (French) field.",
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
  return operationalRequirementData?.operationalRequirement ? (
    <DashboardContentContainer>
      <UpdateOperationalRequirementForm
        initialOperationalRequirement={
          operationalRequirementData.operationalRequirement
        }
        handleUpdateOperationalRequirement={handleUpdateOperationalRequirement}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Operational Requirement {operationalRequirementId} not found.",
            description:
              "Message displayed for operational requirement not found.",
          },
          {
            operationalRequirementId,
          },
        )}
      </p>
    </DashboardContentContainer>
  );
};
