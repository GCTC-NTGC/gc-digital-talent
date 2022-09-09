import React from "react";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { parseUrlQueryParameters, useLocation } from "@common/helpers/router";
import { commonMessages } from "@common/messages";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
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
  applicationId?: string;
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
  const location = useLocation();
  const queryParams = parseUrlQueryParameters(location);

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
          applicationId={queryParams.application}
          initialData={userData.me}
          handleWorkLocationPreference={handleWorkLocationPreference}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default WorkLocationPreferencePage;
