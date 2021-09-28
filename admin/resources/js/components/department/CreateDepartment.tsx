import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { navigate } from "@common/helpers/router";
import { Input, Submit } from "@common/components/form";
import { errorMessages } from "@common/messages";
import messages from "./messages";
import { departmentTablePath } from "../../adminRoutes";
import {
  CreateDepartmentInput,
  CreateDepartmentMutation,
  useCreateDepartmentMutation,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";

type FormValues = CreateDepartmentInput;

interface CreateDepartmentProps {
  handleCreateDepartment: (
    data: FormValues,
  ) => Promise<CreateDepartmentMutation["createDepartment"]>;
}

export const CreateDepartmentForm: React.FunctionComponent<CreateDepartmentProps> =
  ({ handleCreateDepartment }) => {
    const intl = useIntl();
    const methods = useForm<FormValues>();
    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      return handleCreateDepartment({
        departmentNumber: Number(data.departmentNumber),
        name: data.name,
      })
        .then(() => {
          navigate(departmentTablePath());
          toast.success(intl.formatMessage(messages.createSuccess));
        })
        .catch(() => {
          toast.error(intl.formatMessage(messages.createError));
        });
    };

    return (
      <section>
        <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
          {intl.formatMessage(messages.createHeading)}
        </h2>
        <div data-h2-container="b(center, s)">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="departmentNumber"
                name="departmentNumber"
                label={intl.formatMessage(messages.departmentNumberLabel)}
                type="number"
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
              <Submit />
            </form>
          </FormProvider>
        </div>
      </section>
    );
  };

export const CreateDepartment: React.FunctionComponent = () => {
  const [, executeMutation] = useCreateDepartmentMutation();
  const handleCreateDepartment = (data: CreateDepartmentInput) =>
    executeMutation({ department: data }).then((result) => {
      if (result.data?.createDepartment) {
        return result.data?.createDepartment;
      }
      return Promise.reject(result.error);
    });

  return (
    <DashboardContentContainer>
      <CreateDepartmentForm handleCreateDepartment={handleCreateDepartment} />
    </DashboardContentContainer>
  );
};
