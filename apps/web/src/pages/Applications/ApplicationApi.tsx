import { JSX } from "react";

import { Application_PoolCandidateFragment } from "@gc-digital-talent/graphql";

import useApplication from "./useApplication";

export interface ApplicationPageProps {
  application: Application_PoolCandidateFragment;
}

interface ApplicationApiProps {
  PageComponent: (props: ApplicationPageProps) => JSX.Element;
}

const ApplicationApi = ({ PageComponent }: ApplicationApiProps) => {
  const { application } = useApplication();

  return <PageComponent application={application} />;
};

export default ApplicationApi;
