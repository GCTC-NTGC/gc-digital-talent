import React from "react";
import { useIntl } from "react-intl";

import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { imageUrl } from "@common/helpers/router";
import { commonMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";

import {
  useMyApplicationsQuery,
  type PoolCandidate,
  PoolCandidateStatus,
} from "../../api/generated";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";

const statusSortMap: Record<PoolCandidateStatus, number> = {
  [PoolCandidateStatus.Draft]: 1,
  [PoolCandidateStatus.DraftExpired]: 2,
  [PoolCandidateStatus.NewApplication]: 3,
  [PoolCandidateStatus.ApplicationReview]: 4,
  [PoolCandidateStatus.ScreenedIn]: 5,
  [PoolCandidateStatus.ScreenedOutApplication]: 6,
  [PoolCandidateStatus.UnderAssessment]: 7,
  [PoolCandidateStatus.ScreenedOutAssessment]: 8,
  [PoolCandidateStatus.QualifiedAvailable]: 9,
  [PoolCandidateStatus.QualifiedUnavailable]: 10,
  [PoolCandidateStatus.QualifiedWithdrew]: 11,
  [PoolCandidateStatus.PlacedCasual]: 12,
  [PoolCandidateStatus.PlacedTerm]: 13,
  [PoolCandidateStatus.PlacedIndeterminate]: 14,
  [PoolCandidateStatus.Expired]: 15,
};

type Application = Omit<PoolCandidate, "pool" | "user">;

interface MyApplicationsProps {
  applications: Array<Application>;
}

const MyApplications = ({ applications }: MyApplicationsProps) => {
  const intl = useIntl();

  const sortedApplications = applications.sort((a, b) => {
    if (a.status && b.status) {
      return statusSortMap[a.status] - statusSortMap[b.status];
    }
    return 0;
  });

  return (
    <>
      <div
        data-h2-padding="base(x1, x.5)"
        data-h2-color="base(dt-white)"
        data-h2-text-align="base(center)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.png",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1
          data-h2-margin="base(x2, 0)"
          data-h2-font-weight="base(700)"
          style={{
            letterSpacing: "-2px",
            textShadow: "0 3px 3px rgba(10, 10, 10, .3)",
          }}
        >
          {intl.formatMessage({
            defaultMessage: "My Applications",
            description:
              "Title for page that displays current users applications.",
          })}
        </h1>
      </div>
      <div data-h2-padding="base(x3, 0, x3, 0)">
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          {sortedApplications.length > 0 ? (
            sortedApplications.map((application) => (
              <div key={application.id}>{application.id}</div>
            ))
          ) : (
            <p>
              {intl.formatMessage({
                defaultMessage: "You currently have no applications.",
                description:
                  "Messaged displayed when a user has no applications.",
              })}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const MyApplicationsPage = () => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useMyApplicationsQuery();

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me?.poolCandidates ? (
        <MyApplications
          applications={data.me.poolCandidates.filter(notEmpty)}
        />
      ) : (
        <NotFound
          headingMessage={intl.formatMessage(commonMessages.notFound, {
            type: "Applications",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Error, applications  unable to be loaded",
            description: "My applications error message, placeholder",
          })}
        </NotFound>
      )}
    </Pending>
  );
};

export default MyApplicationsPage;
