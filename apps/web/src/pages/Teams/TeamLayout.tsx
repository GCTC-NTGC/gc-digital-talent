import React from "react";
import { useIntl } from "react-intl";
import { useParams, Outlet } from "react-router-dom";
import {
  UserGroupIcon,
  Cog8ToothIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import Pending from "@common/components/Pending";
import SEO from "@common/components/SEO/SEO";
import { ThrowNotFound } from "@common/components/NotFound";
import { getLocalizedName } from "@common/helpers/localize";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";
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
          url: "#",
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
          id: "UHH1Oh",
          description: "Title for the team information page",
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
          id: "05m1mY",
          description: "Title for the team edit page",
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
      <PageHeader subtitle={teamName} icon={currentPage?.icon} navItems={pages}>
        {currentPage?.title}
      </PageHeader>
    </>
  );
};

const TeamLayout = () => {
  const { teamId } = useParams();
  const [{ data, fetching, error }] = useTeamNameQuery({
    variables: {
      id: teamId || "",
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
