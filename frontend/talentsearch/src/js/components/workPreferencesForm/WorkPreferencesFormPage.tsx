import React from "react";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { useLocation, parseUrlQueryParameters } from "@common/helpers/router";
import { commonMessages } from "@common/messages";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  User,
  useGetApplicationQuery,
  useGetWorkPreferencesQuery,
  useUpdateWorkPreferencesMutation,
  UpdateUserAsUserInput,
  UpdateWorkPreferencesMutation,
} from "../../api/generated";
import profileMessages from "../profile/profileMessages";
import WorkPreferencesForm from "./WorkPreferencesForm";

interface WorkPreferencesFormApiProps {
  applicationId: string;
  initialData: User;
  handleWorkPreferences: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateWorkPreferencesMutation["updateUserAsUser"]>;
}

const WorkPreferencesFormApi: React.FunctionComponent<
  WorkPreferencesFormApiProps
> = ({ applicationId, initialData, handleWorkPreferences }) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <WorkPreferencesForm
          initialData={initialData}
          application={data.poolCandidate}
          handleWorkPreferences={handleWorkPreferences}
        />
      ) : (
        <WorkPreferencesForm
          initialData={initialData}
          handleWorkPreferences={handleWorkPreferences}
        />
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId?: string;
  initialData: User;
  handleWorkPreferences: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateWorkPreferencesMutation["updateUserAsUser"]>;
}
const ApiOrContent = ({
  applicationId,
  initialData,
  handleWorkPreferences,
}: ApiOrContentProps) =>
  applicationId ? (
    <WorkPreferencesFormApi
      applicationId={applicationId}
      initialData={initialData}
      handleWorkPreferences={handleWorkPreferences}
    />
  ) : (
    <WorkPreferencesForm
      initialData={initialData}
      handleWorkPreferences={handleWorkPreferences}
    />
  );

export const WorkPreferencesApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryParams = parseUrlQueryParameters(location);

  const [{ data: initialData, fetching, error }] = useGetWorkPreferencesQuery();
  const preProfileStatus = initialData?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateWorkPreferencesMutation();
  const handleWorkPreferences = (id: string, data: UpdateUserAsUserInput) =>
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
            toast.success(message);
          }
        }
      }
      if (result.data?.updateUserAsUser) {
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
          applicationId={queryParams.application}
          initialData={initialData.me}
          handleWorkPreferences={handleWorkPreferences}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default WorkPreferencesApi;
