import * as React from "react";
import { useIntl } from "react-intl";

import { Pending, NotFound } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  Scalars,
  UpdateTeamInput,
  useDepartmentsQuery,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from "~/api/generated";
import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import UpdateTeamForm from "./components/UpdateTeamForm";

type RouteParams = {
  teamId: string;
};

const EditTeamPage = () => {
  const intl = useIntl();
  const { teamId } = useRequiredParams<RouteParams>("teamId");
  const [{ data: teamData, fetching: teamFetching, error: teamError }] =
    useGetTeamQuery({
      variables: {
        teamId,
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
    id: "vSMCIR",
    description: "Title for the edit team page",
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
    <AdminContentWrapper>
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
