import * as React from "react";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";

import { Pending, NotFound } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql, Scalars, UpdateTeamInput } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

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
      id
      name
      contactEmail
      displayName {
        en
        fr
      }
      departments {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
      description {
        en
        fr
      }
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
          displayName {
            en
            fr
          }
        }
        user {
          id
          email
          firstName
          lastName
        }
      }
    }

    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`);

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

  const departments = unpackMaybes(data?.departments);
  const team = data?.team;

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
