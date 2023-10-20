import React from "react";
import { useIntl } from "react-intl";

import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import UserProfile from "~/components/UserProfile";
import { User, Scalars, useGetViewUserDataQuery } from "~/api/generated";
import AdminAboutUserSection from "~/components/AdminAboutUserSection/AdminAboutUserSection";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { getFullNameLabel } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import UserProfilePrintButton from "./components/UserProfilePrintButton";

interface AdminUserProfileProps {
  user: User;
}

export const AdminUserProfile = ({ user }: AdminUserProfileProps) => {
  return (
    <>
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-text-align="base(right)"
      >
        <UserProfilePrintButton users={[user]} color="primary" mode="solid" />
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
          careerTimelineAndRecruitment: { isVisible: true },
          skillShowcase: { isVisible: true },
        }}
      />
    </>
  );
};

type RouteParams = {
  userId: Scalars["ID"];
};

const AdminUserProfilePage = () => {
  const { userId } = useRequiredParams<RouteParams>("userId");
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
