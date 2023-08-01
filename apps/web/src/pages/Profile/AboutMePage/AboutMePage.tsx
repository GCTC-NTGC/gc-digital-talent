import React from "react";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { OperationResult } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";

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

const AboutMeFormApi = ({
  applicationId,
  initialUser,
  onUpdateAboutMe,
}: AboutMeFormApiProps) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <AboutMeForm
          initialUser={initialUser}
          application={data.poolCandidate}
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

  const [result] = useGetAboutMeQuery();
  const { data, fetching, error } = result;

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
