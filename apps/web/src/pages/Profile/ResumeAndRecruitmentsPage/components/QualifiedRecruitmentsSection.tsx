import * as React from "react";
import { useIntl } from "react-intl";

import { HeadingRank, Link, Well } from "@gc-digital-talent/ui";

import { notEmpty } from "@gc-digital-talent/helpers";
import TrackApplicationsCard from "~/pages/Applications/ApplicantDashboardPage/components/TrackApplications/TrackApplicationsCard";
import useRoutes from "~/hooks/useRoutes";
import {
  Application,
  isApplicationQualifiedRecruitment,
} from "~/utils/applicationUtils";

export interface QualifiedRecruitmentsSectionProps {
  applications?: Application[];
  headingLevel?: HeadingRank;
}

const QualifiedRecruitmentsSection = ({
  applications,
  headingLevel = "h3",
}: QualifiedRecruitmentsSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const applicationsNotNull = applications?.filter(notEmpty) ?? [];

  const applicationsDisplay = applicationsNotNull.filter(
    isApplicationQualifiedRecruitment,
  );

  const hasExperiences = applicationsDisplay.length >= 1;

  return hasExperiences ? (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5 0)"
    >
      {applicationsDisplay.map((application) => (
        <TrackApplicationsCard
          headingLevel={headingLevel}
          key={application.id}
          application={application}
        />
      ))}
    </div>
  ) : (
    <Well data-h2-text-align="base(center)">
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.5)">
        {intl.formatMessage({
          defaultMessage:
            "Recruitment processes that you're awarded entry into will appear here.",
          id: "aW/Htv",
          description:
            "Message to user when no qualified recruitments have been attached to profile, paragraph one.",
        })}
      </p>
      <Link href={paths.browsePools()}>
        {intl.formatMessage({
          defaultMessage:
            "You can get started by applying to available targeted or ongoing recruitment processes.",
          id: "z7FpHz",
          description:
            "Message to user when no qualified recruitments have been attached to profile, paragraph two.",
        })}
      </Link>
    </Well>
  );
};

export default QualifiedRecruitmentsSection;
