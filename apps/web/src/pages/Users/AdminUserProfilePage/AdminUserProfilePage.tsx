import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import PrinterIcon from "@heroicons/react/24/outline/PrinterIcon";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import UserProfile from "~/components/UserProfile";
import { User, Scalars, useGetViewUserDataQuery } from "~/api/generated";
import AdminAboutUserSection from "~/components/AdminAboutUserSection/AdminAboutUserSection";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import { getFullNameLabel } from "~/utils/nameUtils";

import adminMessages from "~/messages/adminMessages";
import UserProfilePrintButton from "./components/UserProfilePrintButton";

interface AdminUserProfileProps {
  user: User;
}

export const AdminUserProfile = ({ user }: AdminUserProfileProps) => {
  const intl = useIntl();

  return (
    <>
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-text-align="base(right)"
      >
        <UserProfilePrintButton user={user}>
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
        user={user}
        headingLevel="h3"
        sections={{
          about: {
            isVisible: true,
            override: <AdminAboutUserSection user={user} />,
          },
          language: { isVisible: true },
          government: { isVisible: true },
          workLocation: { isVisible: true },
          workPreferences: { isVisible: true },
          employmentEquity: { isVisible: true },
          roleSalary: { isVisible: true },
          resumeAndRecruitment: { isVisible: true },
        }}
      />
    </>
  );
};

type RouteParams = {
  userId: Scalars["ID"];
};

const AdminUserProfilePage = () => {
  const { userId } = useParams<RouteParams>();
  const intl = useIntl();
  const routes = useRoutes();
  const [{ data: lookupData, fetching, error }] = useGetViewUserDataQuery({
    variables: { id: userId || "" },
  });

  const user = lookupData?.user;

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.users),
      url: routes.userTable(),
    },
    ...(userId
      ? [
          {
            label: getFullNameLabel(user?.firstName, user?.lastName, intl),
            url: routes.userView(userId),
          },
        ]
      : []),
    ...(userId
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Profile",
              id: "1wONOC",
              description: "User profile breadcrumb text",
            }),
            url: routes.userProfile(userId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
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
    </AdminContentWrapper>
  );
};

export default AdminUserProfilePage;
