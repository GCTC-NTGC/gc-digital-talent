import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { Input, Submit, TextArea } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { errorMessages } from "@common/messages";
import { keyStringRegex } from "@common/constants/regularExpressions";
import { useAdminRoutes } from "../../adminRoutes";
import {
  CreateOperationalRequirementInput,
  useCreateOperationalRequirementMutation,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = CreateOperationalRequirementInput;
interface CreateOperationalRequirementFormProps {
  handleCreateOperationalRequirement: (data: FormValues) => Promise<FormValues>;
}

export const CreateOperationalRequirementForm: React.FunctionComponent<
  CreateOperationalRequirementFormProps
> = ({ handleCreateOperationalRequirement }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateOperationalRequirement(data)
      .then(() => {
        navigate(paths.operationalRequirementTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Operational Requirement created successfully!",
            description:
              "Message displayed to user after operational requirement is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating operational requirement failed",
            description:
              "Message displayed to user after operational requirement fails to get created.",
          }),
        );
      });
  };
  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Create Operational Requirement",
          description:
            "Title displayed on the create a operational requirement form.",
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
                  "Label displayed on the operational requirement form key field.",
              })}
              context={intl.formatMessage({
                defaultMessage:
                  "The 'key' is a string that uniquely identifies an Operational Requirement. It should be based on the Operational Requirement's English name, and it should be concise. A good example would be \"shift_work\". It may be used in the code to refer to this particular Operational Requirement, so it cannot be changed later.",
                description:
                  "Additional context describing the purpose of the Operational Requirement's 'key' field.",
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

export const CreateOperationalRequirement: React.FunctionComponent = () => {
  const [, executeMutation] = useCreateOperationalRequirementMutation();
  const handleCreateOperationalRequirement = (
    data: CreateOperationalRequirementInput,
  ) =>
    executeMutation({ operationalRequirement: data }).then((result) => {
      if (result.data?.createOperationalRequirement) {
        return result.data?.createOperationalRequirement;
      }
      return Promise.reject(result.error);
    });

  return (
    <DashboardContentContainer>
      <CreateOperationalRequirementForm
        handleCreateOperationalRequirement={handleCreateOperationalRequirement}
      />
    </DashboardContentContainer>
  );
};
