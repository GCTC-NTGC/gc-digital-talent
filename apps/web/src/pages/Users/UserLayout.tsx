import { useIntl } from "react-intl";
import { Outlet } from "react-router";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import { useQuery } from "urql";

import { ThrowNotFound, Pending, Alert } from "@gc-digital-talent/ui";
import { User, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useCurrentPage from "~/hooks/useCurrentPage";
import { getFullNameHtml } from "~/utils/nameUtils";
import { PageNavInfo } from "~/types/pages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";

type PageNavKeys = "profile" | "info" | "edit";
type PageNavEmployeeKeys = "profile" | "employee-profile" | "info" | "edit";

interface UserHeaderProps {
  user: Pick<
    User,
    "id" | "firstName" | "lastName" | "deletedDate" | "isGovEmployee"
  >;
}

const UserHeader = ({ user }: UserHeaderProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  let pages = undefined;
  if (user.isGovEmployee) {
    pages = new Map<PageNavEmployeeKeys, PageNavInfo>([
      [
        "profile",
        {
          icon: UserCircleIcon,
          title: intl.formatMessage({
            defaultMessage: "User profile",
            id: "SLedtO",
            description: "Title for the user profile page",
          }),
          link: {
            url: paths.userProfile(user.id),
          },
        },
      ],
      [
        "employee-profile",
        {
          icon: UserCircleIcon,
          title: intl.formatMessage(navigationMessages.employeeProfileGC),
          link: {
            url: paths.userEmployeeProfile(user.id),
          },
        },
      ],
      [
        "info",
        {
          icon: UserIcon,
          title: intl.formatMessage({
            defaultMessage: "View user",
            id: "eP8dfW",
            description: "Title for the user information page",
          }),
          link: {
            url: paths.userView(user.id),
            label: intl.formatMessage({
              defaultMessage: "User information",
              id: "SFk84j",
              description: "Link text for the user information page link",
            }),
          },
        },
      ],
      [
        "edit",
        {
          icon: Cog8ToothIcon,
          title: intl.formatMessage({
            defaultMessage: "Edit user account",
            id: "9i2N/g",
            description: "Title for the user edit page",
          }),
          link: {
            url: paths.userUpdate(user.id),
          },
        },
      ],
    ]);
  } else {
    pages = new Map<PageNavKeys, PageNavInfo>([
      [
        "profile",
        {
          icon: UserCircleIcon,
          title: intl.formatMessage({
            defaultMessage: "User profile",
            id: "SLedtO",
            description: "Title for the user profile page",
          }),
          link: {
            url: paths.userProfile(user.id),
          },
        },
      ],
      [
        "info",
        {
          icon: UserIcon,
          title: intl.formatMessage({
            defaultMessage: "View user",
            id: "eP8dfW",
            description: "Title for the user information page",
          }),
          link: {
            url: paths.userView(user.id),
            label: intl.formatMessage({
              defaultMessage: "User information",
              id: "SFk84j",
              description: "Link text for the user information page link",
            }),
          },
        },
      ],
      [
        "edit",
        {
          icon: Cog8ToothIcon,
          title: intl.formatMessage({
            defaultMessage: "Edit user account",
            id: "9i2N/g",
            description: "Title for the user edit page",
          }),
          link: {
            url: paths.userUpdate(user.id),
          },
        },
      ],
    ]);
  }

  const currentPage = useCurrentPage<PageNavEmployeeKeys>(pages);

  const userName = getFullNameHtml(user.firstName, user.lastName, intl);
  const userDeleted = !!user.deletedDate;

  return (
    <>
      <SEO title={currentPage?.title} />
      <Hero
        title={currentPage?.title}
        subtitle={userName}
        navTabs={Array.from(pages.values()).map((page) => ({
          label: page.link.label ?? page.title,
          url: page.link.url,
        }))}
      />
      {userDeleted ? (
        <Alert.Root
          type="warning"
          live={false}
          data-h2-margin="base(0, 0, x2, 0)"
        >
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
      id
      firstName
      lastName
      deletedDate
      isGovEmployee
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
        {data?.user ? <UserHeader user={data.user} /> : <ThrowNotFound />}
      </Pending>
      <Outlet />
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.RequestResponder,
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
