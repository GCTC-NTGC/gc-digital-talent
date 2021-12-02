import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import pick from "lodash/pick";
import { navigate } from "@common/helpers/router";
import { Input, Submit } from "@common/components/form";
import { errorMessages, commonMessages } from "@common/messages";
import { departmentTablePath } from "../../adminRoutes";
import {
  Department,
  UpdateDepartmentInput,
  UpdateDepartmentMutation,
  useDepartmentQuery,
  useUpdateDepartmentMutation,
} from "../../api/generated";
import messages from "./messages";
import DashboardContentContainer from "../DashboardContentContainer";

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
        departmentNumber: initialDepartment.departmentNumber,
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
        <h2 data-h2-text-align="b(center)" data-h2-margin="b(top, none)">
          {intl.formatMessage(messages.updateHeading)}
        </h2>
        <div data-h2-container="b(center, s)">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="departmentNumber"
                name="departmentNumber"
                label={intl.formatMessage(messages.departmentNumberLabel)}
                type="number"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
              <Input
                id="name_en"
                name="name.en"
                label={intl.formatMessage(messages.nameEnLabel)}
                type="text"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
              <Input
                id="name_fr"
                name="name.fr"
                label={intl.formatMessage(messages.nameFrLabel)}
                type="text"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
              <Submit />
            </form>
          </FormProvider>
        </div>
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
