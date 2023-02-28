import React from "react";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import {
  User,
  useGetApplicationQuery,
  useGetWorkPreferencesQuery,
  useUpdateWorkPreferencesMutation,
  UpdateUserAsUserInput,
  UpdateWorkPreferencesMutation,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import WorkPreferencesForm from "./components/WorkPreferencesForm/WorkPreferencesForm";

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
  applicationId?: string | null;
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

export const WorkPreferencesPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");

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
          applicationId={applicationId}
          initialData={initialData.me}
          handleWorkPreferences={handleWorkPreferences}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default WorkPreferencesPage;
