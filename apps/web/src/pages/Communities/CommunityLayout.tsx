import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useRequiredParams from "~/hooks/useRequiredParams";
import { PageNavInfo } from "~/types/pages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { checkRole } from "~/utils/communityUtils";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";

const CommunityLayout_CommunityFragment = graphql(/* GraphQL */ `
  fragment CommunityLayout_Community on Community {
    id
    name {
      en
      fr
    }
  }
`);

type CommunityLayoutFragment = FragmentType<
  typeof CommunityLayout_CommunityFragment
>;

type PageNavKeys = "manage-access" | "view";

interface CommunityHeaderProps {
  communityQuery: CommunityLayoutFragment;
  canAdmin: boolean;
}

const CommunityHeader = ({
  communityQuery,
  canAdmin,
}: CommunityHeaderProps) => {
  const intl = useIntl();
  const community = getFragment(
    CommunityLayout_CommunityFragment,
    communityQuery,
  );
  const paths = useRoutes();

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
          url: paths.communityView(community.id),
        },
      },
    ],
  ]);

  if (canAdmin) {
    pages.set("manage-access", {
      icon: ClipboardDocumentListIcon,
      title: intl.formatMessage({
        defaultMessage: "Manage access",
        id: "J0i4xY",
        description: "Title for members page",
      }),
      link: {
        url: paths.communityManageAccess(community.id),
      },
    });
  }

  const communityName = getLocalizedName(community.name, intl);
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.communities),
        url: paths.communityTable(),
      },
      {
        label: communityName,
        url: currentPage?.link.url ?? "#",
      },
    ],
  });

  return (
    <>
      <SEO title={currentPage?.title} description={communityName} />
      <Hero
        title={communityName}
        crumbs={navigationCrumbs}
        navTabs={Array.from(pages.values()).map((page) => ({
          label: page.title,
          url: page.link.url,
        }))}
      />
    </>
  );
};

const CommunityLayoutCommunityName_Query = graphql(/* GraphQL */ `
  query CommunityName($id: UUID!) {
    community(id: $id) {
      ...CommunityLayout_Community
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
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: CommunityLayoutCommunityName_Query,
    variables: {
      id: communityId,
    },
  });

  const roleAssignmentsFiltered =
    data?.myAuth?.roleAssignments?.filter(notEmpty) ?? [];
  const canAdmin = checkRole(
    [ROLE_NAME.PlatformAdmin, ROLE_NAME.CommunityAdmin],
    roleAssignmentsFiltered,
    communityId,
  );

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.community ? (
          <CommunityHeader
            canAdmin={canAdmin}
            communityQuery={data.community}
          />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
      <Outlet
        context={{
          teamId: data?.community?.teamIdForRoleAssignment,
          canAdmin,
        }}
      />
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <CommunityLayout />
  </RequireAuth>
);

Component.displayName = "AdminCommunityLayout";

export default CommunityLayout;
