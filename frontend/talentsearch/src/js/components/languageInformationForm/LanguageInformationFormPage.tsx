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
import LanguageInformationForm from "./LanguageInformationForm";

interface LanguageInformationFormApiProps {
  applicationId: string;
  initialData: User;
  submitHandler: (data: UpdateUserAsUserInput) => Promise<void>;
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
  submitHandler: (data: UpdateUserAsUserInput) => Promise<void>;
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
  const userId = userData?.me?.id;
  const preProfileStatus = userData?.me?.isProfileComplete;

  const [, executeMutation] = useUpdateLanguageInformationMutation();

  const handleUpdateUser = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({ id, user: data }).then((result) => {
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  const onSubmit = async (data: UpdateUserAsUserInput) => {
    if (userId === undefined || userId === "") {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error: user not found",
          description: "Message displayed to user if user is not found",
        }),
      );
      return;
    }
    await handleUpdateUser(userId, data).then((res) => {
      if (res.isProfileComplete) {
        const currentProfileStatus = res.isProfileComplete;
        const message = intl.formatMessage(profileMessages.profileCompleted);
        if (!preProfileStatus && currentProfileStatus) {
          toast.success(message);
        }
      }
      return res;
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
