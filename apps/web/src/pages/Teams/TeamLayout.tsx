import React from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import AdminHero from "~/components/Hero/AdminHero";
import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
import useRequiredParams from "~/hooks/useRequiredParams";
import { Team, useTeamNameQuery } from "~/api/generated";
import { PageNavInfo } from "~/types/pages";

type PageNavKeys = "members" | "view" | "edit";

interface TeamHeaderProps {
  team: Pick<Team, "id" | "displayName">;
}

const TeamHeader = ({ team }: TeamHeaderProps) => {
  const intl = useIntl();
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
      <SEO title={currentPage?.title} />
      <AdminHero
        title={currentPage?.title}
        subtitle={teamName}
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

type RouteParams = {
  teamId: string;
};

const TeamLayout = () => {
  const { teamId } = useRequiredParams<RouteParams>("teamId");
  const [{ data, fetching, error }] = useTeamNameQuery({
    variables: {
      id: teamId,
    },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.team ? <TeamHeader team={data.team} /> : <ThrowNotFound />}
      </Pending>
      <Outlet />
    </>
  );
};

export default TeamLayout;
