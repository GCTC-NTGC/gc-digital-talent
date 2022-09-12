import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { navigate } from "@common/helpers/router";
import { Input, Submit } from "@common/components/form";
import { errorMessages } from "@common/messages";
import { useAdminRoutes } from "../../adminRoutes";
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

export const CreateDepartmentForm: React.FunctionComponent<
  CreateDepartmentProps
> = ({ handleCreateDepartment }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    return handleCreateDepartment({
      departmentNumber: Number(data.departmentNumber),
      name: data.name,
    })
      .then(() => {
        navigate(paths.departmentTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Department created successfully!",
            id: "yGlG9e",
            description:
              "Message displayed to user after department is created successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating department failed",
            id: "VaVo2t",
            description:
              "Message displayed to user after department fails to get created.",
          }),
        );
      });
  };

  return (
    <section data-h2-container="base(left, s)">
      <h2 data-h2-font-weight="base(700)" data-h2-padding="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Create Department",
          id: "XBY4Fq",
          description: "Title displayed on the create a department form.",
        })}
      </h2>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="departmentNumber"
              name="departmentNumber"
              label={intl.formatMessage({
                defaultMessage: "Department #",
                id: "/YiBdv",
                description:
                  "Label displayed on the create a department form department number field.",
              })}
              type="number"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Input
              id="name_en"
              name="name.en"
              label={intl.formatMessage({
                defaultMessage: "Name (English)",
                id: "4boO/6",
                description:
                  "Label displayed on the create a department form name (English) field.",
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
                id: "c0n+2j",
                description:
                  "Label displayed on the create a department form name (French) field.",
              })}
              type="text"
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

const CreateDepartment: React.FunctionComponent = () => {
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

export default CreateDepartment;
