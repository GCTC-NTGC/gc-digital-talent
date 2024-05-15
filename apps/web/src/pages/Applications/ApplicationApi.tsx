import * as React from "react";

import { PoolCandidate } from "@gc-digital-talent/graphql";

import useApplication from "./useApplication";

export type ApplicationPageProps = {
  application: PoolCandidate;
};

interface ApplicationApiProps {
  PageComponent: (props: ApplicationPageProps) => React.JSX.Element;
}

const ApplicationApi = ({ PageComponent }: ApplicationApiProps) => {
  const { application } = useApplication();

  return <PageComponent application={application} />;
};

export default ApplicationApi;
