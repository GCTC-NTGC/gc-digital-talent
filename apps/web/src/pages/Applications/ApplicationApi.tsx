import React from "react";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { FragmentType, graphql } from "@gc-digital-talent/graphql";

import useApplicationId from "./useApplicationId";

export const Application_PoolCandidateFragment = graphql(/* GraphQL */ `
  fragment Application_PoolCandidate on PoolCandidate {
    id
    submittedSteps
    pool {
      id
      publishingGroup
      stream
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
  PageComponent: (props: ApplicationPageProps) => JSX.Element;
}

export const ApplicationPageQuery = graphql(/* GraphQL */ `
  query ApplicationPage($id: UUID!) {
    poolCandidate(id: $id) {
      ...Application_PoolCandidate
    }
  }
`);

const ApplicationApi = ({ PageComponent }: ApplicationApiProps) => {
  const id = useApplicationId();
  const [{ data, fetching, error, stale }] = useQuery({
    query: ApplicationPageQuery,
    requestPolicy: "cache-first",
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
