import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import DisqualifiedStatusMeta from "./DisqualifiedStatusMeta";
import RemovedStatusMeta from "./RemovedStatusMeta";
import ToAssessStatusMeta from "./ToAssessStatusMeta";
import QualifiedStatusMeta from "./QualifiedStatusMeta";

const ApplicationStatusMeta_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationStatusMeta on PoolCandidate {
    status {
      value
    }
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
      {application?.status?.value === ApplicationStatus.ToAssess && (
        <ToAssessStatusMeta query={application} />
      )}
      {application?.status?.value === ApplicationStatus.Qualified && (
        <QualifiedStatusMeta query={application} />
      )}
      {application?.status?.value === ApplicationStatus.Disqualified && (
        <DisqualifiedStatusMeta query={application} />
      )}
      {application?.status?.value === ApplicationStatus.Removed && (
        <RemovedStatusMeta query={application} />
      )}
    </>
  );
};

export default ApplicationStatusMeta;
