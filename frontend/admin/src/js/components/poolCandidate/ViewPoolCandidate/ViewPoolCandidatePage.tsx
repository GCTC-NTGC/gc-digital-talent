import * as React from "react";
import { Scalars } from "admin/src/js/api/generated";

interface ViewPoolCandidatePageProps {
  poolCandidateId: Scalars["ID"];
}

export const ViewPoolCandidatePage = ({
  poolCandidateId,
}: ViewPoolCandidatePageProps) => {
  return <>{poolCandidateId}</>;
};

export default ViewPoolCandidatePage;
