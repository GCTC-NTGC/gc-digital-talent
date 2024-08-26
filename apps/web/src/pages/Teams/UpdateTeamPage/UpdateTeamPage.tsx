import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Pending, NotFound } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { graphql, Scalars, UpdateTeamInput } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import UpdateTeamForm from "./components/UpdateTeamForm";

const UpdateTeam_Mutation = graphql(/* GraphQL */ `
  mutation UpdateTeam($teamId: UUID!, $team: UpdateTeamInput!) {
    updateTeam(id: $teamId, team: $team) {
      id
    }
  }
`);

const UpdateTeamData_Query = graphql(/* GraphQL */ `
  query UpdateTeamData($teamId: UUID!) {
    team(id: $teamId) {
      ...UpdateTeamPage_Team
    }

    departments {
      ...TeamDepartmentOption
    }
  }
`);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  teamId: string;
};

const EditTeamPage = () => {
  const intl = useIntl();
  const { teamId } = useRequiredParams<RouteParams>("teamId");
  const [{ data, fetching, error }] = useQuery({
    query: UpdateTeamData_Query,
    variables: {
      teamId,
    },
  });
  const [, executeMutation] = useMutation(UpdateTeam_Mutation);

  const teamQuery = data?.team;

  const pageTitle = intl.formatMessage({
    defaultMessage: "Edit team information",
    id: "vSMCIR",
    description: "Title for the edit team page",
  });

  const handleSubmit = async (
    id: Scalars["UUID"]["output"],
    input: UpdateTeamInput,
  ) => {
    return executeMutation({
      teamId: id,
      team: input,
    }).then((result) => {
      if (result.data?.updateTeam) {
        return Promise.resolve(result.data?.updateTeam);
      }
      return Promise.reject(result.error);
    });
  };

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {teamQuery ? (
          <>
            <SEO title={pageTitle} />
            <UpdateTeamForm
              teamQuery={teamQuery}
              departmentsQuery={unpackMaybes(data?.departments)}
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

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityManager, ROLE_NAME.PlatformAdmin]}>
    <EditTeamPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateTeamPage";

export default EditTeamPage;
