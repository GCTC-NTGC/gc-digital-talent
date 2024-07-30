import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import AdminHero from "~/components/Hero/AdminHero";
import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useRequiredParams from "~/hooks/useRequiredParams";
import { PageNavInfo } from "~/types/pages";

import RequireAuth from "../../components/RequireAuth/RequireAuth";

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

type PageNavKeys = "manage-access" | "view" | "edit";

interface CommunityHeaderProps {
  communityQuery: CommunityLayoutFragment;
}

const CommunityHeader = ({ communityQuery }: CommunityHeaderProps) => {
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
          id: "VSP9NW",
          description: "Title for community information page",
        }),
        link: {
          url: paths.communityView(community.id),
        },
      },
    ],
    [
      "manage-access",
      {
        icon: ClipboardDocumentListIcon,
        title: intl.formatMessage({
          defaultMessage: "Manage access",
          id: "J0i4xY",
          description: "Title for members page",
        }),
        link: {
          url: paths.communityManageAccess(community.id),
        },
      },
    ],
  ]);

  const communityName = getLocalizedName(community.name, intl);
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  return (
    <>
      <SEO title={currentPage?.title} description={communityName} />
      <AdminHero
        title={currentPage?.title}
        subtitle={communityName}
        nav={{
          mode: "subNav",
          items: Array.from(pages.values()).map((page) => ({
            label: page.link.label ?? page.title,
            url: page.link.url,
          })),
        }}
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
  }
`);

type RouteParams = {
  communityId: string;
};

const CommunityLayout = () => {
  const { communityId } = useRequiredParams<RouteParams>("communityId");
  const [{ data, fetching, error }] = useQuery({
    query: CommunityLayoutCommunityName_Query,
    variables: {
      id: communityId,
    },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.community ? (
          <CommunityHeader communityQuery={data.community} />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
      <Outlet context={{ teamId: data?.community?.teamIdForRoleAssignment }} />
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
