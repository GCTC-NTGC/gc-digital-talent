import React from "react";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import { ThrowNotFound } from "@common/components/NotFound";
import Pending from "@common/components/Pending";

import {
  useWorkLocationPreferenceQuery,
  useCreateWorkLocationPreferenceMutation,
  UpdateUserAsUserInput,
  User,
  CreateWorkLocationPreferenceMutation,
  useGetApplicationQuery,
} from "../../api/generated";
import profileMessages from "../profile/profileMessages";
import WorkLocationPreferenceForm from "./WorkLocationPreferenceForm";

interface WorkLocationPreferenceApiProps {
  applicationId: string;
  initialData: User;
  handleWorkLocationPreference: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<CreateWorkLocationPreferenceMutation["updateUserAsUser"]>;
}

const WorkLocationPreferenceApi: React.FunctionComponent<
  WorkLocationPreferenceApiProps
> = ({ applicationId, initialData, handleWorkLocationPreference }) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <WorkLocationPreferenceForm
          initialData={initialData}
          application={data.poolCandidate}
          handleWorkLocationPreference={handleWorkLocationPreference}
        />
      ) : (
        <WorkLocationPreferenceForm
          initialData={initialData}
          handleWorkLocationPreference={handleWorkLocationPreference}
        />
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId?: string | null;
  initialData: User;
  handleWorkLocationPreference: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<CreateWorkLocationPreferenceMutation["updateUserAsUser"]>;
}
const ApiOrContent = ({
  applicationId,
  initialData,
  handleWorkLocationPreference,
}: ApiOrContentProps) =>
  applicationId ? (
    <WorkLocationPreferenceApi
      applicationId={applicationId}
      initialData={initialData}
      handleWorkLocationPreference={handleWorkLocationPreference}
    />
  ) : (
    <WorkLocationPreferenceForm
      initialData={initialData}
      handleWorkLocationPreference={handleWorkLocationPreference}
    />
  );

export const WorkLocationPreferencePage: React.FunctionComponent = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  const [{ data: userData, fetching, error }] =
    useWorkLocationPreferenceQuery();
  const preProfileStatus = userData?.me?.isProfileComplete;

  const [, executeMutation] = useCreateWorkLocationPreferenceMutation();
  const handleWorkLocationPreference = (
    id: string,
    data: UpdateUserAsUserInput,
  ) =>
    executeMutation({
      id,
      user: data,
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        const currentProfileStatus =
          result.data?.updateUserAsUser?.isProfileComplete;
        const message = intl.formatMessage(profileMessages.profileCompleted);
        if (!preProfileStatus && currentProfileStatus) {
          toast.success(message);
        }
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  return (
    <Pending fetching={fetching} error={error}>
      {userData?.me ? (
        <ApiOrContent
          applicationId={applicationId}
          initialData={userData.me}
          handleWorkLocationPreference={handleWorkLocationPreference}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default WorkLocationPreferencePage;
