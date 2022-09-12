import React from "react";
import { useIntl } from "react-intl";
import { commonMessages } from "@common/messages";

import UserProfile from "@common/components/UserProfile";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
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

  return (
    <Pending fetching={fetching} error={error}>
      {userData?.applicant ? (
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
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "No candidate data",
              id: "dAxaVL",
              description: "No candidate data was found",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default UserProfileApi;
