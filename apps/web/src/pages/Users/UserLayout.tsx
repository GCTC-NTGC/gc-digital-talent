import { useIntl } from "react-intl";
import { Outlet, useLocation } from "react-router";
import { useQuery } from "urql";

import { ThrowNotFound, Pending, Notice } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { getFullNameLabel } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

const AdminUserHeader_Fragment = graphql(/** GraphQL */ `
  fragment AdminUserHeader on User {
    id
    firstName
    lastName
    deletedDate
    isGovEmployee
  }
`);

interface UserHeaderProps {
  query: FragmentType<typeof AdminUserHeader_Fragment>;
}

const UserHeader = ({ query }: UserHeaderProps) => {
  const { pathname } = useLocation();
  const intl = useIntl();
  const paths = useRoutes();
  const user = getFragment(AdminUserHeader_Fragment, query);

  const pages = [
    {
      label: intl.formatMessage(navigationMessages.applicantProfile),
      url: paths.userView(user.id),
    },
    {
      label: intl.formatMessage(navigationMessages.careerExperience),
      url: paths.userCareerExperience(user.id),
    },
    {
      label: intl.formatMessage(navigationMessages.skills),
      url: paths.userSkills(user.id),
    },
    {
      label: intl.formatMessage(navigationMessages.recruitment),
      url: paths.userRecruitment(user.id),
    },
    {
      label: intl.formatMessage(navigationMessages.advancedTools),
      url: paths.userAdvancedTools(user.id),
    },
  ];
  if (user.isGovEmployee) {
    pages.splice(1, 0, {
      label: intl.formatMessage(navigationMessages.employeeProfileGC),
      url: paths.userEmployeeProfile(user.id),
    });
  }

  const currentPage = pages.find((page) => page.url === pathname);
  const userName = getFullNameLabel(user.firstName, user.lastName, intl);
  const userDeleted = !!user.deletedDate;

  let pageCrumbs = [
    {
      label: intl.formatMessage(navigationMessages.dashboard),
      url: paths.adminDashboard(),
    },
    {
      label: intl.formatMessage(navigationMessages.users),
      url: paths.userTable(),
    },
    {
      label: userName,
      url: pages[0].url,
    },
  ];

  if (currentPage?.url && currentPage.url !== pages[0].url) {
    pageCrumbs = [...pageCrumbs, currentPage];
  }

  const crumbs = useBreadcrumbs({
    crumbs: pageCrumbs,
  });

  return (
    <>
      <SEO title={userName} />
      <Hero
        title={userName}
        subtitle={intl.formatMessage({
          defaultMessage: "View all the information available for this user.",
          id: "Jv/Blc",
          description: "Subtitle for user section",
        })}
        crumbs={crumbs}
        navTabs={pages}
      />
      {userDeleted ? (
        <Notice.Root color="warning" mode="card" className="mt-0 mb-12">
          <Notice.Title defaultIcon>
            {intl.formatMessage({
              defaultMessage: "This user has been deleted.",
              id: "aiYTNf",
              description: "Message displayed when admin views a deleted user.",
            })}
          </Notice.Title>
        </Notice.Root>
      ) : null}
    </>
  );
};

interface RouteParams extends Record<string, string> {
  userId: string;
}

const UserName_Query = graphql(/* GraphQL */ `
  query UserName($userId: UUID!) {
    user(id: $userId, trashed: WITH) {
      ...AdminUserHeader
    }
  }
`);

const UserLayout = () => {
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data, fetching, error }] = useQuery({
    query: UserName_Query,
    variables: {
      userId,
    },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.user ? <UserHeader query={data.user} /> : <ThrowNotFound />}
      </Pending>
      <Outlet />
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <UserLayout />
  </RequireAuth>
);

Component.displayName = "AdminUserLayout";

export default Component;
