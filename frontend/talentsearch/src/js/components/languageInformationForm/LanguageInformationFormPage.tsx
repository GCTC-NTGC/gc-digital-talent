import React from "react";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { parseUrlQueryParameters, useLocation } from "@common/helpers/router";
import { commonMessages } from "@common/messages";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  useGetLanguageInformationQuery,
  useUpdateLanguageInformationMutation,
  UpdateUserAsUserInput,
  User,
  useGetApplicationQuery,
} from "../../api/generated";
import profileMessages from "../profile/profileMessages";
import LanguageInformationForm, {
  LanguageInformationUpdateHandler,
} from "./LanguageInformationForm";

interface LanguageInformationFormApiProps {
  applicationId: string;
  initialData: User;
  submitHandler: LanguageInformationUpdateHandler;
}

const LanguageInformationFormApi: React.FunctionComponent<
  LanguageInformationFormApiProps
> = ({ applicationId, initialData, submitHandler }) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <LanguageInformationForm
          initialData={initialData}
          application={data.poolCandidate}
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
  applicationId?: string;
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

const LanguageInformationFormPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const location = useLocation();
  const queryParams = parseUrlQueryParameters(location);

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
          toast.success(message);
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
          applicationId={queryParams.application}
          initialData={userData.me}
          submitHandler={onSubmit}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default LanguageInformationFormPage;
