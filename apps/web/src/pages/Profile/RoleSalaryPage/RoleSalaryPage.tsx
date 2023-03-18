import React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { useFeatureFlags } from "@gc-digital-talent/env";

import {
  useGetRoleSalaryInfoQuery,
  useUpdateRoleSalaryMutation,
  UpdateUserAsUserInput,
  GetRoleSalaryInfoQuery,
  useGetApplicationQuery,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";
import RoleSalaryForm, {
  RoleSalaryUpdateHandler,
} from "./components/RoleSalaryForm/RoleSalaryForm";

interface RoleSalaryFormApiProps {
  applicationId: string;
  initialData: GetRoleSalaryInfoQuery;
  updateRoleSalary: RoleSalaryUpdateHandler;
}

const RoleSalaryFormApi: React.FunctionComponent<RoleSalaryFormApiProps> = ({
  applicationId,
  initialData,
  updateRoleSalary,
}) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <RoleSalaryForm
          initialData={initialData}
          application={{
            ...data.poolCandidate,
            pool: {id: data.poolCandidate.id}
          }}
          updateRoleSalary={updateRoleSalary}
        />
      ) : (
        <RoleSalaryForm
          initialData={initialData}
          updateRoleSalary={updateRoleSalary}
        />
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId: string | null;
  initialData: GetRoleSalaryInfoQuery;
  updateRoleSalary: RoleSalaryUpdateHandler;
}
const ApiOrContent = ({
  applicationId,
  initialData,
  updateRoleSalary,
}: ApiOrContentProps) =>
  applicationId ? (
    <RoleSalaryFormApi
      applicationId={applicationId}
      initialData={initialData}
      updateRoleSalary={updateRoleSalary}
    />
  ) : (
    <RoleSalaryForm
      initialData={initialData}
      updateRoleSalary={updateRoleSalary}
    />
  );

const RoleSalaryFormPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const featureFlags = useFeatureFlags();

  const [{ data: initialData, fetching, error }] = useGetRoleSalaryInfoQuery();
  const preProfileStatus = initialData?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateRoleSalaryMutation();
  const handleRoleSalary = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        if (result.data?.updateUserAsUser?.isProfileComplete) {
          const currentProfileStatus =
            result.data?.updateUserAsUser?.isProfileComplete;
          const message = intl.formatMessage(profileMessages.profileCompleted);
          if (!preProfileStatus && currentProfileStatus) {
            if (!featureFlags.applicantDashboard) toast.success(message);
          }
        }
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  if (error) {
    toast.error(intl.formatMessage(profileMessages.updatingFailed));
  }

  return (
    <Pending fetching={fetching} error={error}>
      {initialData?.me ? (
        <ApiOrContent
          applicationId={applicationId}
          initialData={initialData}
          updateRoleSalary={handleRoleSalary}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default RoleSalaryFormPage;
