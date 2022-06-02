import React from "react";
import UserProfile from "@common/components/UserProfile";
import { Applicant } from "../../api/generated";
import AdminAboutSection from "./AdminAboutSection";

export interface UserProfileDocumentProps {
  applicant: Applicant;
}

export const UserProfileDocument = React.forwardRef<
  HTMLDivElement,
  UserProfileDocumentProps
>(({ applicant }, ref) => {
  return (
    <div
      style={{
        display: "none",
      }}
    >
      <div ref={ref}>
        <div className="print-container">
          <UserProfile
            applicant={applicant}
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
        </div>
      </div>
    </div>
  );
});

export default UserProfileDocument;
