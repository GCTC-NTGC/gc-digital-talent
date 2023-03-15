import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import { Pending, NotFound } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  Scalars,
  UpdateTeamInput,
  useDepartmentsQuery,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from "~/api/generated";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import UpdateTeamForm from "./components/UpdateTeamForm";

const EditTeamPage = () => {
  const intl = useIntl();
  const { teamId } = useParams();
  const routes = useRoutes();
  const [{ data: teamData, fetching: teamFetching, error: teamError }] =
    useGetTeamQuery({
      variables: {
        teamId: teamId || "",
      },
    });
  const [
    {
      data: departmentsData,
      fetching: departmentsFetching,
      error: departmentsError,
    },
  ] = useDepartmentsQuery();
  const [, executeMutation] = useUpdateTeamMutation();

  const departments = departmentsData?.departments.filter(notEmpty);
  const team = teamData?.team;

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit team information",
    id: "zEmPCS",
    description: "Page title for the edit team page",
  });

  const handleSubmit = async (id: Scalars["UUID"], data: UpdateTeamInput) => {
    return executeMutation({
      teamId: id,
      team: data,
    }).then((result) => {
      if (result.data?.updateTeam) {
        return Promise.resolve(result.data?.updateTeam);
      }
      return Promise.reject(result.error);
    });
  };

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
      label: intl.formatMessage({
        defaultMessage: "Teams",
        id: "P+KWP7",
        description: "Breadcrumb title for the teams page link.",
      }),
      url: routes.teamTable(),
    },
    ...(teamId
      ? [
          {
            label: getLocalizedName(teamData?.team?.displayName, intl),
            url: routes.teamView(teamId),
          },
        ]
      : []),
    ...(teamId
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Edit",
              id: "QU8FkQ",
              description: "Breadcrumb title for the edit team page link.",
            }),
            url: routes.teamUpdate(teamId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending
        fetching={teamFetching || departmentsFetching}
        error={teamError || departmentsError}
      >
        {team ? (
          <>
            <SEO title={pageTitle} />
            <UpdateTeamForm
              team={team}
              departments={departments}
              onSubmit={handleSubmit}
            />
          </>
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Team {teamId} not found.",
                  id: "VJYI6K",
                  description: "Message displayed for team not found.",
                },
                { teamId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export default EditTeamPage;
