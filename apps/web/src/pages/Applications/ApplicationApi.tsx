import React from "react";

import { PoolCandidate } from "~/api/generated";

import useApplication from "./useApplication";

export type ApplicationPageProps = {
  application: PoolCandidate;
};

interface ApplicationApiProps {
  PageComponent: (props: ApplicationPageProps) => JSX.Element;
}

const ApplicationApi = ({ PageComponent }: ApplicationApiProps) => {
  const { application } = useApplication();

  return <PageComponent application={application} />;
};

export default ApplicationApi;
