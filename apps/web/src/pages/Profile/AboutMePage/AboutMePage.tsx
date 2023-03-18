import React from "react";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { OperationResult } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { useFeatureFlags } from "@gc-digital-talent/env";

import {
  Exact,
  UpdateUserAboutMeMutation,
  UpdateUserAsUserInput,
  useGetAboutMeQuery,
  useGetApplicationQuery,
  User,
  useUpdateUserAboutMeMutation,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import AboutMeForm, {
  AboutMeUpdateHandler,
} from "./components/AboutMeForm/AboutMeForm";

interface AboutMeFormApiProps {
  applicationId: string;
  initialUser: User;
  onUpdateAboutMe: AboutMeUpdateHandler;
}

const AboutMeFormApi: React.FunctionComponent<AboutMeFormApiProps> = ({
  applicationId,
  initialUser,
  onUpdateAboutMe,
}) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <AboutMeForm
          initialUser={initialUser}
          application={{
            ...data.poolCandidate,
            pool: {id: data.poolCandidate.id}
          }}
          onUpdateAboutMe={onUpdateAboutMe}
        />
      ) : (
        <AboutMeForm
          initialUser={initialUser}
          onUpdateAboutMe={onUpdateAboutMe}
        />
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId: string | null;
  initialUser: User;
  onUpdateAboutMe: AboutMeUpdateHandler;
}
const ApiOrContent = ({
  applicationId,
  initialUser,
  onUpdateAboutMe,
}: ApiOrContentProps) =>
  applicationId ? (
    <AboutMeFormApi
      applicationId={applicationId}
      initialUser={initialUser}
      onUpdateAboutMe={onUpdateAboutMe}
    />
  ) : (
    <AboutMeForm initialUser={initialUser} onUpdateAboutMe={onUpdateAboutMe} />
  );

const AboutMePage = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const featureFlags = useFeatureFlags();

  const [result] = useGetAboutMeQuery();
  const { data, fetching, error } = result;
  const preProfileStatus = data?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateUserAboutMeMutation();

  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    return executeMutation({ id, user: values }).then(
      (
        res: OperationResult<
          UpdateUserAboutMeMutation,
          Exact<{ id: string; user: UpdateUserAsUserInput }>
        >,
      ) => {
        if (res.data?.updateUserAsUser) {
          const currentProfileStatus =
            res.data?.updateUserAsUser?.isProfileComplete;
          const message = intl.formatMessage(profileMessages.profileCompleted);
          if (!preProfileStatus && currentProfileStatus) {
            if (!featureFlags.applicantDashboard) toast.success(message);
          }
          return res.data.updateUserAsUser;
        }

        return Promise.reject(res.error);
      },
    );
  };

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ApiOrContent
          applicationId={applicationId}
          initialUser={data.me}
          onUpdateAboutMe={handleUpdateUser}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default AboutMePage;
