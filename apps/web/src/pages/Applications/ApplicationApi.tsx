import React from "react";
import { OperationContext, useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { FragmentType, graphql } from "@gc-digital-talent/graphql";

import useApplicationId from "./useApplicationId";

export const Application_PoolCandidateFragment = graphql(/* GraphQL */ `
  fragment Application_PoolCandidate on PoolCandidate {
    id
    submittedSteps
    user {
      id
      email
      firstName
      ...Application_UserExperiences
    }
    pool {
      id
      publishingGroup
      stream
      ...Application_Skills
      name {
        en
        fr
      }
      classifications {
        id
        group
        level
      }
      screeningQuestions {
        id
      }
    }
  }
`);

export type ApplicationPageProps = {
  query: FragmentType<typeof Application_PoolCandidateFragment>;
};

interface ApplicationApiProps {
  operationContext?: Partial<OperationContext>;
  PageComponent: (props: ApplicationPageProps) => JSX.Element;
}

export const ApplicationPageQuery = graphql(/* GraphQL */ `
  query ApplicationPage($id: UUID!) {
    poolCandidate(id: $id) {
      ...Application_PoolCandidate
    }
  }
`);

const ApplicationApi = ({
  PageComponent,
  operationContext,
}: ApplicationApiProps) => {
  const id = useApplicationId();
  const [{ data, fetching, error, stale }] = useQuery({
    query: ApplicationPageQuery,
    requestPolicy: "cache-first",
    context: operationContext,
    variables: {
      id,
    },
  });

  return (
    <Pending fetching={fetching || stale} error={error}>
      {data?.poolCandidate ? (
        <PageComponent query={data.poolCandidate} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationApi;
