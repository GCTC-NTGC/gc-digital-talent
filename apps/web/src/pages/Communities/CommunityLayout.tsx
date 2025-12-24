import { useIntl } from "react-intl";
import { Outlet } from "react-router";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import { useQuery } from "urql";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { PageNavInfo } from "~/types/pages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { checkRole } from "~/utils/communityUtils";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";

import { ContextType } from "./CommunityMembersPage/components/types";

type PageNavKeys = "manage-access" | "view";

const CommunityLayoutCommunityName_Query = graphql(/* GraphQL */ `
  query CommunityName($id: UUID!) {
    community(id: $id) {
      name {
        en
        fr
      }
      teamIdForRoleAssignment
    }
    myAuth {
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
        }
        team {
          id
          name
        }
        teamable {
          id
        }
      }
    }
  }
`);

interface RouteParams extends Record<string, string> {
  communityId: string;
}

const CommunityLayout = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data }] = useQuery({
    query: CommunityLayoutCommunityName_Query,
    variables: {
      id: communityId,
    },
  });

  const roleAssignmentsFiltered =
    data?.myAuth?.roleAssignments?.filter(notEmpty) ?? [];
  const canAdminManageAccess = checkRole(
    [ROLE_NAME.PlatformAdmin, ROLE_NAME.CommunityAdmin],
    roleAssignmentsFiltered,
    communityId,
  );
  const canViewManageAccess =
    canAdminManageAccess ||
    checkRole(
      [ROLE_NAME.CommunityTalentCoordinator],
      roleAssignmentsFiltered,
      communityId,
    );

  const pages = new Map<PageNavKeys, PageNavInfo>([
    [
      "view",
      {
        icon: ClipboardDocumentListIcon,
        title: intl.formatMessage({
          defaultMessage: "Community information",
          id: "W0Bh1G",
          description: "Title for community information",
        }),
        link: {
          url: paths.communityView(communityId),
        },
      },
    ],
  ]);

  if (canViewManageAccess) {
    pages.set("manage-access", {
      icon: ClipboardDocumentListIcon,
      title: intl.formatMessage({
        defaultMessage: "Manage access",
        id: "J0i4xY",
        description: "Title for members page",
      }),
      link: {
        url: paths.communityManageAccess(communityId),
      },
    });
  }

  const communityName = getLocalizedName(data?.community?.name, intl);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.communities),
        url: paths.communityTable(),
      },
      {
        label: communityName,
        url: paths.communityView(communityId),
      },
    ],
  });

  const outletContext: ContextType = {
    communityName: communityName,
    teamId: data?.community?.teamIdForRoleAssignment,
    navTabs: Array.from(pages.values()).map((page) => ({
      label: page.title,
      url: page.link.url,
    })),
    navigationCrumbs: navigationCrumbs,
    canAdminManageAccess,
  };

  // No actual shared UI - this is just used as a context provider
  return <Outlet context={outletContext} />;
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <CommunityLayout />
  </RequireAuth>
);

Component.displayName = "AdminCommunityLayout";

export default Component;
