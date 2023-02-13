import { useSearchParams } from "react-router-dom";
import React from "react";
import { useIntl } from "react-intl";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";

import {
  User,
  useGetApplicationQuery,
  useGetMyDiversityInfoQuery,
  useUpdateMyDiversityInfoMutation,
  UpdateUserAsUserInput,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import EmploymentEquityForm from "./components/EmploymentEquityForm/EmploymentEquityForm";
import { EmploymentEquityUpdateHandler } from "./types";

interface EmploymentEquityFormApiProps {
  applicationId: string;
  user: User;
  isMutating: boolean;
  onUpdate: EmploymentEquityUpdateHandler;
}

const EmploymentEquityFormApi: React.FunctionComponent<
  EmploymentEquityFormApiProps
> = ({ applicationId, user, isMutating, onUpdate }) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <EmploymentEquityForm
          user={user}
          onUpdate={onUpdate}
          isMutating={isMutating}
          application={data.poolCandidate}
        />
      ) : (
        <EmploymentEquityForm
          user={user}
          onUpdate={onUpdate}
          isMutating={isMutating}
        />
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId: string | null;
  user: User;
  isMutating: boolean;
  onUpdate: EmploymentEquityUpdateHandler;
}
const ApiOrContent = ({
  applicationId,
  user,
  isMutating,
  onUpdate,
}: ApiOrContentProps) =>
  applicationId ? (
    <EmploymentEquityFormApi
      applicationId={applicationId}
      user={user}
      onUpdate={onUpdate}
      isMutating={isMutating}
    />
  ) : (
    <EmploymentEquityForm
      user={user}
      onUpdate={onUpdate}
      isMutating={isMutating}
    />
  );

const EmploymentEquityFormPage: React.FC = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");

  const [{ data, fetching, error }] = useGetMyDiversityInfoQuery();
  const [{ fetching: mutationFetching }, executeMutation] =
    useUpdateMyDiversityInfoMutation();

  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    return executeMutation({ id, user: values }).then((res) => {
      if (res.data?.updateUserAsUser) {
        return res.data.updateUserAsUser;
      }

      return Promise.reject(res.error);
    });
  };

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ApiOrContent
          applicationId={applicationId}
          user={data.me}
          onUpdate={handleUpdateUser}
          isMutating={mutationFetching}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default EmploymentEquityFormPage;
