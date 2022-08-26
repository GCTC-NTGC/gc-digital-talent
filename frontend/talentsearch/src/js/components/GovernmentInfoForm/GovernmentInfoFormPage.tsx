import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { getLocale } from "@common/helpers/localize";
import {
  navigate,
  parseUrlQueryParameters,
  useLocation,
} from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  useGetApplicationQuery,
  useGetGovInfoFormLookupDataQuery,
  Department,
  Classification,
  useUpdateGovAsUserMutation,
  UpdateUserAsUserInput,
  User,
} from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import profileMessages from "../profile/profileMessages";
import GovInfoFormWithProfileWrapper from "./GovernmentInfoForm";

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
        <GovInfoFormWithProfileWrapper
          departments={departments}
          classifications={classifications}
          initialData={initialData}
          application={data.poolCandidate}
          submitHandler={submitHandler}
        />
      ) : (
        <GovInfoFormWithProfileWrapper
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
  applicationId?: string;
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
    <GovInfoFormWithProfileWrapper
      departments={departments}
      classifications={classifications}
      initialData={initialData}
      submitHandler={submitHandler}
    />
  );

const GovernmentInfoFormPage: React.FunctionComponent<{ meId: string }> = ({
  meId,
}) => {
  // needed bits for react-intl, form submits functions, and routing post submission
  const intl = useIntl();
  const location = useLocation();
  const queryParams = parseUrlQueryParameters(location);

  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);

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
          toast.success(message);
          navigate(paths.home(meId));
        }
      }
      return res;
    });
  };

  return (
    <Pending fetching={fetching} error={error}>
      {meInfo ? (
        <ApiOrContent
          applicationId={queryParams.application}
          departments={departments}
          classifications={classifications}
          initialData={meInfo}
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

export default GovernmentInfoFormPage;
