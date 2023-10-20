import React from "react";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";

import { PoolCandidate, useGetApplicationQuery } from "~/api/generated";

import useApplicationId from "./useApplicationId";

export type ApplicationPageProps = {
  application: PoolCandidate;
};

interface ApplicationApiProps {
  PageComponent: (props: ApplicationPageProps) => JSX.Element;
}

const ApplicationApi = ({ PageComponent }: ApplicationApiProps) => {
  const id = useApplicationId();
  const [{ data, fetching, error, stale }] = useGetApplicationQuery({
    requestPolicy: "cache-first",
    variables: {
      id,
    },
  });

  const application = data?.poolCandidate;

  return (
    <Pending fetching={fetching || stale} error={error}>
      {application?.pool ? (
        <PageComponent application={application} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationApi;
