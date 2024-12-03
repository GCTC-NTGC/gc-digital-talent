import { useIntl } from "react-intl";
import { Outlet } from "react-router";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useRequiredParams from "~/hooks/useRequiredParams";
import { PageNavInfo } from "~/types/pages";
import Hero from "~/components/Hero";

import RequireAuth from "../../components/RequireAuth/RequireAuth";

const TeamLayout_TeamFragment = graphql(/* GraphQL */ `
  fragment TeamLayout_Team on Team {
    id
    displayName {
      en
      fr
    }
  }
`);

type TeamLayoutFragment = FragmentType<typeof TeamLayout_TeamFragment>;

type PageNavKeys = "members" | "view" | "edit";

interface TeamHeaderProps {
  teamQuery: TeamLayoutFragment;
}

const TeamHeader = ({ teamQuery }: TeamHeaderProps) => {
  const intl = useIntl();
  const team = getFragment(TeamLayout_TeamFragment, teamQuery);
  const paths = useRoutes();

  const pages = new Map<PageNavKeys, PageNavInfo>([
    [
      "members",
      {
        icon: UserGroupIcon,
        title: intl.formatMessage({
          defaultMessage: "Team members",
          id: "VxJ5Dz",
          description: "Title for the list of team members page",
        }),
        link: {
          url: paths.teamMembers(team.id),
          label: intl.formatMessage({
            defaultMessage: "View team members",
            id: "ZfCeq/",
            description: "Link text the list of team members page",
          }),
        },
      },
    ],
    [
      "view",
      {
        icon: ClipboardDocumentListIcon,
        title: intl.formatMessage({
          defaultMessage: "Team information",
          id: "b+KdqW",
          description: "Title for team information page",
        }),
        link: {
          url: paths.teamView(team.id),
        },
      },
    ],
    [
      "edit",
      {
        icon: Cog8ToothIcon,
        title: intl.formatMessage({
          defaultMessage: "Edit team information",
          id: "vSMCIR",
          description: "Title for the edit team page",
        }),
        link: {
          url: paths.teamUpdate(team.id),
        },
      },
    ],
  ]);

  const teamName = getLocalizedName(team.displayName, intl);
  const currentPage = useCurrentPage<PageNavKeys>(pages);

  return (
    <>
      <SEO title={currentPage?.title} description={teamName} />
      <Hero
        title={currentPage?.title}
        subtitle={teamName}
        navTabs={Array.from(pages.values()).map((page) => ({
          label: page.link.label ?? page.title,
          url: page.link.url,
        }))}
      />
    </>
  );
};

const TeamLayoutTeamName_Query = graphql(/* GraphQL */ `
  query TeamName($id: UUID!) {
    team(id: $id) {
      ...TeamLayout_Team
    }
  }
`);

interface RouteParams extends Record<string, string> {
  teamId: string;
}

const TeamLayout = () => {
  const { teamId } = useRequiredParams<RouteParams>("teamId");
  const [{ data, fetching, error }] = useQuery({
    query: TeamLayoutTeamName_Query,
    variables: {
      id: teamId,
    },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.team ? <TeamHeader teamQuery={data.team} /> : <ThrowNotFound />}
      </Pending>
      <Outlet />
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <TeamLayout />
  </RequireAuth>
);

Component.displayName = "AdminTeamLayout";

export default TeamLayout;
