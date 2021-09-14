import { upperCase } from "lodash";
import * as React from "react";
import { toast } from "react-toastify";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Input, Select, Submit } from "@common/components";
import {
  navigate,
  classificationTablePath,
} from "@common/helpers";
import { errorMessages } from "@common/messages";
import {
  CreateClassificationInput,
  useCreateClassificationMutation,
} from "../../api/generated";
import messages from "./messages";
import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = CreateClassificationInput;
interface CreateClassificationFormProps {
  handleCreateClassification: (data: FormValues) => Promise<FormValues>;
}

export const CreateClassificationForm: React.FunctionComponent<CreateClassificationFormProps> =
  ({ handleCreateClassification }) => {
    const intl = useIntl();
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
          navigate(classificationTablePath());
          toast.success(intl.formatMessage(messages.createSuccess));
        })
        .catch(() => {
          toast.error(intl.formatMessage(messages.createError));
        });
    };
    return (
      <section>
        <h2>{intl.formatMessage(messages.createHeading)}</h2>
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
            <Input
              id="group"
              name="group"
              label={intl.formatMessage(messages.groupLabel)}
              type="text"
              rules={{ required: errorMessages.required }}
            />
            <Select
              id="level"
              name="level"
              label={intl.formatMessage(messages.levelLabel)}
              nullSelection={intl.formatMessage(messages.levelPlaceholder)}
              rules={{ required: errorMessages.required }}
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
              label={intl.formatMessage(messages.minSalaryLabel)}
              type="number"
              rules={{
                required: errorMessages.required,
                min: { value: 0, message: `${errorMessages.mustBeGreater} 0` },
              }}
            />
            <Input
              id="maxSalary"
              name="maxSalary"
              label={intl.formatMessage(messages.maxSalaryLabel)}
              type="number"
              rules={{
                required: errorMessages.required,
                min: {
                  value: watchMinSalary || 0,
                  message: `${errorMessages.mustBeGreater} ${
                    watchMinSalary || 0
                  }`,
                },
              }}
            />
            <Submit />
          </form>
        </FormProvider>
      </section>
    );
  };

export const CreateClassification: React.FunctionComponent = () => {
  const [_result, executeMutation] = useCreateClassificationMutation();
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
