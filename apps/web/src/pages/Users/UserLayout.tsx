import { useIntl } from "react-intl";
import { Outlet } from "react-router";
import { useQuery } from "urql";

import { ThrowNotFound, Pending, Alert } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { getFullNameLabel } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";

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

  const userName = getFullNameLabel(user.firstName, user.lastName, intl);
  const userDeleted = !!user.deletedDate;

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
        navTabs={pages}
      />
      {userDeleted ? (
        <Alert.Root type="warning" live={false} className="mt-0 mb-12">
          <p>
            {intl.formatMessage({
              defaultMessage: "This user has been deleted.",
              id: "aiYTNf",
              description: "Message displayed when admin views a deleted user.",
            })}
          </p>
        </Alert.Root>
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

export default UserLayout;
