import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import pick from "lodash/pick";
import {
  Department,
  UpdateDepartmentInput,
  UpdateDepartmentMutation,
  useDepartmentQuery,
  useUpdateDepartmentMutation,
} from "../../api/generated";
import { navigate } from "../../helpers/router";
import { departmentTablePath } from "../../helpers/routes";
import Input from "../form/Input";
import messages from "./messages";
import errorMessages from "../form/errorMessages";
import DashboardContentContainer from "../DashboardContentContainer";
import Submit from "../form/Submit";
import commonMessages from "../commonMessages";

type FormValues = UpdateDepartmentInput;

interface UpdateDepartmentProps {
  initialDepartment: Department;
  handleUpdateDepartment: (
    id: string,
    data: FormValues,
  ) => Promise<UpdateDepartmentMutation["updateDepartment"]>;
}

export const UpdateDepartmentForm: React.FunctionComponent<UpdateDepartmentProps> =
  ({ initialDepartment, handleUpdateDepartment }) => {
    const intl = useIntl();
    const methods = useForm<FormValues>({
      defaultValues: {
        departmentNumber: initialDepartment.department_number,
        name: initialDepartment.name,
      },
    });
    const { handleSubmit } = methods;

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
      return handleUpdateDepartment(initialDepartment.id, {
        departmentNumber: Number(data.departmentNumber),
        name: data.name,
      })
        .then(() => {
          navigate(departmentTablePath());
          toast.success(intl.formatMessage(messages.updateSuccess));
        })
        .catch(() => {
          toast.error(intl.formatMessage(messages.updateError));
        });
    };

    return (
      <section>
        <h2>{intl.formatMessage(messages.updateHeading)}</h2>
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
      </section>
    );
  };

export const UpdateDepartment: React.FunctionComponent<{
  departmentId: string;
}> = ({ departmentId }) => {
  const intl = useIntl();
  const [{ data: departmentData, fetching, error }] = useDepartmentQuery({
    variables: { id: departmentId },
  });
  const [, executeMutation] = useUpdateDepartmentMutation();
  const handleUpdateDepartment = (id: string, data: UpdateDepartmentInput) =>
    executeMutation({
      id,
      department: pick(data, ["departmentName", "name.en", "name.fr"]),
    }).then((result) => {
      if (result.data?.updateDepartment) {
        return result.data?.updateDepartment;
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
  return departmentData?.department ? (
    <DashboardContentContainer>
      <UpdateDepartmentForm
        initialDepartment={departmentData.department}
        handleUpdateDepartment={handleUpdateDepartment}
      />
    </DashboardContentContainer>
  ) : (
    <DashboardContentContainer>
      <p>{intl.formatMessage(messages.notFound, { departmentId })}</p>
    </DashboardContentContainer>
  );
};
