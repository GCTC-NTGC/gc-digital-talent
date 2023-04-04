import React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { useFeatureFlags } from "@gc-digital-talent/env";

import {
  useGetLanguageInformationQuery,
  useUpdateLanguageInformationMutation,
  UpdateUserAsUserInput,
  User,
  useGetApplicationQuery,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import LanguageInformationForm, {
  LanguageInformationUpdateHandler,
} from "./components/LanguageInformationForm/LanguageInformationForm";

interface LanguageInformationFormApiProps {
  applicationId: string;
  initialData: User;
  submitHandler: LanguageInformationUpdateHandler;
}

const LanguageInformationFormApi = ({
  applicationId,
  initialData,
  submitHandler,
}: LanguageInformationFormApiProps) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <LanguageInformationForm
          initialData={initialData}
          application={{
            ...data.poolCandidate,
            pool: { id: data.poolCandidate.id },
          }}
          submitHandler={submitHandler}
        />
      ) : (
        <LanguageInformationForm
          initialData={initialData}
          submitHandler={submitHandler}
        />
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId?: string | null;
  initialData: User;
  submitHandler: LanguageInformationUpdateHandler;
}
const ApiOrContent = ({
  applicationId,
  initialData,
  submitHandler,
}: ApiOrContentProps) =>
  applicationId ? (
    <LanguageInformationFormApi
      applicationId={applicationId}
      initialData={initialData}
      submitHandler={submitHandler}
    />
  ) : (
    <LanguageInformationForm
      initialData={initialData}
      submitHandler={submitHandler}
    />
  );

const LanguageInformationFormPage = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const featureFlags = useFeatureFlags();

  const [lookUpResult] = useGetLanguageInformationQuery();
  const { data: userData, fetching, error } = lookUpResult;
  const preProfileStatus = userData?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateLanguageInformationMutation();

  const onSubmit = async (id: string, data: UpdateUserAsUserInput) => {
    return executeMutation({ id, user: data }).then((res) => {
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
    });
  };

  return (
    <Pending fetching={fetching} error={error}>
      {userData?.me ? (
        <ApiOrContent
          applicationId={applicationId}
          initialData={userData.me}
          submitHandler={onSubmit}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default LanguageInformationFormPage;
