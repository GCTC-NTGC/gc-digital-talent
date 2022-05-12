import upperCase from "lodash/upperCase";
import * as React from "react";
import { toast } from "react-toastify";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Input, Select, Submit } from "@common/components/form";
import { navigate } from "@common/helpers/router";
import { errorMessages } from "@common/messages";
import {
  CreateClassificationInput,
  useCreateClassificationMutation,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";
import { useAdminRoutes } from "../../adminRoutes";

type FormValues = CreateClassificationInput;
interface CreateClassificationFormProps {
  handleCreateClassification: (data: FormValues) => Promise<FormValues>;
}

export const CreateClassificationForm: React.FunctionComponent<
  CreateClassificationFormProps
> = ({ handleCreateClassification }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit, watch } = methods;
  const watchMinSalary = watch("minSalary");

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const classification: FormValues = {
      ...data,
      group: upperCase(data.group),
      level: Number(data.level),
      minSalary: Number(data.minSalary),
      maxSalary: Number(data.maxSalary),
    };
    return handleCreateClassification(classification)
      .then(() => {
        navigate(paths.classificationTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Classification created successfully!",
            description:
              "Message displayed to user after classification is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating classification failed",
            description:
              "Message displayed to user after classification fails to get created.",
          }),
        );
      });
  };
  return (
    <section>
      <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
        {intl.formatMessage({
          defaultMessage: "Create Classification",
          description: "Title displayed on the create a classification form.",
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
                  "Label displayed on the classification form name (English) field.",
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
                  "Label displayed on the classification form name (French) field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="group"
              name="group"
              label={intl.formatMessage({
                defaultMessage: "Group",
                description:
                  "Label displayed for the classification form group field.",
              })}
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Select
              id="level"
              name="level"
              label={intl.formatMessage({
                defaultMessage: "Level",
                description:
                  "Label displayed on the classification form level field.",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a level...",
                description:
                  "Placeholder displayed on the classification form level field.",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={[
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
                { value: 6, label: "6" },
                { value: 7, label: "7" },
                { value: 8, label: "8" },
                { value: 9, label: "9" },
              ]}
            />
            <Input
              id="minSalary"
              name="minSalary"
              label={intl.formatMessage({
                defaultMessage: "Minimum Salary",
                description:
                  "Label displayed for the classification form min salary field.",
              })}
              type="number"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: 0,
                  message: intl.formatMessage(errorMessages.mustBeGreater, {
                    value: 0,
                  }),
                },
              }}
            />
            <Input
              id="maxSalary"
              name="maxSalary"
              label={intl.formatMessage({
                defaultMessage: "Maximum Salary",
                description:
                  "Label displayed for the classification form max salary field.",
              })}
              type="number"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: watchMinSalary || 0,
                  message: intl.formatMessage(errorMessages.mustBeGreater, {
                    value: watchMinSalary || 0,
                  }),
                },
              }}
            />
            <Submit />
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export const CreateClassification: React.FunctionComponent = () => {
  const [, executeMutation] = useCreateClassificationMutation();
  const handleCreateClassification = (data: CreateClassificationInput) =>
    executeMutation({ classification: data }).then((result) => {
      if (result.data?.createClassification) {
        return result.data?.createClassification;
      }
      return Promise.reject(result.error);
    });

  return (
    <DashboardContentContainer>
      <CreateClassificationForm
        handleCreateClassification={handleCreateClassification}
      />
    </DashboardContentContainer>
  );
};
