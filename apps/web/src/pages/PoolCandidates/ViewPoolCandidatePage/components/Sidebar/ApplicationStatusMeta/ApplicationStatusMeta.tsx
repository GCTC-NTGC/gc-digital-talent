import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import DisqualifiedStatusMeta from "./DisqualifiedStatusMeta";
import RemovedStatusMeta from "./RemovedStatusMeta";
import ToAssessStatusMeta from "./ToAssessStatusMeta";
import QualifiedStatusMeta from "./QualifiedStatusMeta";

const ApplicationStatusMeta_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationStatusMeta on PoolCandidate {
    ...ToAssessStatusMeta
    ...QualifiedStatusMeta
    ...DisqualifiedStatusMeta
    ...RemovedStatusMeta
  }
`);

interface ApplicationStatusMetaProps {
  query: FragmentType<typeof ApplicationStatusMeta_Fragment>;
}

const ApplicationStatusMeta = ({ query }: ApplicationStatusMetaProps) => {
  const application = getFragment(ApplicationStatusMeta_Fragment, query);

  return (
    <>
      <ToAssessStatusMeta query={application} />
      <QualifiedStatusMeta query={application} />
      <DisqualifiedStatusMeta query={application} />
      <RemovedStatusMeta query={application} />
    </>
  );
};

export default ApplicationStatusMeta;
