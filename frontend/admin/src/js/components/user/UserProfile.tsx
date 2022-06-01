import React from "react";
import { useIntl } from "react-intl";
import { commonMessages } from "@common/messages";

import UserProfile from "@common/components/UserProfile";
import { useGetUserProfileQuery } from "../../api/generated";
import AdminAboutSection from "./AdminAboutSection";

const UserProfileApi: React.FunctionComponent<{
  userId: string;
}> = ({ userId }) => {
  const intl = useIntl();
  const [{ data: initialData, fetching, error }] = useGetUserProfileQuery({
    variables: { id: userId },
  });

  const userData = initialData;

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );
  return userData?.applicant ? (
    <UserProfile
      applicant={userData.applicant}
      sections={{
        about: {
          isVisible: true,
          override: <AdminAboutSection applicant={userData.applicant} />,
        },
        language: { isVisible: true },
        government: { isVisible: true },
        workLocation: { isVisible: true },
        workPreferences: { isVisible: true },
        employmentEquity: { isVisible: true },
        roleSalary: { isVisible: true },
        skillsExperience: { isVisible: true },
      }}
    />
  ) : (
    <p>
      {intl.formatMessage({
        defaultMessage: "No candidate data",
        description: "No candidate data was found",
      })}
    </p>
  );
};

export default UserProfileApi;
