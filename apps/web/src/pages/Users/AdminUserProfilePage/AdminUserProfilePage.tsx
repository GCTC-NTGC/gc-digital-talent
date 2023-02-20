import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { PrinterIcon } from "@heroicons/react/24/outline";

import Heading from "@common/components/Heading";
import Pending from "@common/components/Pending";
import UserProfile from "@common/components/UserProfile";
import SEO from "@common/components/SEO/SEO";
import { ThrowNotFound } from "@common/components/NotFound";
import { getFullNameHtml } from "@common/helpers/nameUtils";

import { Applicant, Scalars, useGetViewUserDataQuery } from "~/api/generated";
import AdminAboutUserSection from "~/components/AdminAboutUserSection/AdminAboutUserSection";

import UserProfilePrintButton from "./components/UserProfilePrintButton";

interface AdminUserProfileProps {
  user: Applicant;
}

export const AdminUserProfile = ({ user }: AdminUserProfileProps) => {
  const intl = useIntl();

  return (
    <>
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-text-align="base(right)"
      >
        <UserProfilePrintButton applicant={user}>
          <span>
            <PrinterIcon style={{ width: "1rem" }} />{" "}
            {intl.formatMessage({
              defaultMessage: "Print Profile",
              id: "R+Zm3X",
              description: "Text for button to print a user profile",
            })}
          </span>
        </UserProfilePrintButton>
      </div>
      <UserProfile
        applicant={user}
        headingLevel="h3"
        sections={{
          about: {
            isVisible: true,
            override: <AdminAboutUserSection applicant={user} />,
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
    </>
  );
};

type RouteParams = {
  userId: Scalars["ID"];
};

const ADminUserProfilePage = () => {
  const { userId } = useParams<RouteParams>();
  const intl = useIntl();
  const [{ data: lookupData, fetching, error }] = useGetViewUserDataQuery({
    variables: { id: userId || "" },
  });

  const user = lookupData?.applicant;

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Candidate details",
          id: "dj8GiH",
          description: "Page title for the individual user page",
        })}
      />
      <Pending fetching={fetching} error={error}>
        {user ? <AdminUserProfile user={user} /> : <ThrowNotFound />}
      </Pending>
    </>
  );
};

export default ADminUserProfilePage;
