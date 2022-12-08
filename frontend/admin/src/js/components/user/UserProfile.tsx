import React from "react";

import UserProfile from "@common/components/UserProfile";
import { Applicant } from "../../api/generated";
import AdminAboutSection from "./AdminAboutSection";

const UserProfileApi: React.FunctionComponent<{
  applicant: Applicant;
}> = ({ applicant }) => {
  return (
    <UserProfile
      applicant={applicant}
      headingLevel="h3"
      sections={{
        about: {
          isVisible: true,
          override: <AdminAboutSection applicant={applicant} />,
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
  );
};

export default UserProfileApi;
