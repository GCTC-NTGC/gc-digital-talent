import React from "react";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { parseUrlQueryParameters, useLocation } from "@common/helpers/router";
import { commonMessages } from "@common/messages";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { OperationResult } from "urql";
import {
  Exact,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
  useGetAboutMeQuery,
  useGetApplicationQuery,
  User,
  useUpdateUserAsUserMutation,
} from "../../api/generated";
import profileMessages from "../profile/profileMessages";
import AboutMeForm, { AboutMeUpdateHandler } from "./AboutMeForm";

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
  applicationId?: string;
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

const AboutMeFormPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryParams = parseUrlQueryParameters(location);

  const [result] = useGetAboutMeQuery();
  const { data, fetching, error } = result;
  const preProfileStatus = data?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateUserAsUserMutation();

  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    return executeMutation({ id, user: values }).then(
      (
        res: OperationResult<
          UpdateUserAsUserMutation,
          Exact<{ id: string; user: UpdateUserAsUserInput }>
        >,
      ) => {
        if (res.data?.updateUserAsUser) {
          const currentProfileStatus =
            res.data?.updateUserAsUser?.isProfileComplete;
          const message = intl.formatMessage(profileMessages.profileCompleted);
          if (!preProfileStatus && currentProfileStatus) {
            toast.success(message);
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
          applicationId={queryParams.application}
          initialUser={data.me}
          onUpdateAboutMe={handleUpdateUser}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default AboutMeFormPage;
