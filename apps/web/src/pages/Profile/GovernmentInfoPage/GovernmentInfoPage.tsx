import React from "react";
import { useIntl } from "react-intl";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import { useFeatureFlags } from "@gc-digital-talent/env";

import {
  useGetApplicationQuery,
  useGetGovInfoFormLookupDataQuery,
  Department,
  Classification,
  useUpdateGovAsUserMutation,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import profileMessages from "~/messages/profileMessages";

import GovernmentInfoForm from "./components/GovernmentInfoForm/GovernmentInfoForm";

interface GovernmentInfoFormApiProps {
  applicationId: string;
  departments: Department[];
  classifications: Classification[];
  initialData: User;
  submitHandler: (data: UpdateUserAsUserInput) => Promise<void>;
}

const GovernmentInfoFormApi: React.FunctionComponent<
  GovernmentInfoFormApiProps
> = ({
  applicationId,
  departments,
  classifications,
  initialData,
  submitHandler,
}) => {
  const [result] = useGetApplicationQuery({ variables: { id: applicationId } });
  const { data, fetching } = result;

  return (
    <Pending fetching={fetching}>
      {data?.poolCandidate ? (
        <GovernmentInfoForm
          departments={departments}
          classifications={classifications}
          initialData={initialData}
          application={{
            ...data.poolCandidate,
            pool: {id: data.poolCandidate.id}
          }}
          submitHandler={submitHandler}
        />
      ) : (
        <GovernmentInfoForm
          departments={departments}
          classifications={classifications}
          initialData={initialData}
          submitHandler={submitHandler}
        />
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId?: string | null;
  departments: Department[];
  classifications: Classification[];
  initialData: User;
  submitHandler: (data: UpdateUserAsUserInput) => Promise<void>;
}
const ApiOrContent = ({
  applicationId,
  departments,
  classifications,
  initialData,
  submitHandler,
}: ApiOrContentProps) =>
  applicationId ? (
    <GovernmentInfoFormApi
      applicationId={applicationId}
      departments={departments}
      classifications={classifications}
      initialData={initialData}
      submitHandler={submitHandler}
    />
  ) : (
    <GovernmentInfoForm
      departments={departments}
      classifications={classifications}
      initialData={initialData}
      submitHandler={submitHandler}
    />
  );

const GovernmentInfoFormPage = () => {
  // needed bits for react-intl, form submits functions, and routing post submission
  const { userId: meId } = useParams();
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const paths = useRoutes();
  const featureFlags = useFeatureFlags();

  // Fetch departments and classifications from graphQL to pass into component to render and pull "Me" at the same time
  const [lookUpResult] = useGetGovInfoFormLookupDataQuery();
  const { data, fetching, error } = lookUpResult;
  const preProfileStatus = data?.me?.isProfileComplete;
  const departments: Department[] | [] =
    data?.departments.filter(notEmpty) ?? [];
  const classifications: Classification[] | [] =
    data?.classifications.filter(notEmpty) ?? [];
  const meInfo = data?.me;

  // submitting the form component values back out to graphQL, after smoothing form-values to appropriate type, then return to /profile
  const [, executeMutation] = useUpdateGovAsUserMutation();
  const handleUpdateUser = (id: string, updateData: UpdateUserAsUserInput) =>
    executeMutation({
      id,
      user: updateData,
    }).then((result) => {
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  const onSubmit = async (updateDate: UpdateUserAsUserInput) => {
    // tristan's suggestion to short-circuit this function if there is no id
    if (meId === undefined || meId === "") {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error: user not found",
          id: "4bjh8X",
          description: "Message displayed to user if user is not found",
        }),
      );
      return;
    }
    await handleUpdateUser(meId, updateDate).then((res) => {
      if (res.isProfileComplete) {
        const currentProfileStatus = res.isProfileComplete;
        const message = intl.formatMessage(profileMessages.profileCompleted);
        if (!preProfileStatus && currentProfileStatus) {
          if (!featureFlags.applicantDashboard) toast.success(message);
          navigate(paths.profile(meId));
        }
      }
      return res;
    });
  };

  return (
    <Pending fetching={fetching} error={error}>
      {meInfo ? (
        <ApiOrContent
          applicationId={applicationId}
          departments={departments}
          classifications={classifications}
          initialData={meInfo}
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

export default GovernmentInfoFormPage;
