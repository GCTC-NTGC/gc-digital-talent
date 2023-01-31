import React from "react";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";

import { ThrowNotFound } from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { toast } from "@common/components/Toast";

import {
  useWorkLocationQuery,
  useCreateWorkLocationMutation,
  UpdateUserAsUserInput,
  User,
  CreateWorkLocationMutation,
  useGetApplicationQuery,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import WorkLocationForm from "./components/WorkLocationForm/WorkLocationForm";

interface WorkLocationApiProps {
  applicationId: string;
  initialData: User;
  handleWorkLocation: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<CreateWorkLocationMutation["updateUserAsUser"]>;
}

const WorkLocationApi: React.FunctionComponent<WorkLocationApiProps> = ({
  applicationId,
  initialData,
  handleWorkLocation,
}) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <WorkLocationForm
          initialData={initialData}
          application={data.poolCandidate}
          handleWorkLocationPreference={handleWorkLocation}
        />
      ) : (
        <WorkLocationForm
          initialData={initialData}
          handleWorkLocationPreference={handleWorkLocation}
        />
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId?: string | null;
  initialData: User;
  handleWorkLocation: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<CreateWorkLocationMutation["updateUserAsUser"]>;
}
const ApiOrContent = ({
  applicationId,
  initialData,
  handleWorkLocation,
}: ApiOrContentProps) =>
  applicationId ? (
    <WorkLocationApi
      applicationId={applicationId}
      initialData={initialData}
      handleWorkLocation={handleWorkLocation}
    />
  ) : (
    <WorkLocationForm
      initialData={initialData}
      handleWorkLocationPreference={handleWorkLocation}
    />
  );

const WorkLocationPage = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  const [{ data: userData, fetching, error }] = useWorkLocationQuery();
  const preProfileStatus = userData?.me?.isProfileComplete;

  const [, executeMutation] = useCreateWorkLocationMutation();
  const handleWorkLocation = (id: string, data: UpdateUserAsUserInput) =>
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
          handleWorkLocation={handleWorkLocation}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default WorkLocationPage;
