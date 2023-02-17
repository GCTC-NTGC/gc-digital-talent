import * as React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import {
  Scalars,
  UpdateTeamInput,
  useDepartmentsQuery,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from "~/api/generated";
import { useParams } from "react-router-dom";
import Pending from "~/../../../frontend/common/src/components/Pending";
import NotFound from "~/../../../frontend/common/src/components/NotFound";
import { commonMessages } from "~/../../../frontend/common/src/messages";
import { notEmpty } from "~/../../../frontend/common/src/helpers/util";
import { getLocalizedName } from "~/../../../frontend/common/src/helpers/localize";
import UpdateTeamForm from "./components/UpdateTeamForm";

const EditTeamPage = () => {
  const intl = useIntl();
  const { teamId } = useParams();
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

  return (
    <Pending
      fetching={teamFetching || departmentsFetching}
      error={teamError || departmentsError}
    >
      {team ? (
        <>
          <SEO title={pageTitle} />
          <PageHeader
            icon={BuildingOffice2Icon}
            subtitle={getLocalizedName(team.displayName, intl)}
          >
            {pageTitle}
          </PageHeader>
          <UpdateTeamForm
            team={team}
            departments={departments}
            onSubmit={handleSubmit}
          />
        </>
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
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
  );
};

export default EditTeamPage;
