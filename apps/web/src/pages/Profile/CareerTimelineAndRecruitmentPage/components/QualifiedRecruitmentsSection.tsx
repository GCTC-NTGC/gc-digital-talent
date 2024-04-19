import * as React from "react";
import { useIntl } from "react-intl";

import { HeadingRank, Link, Well } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import QualifiedRecruitmentCard from "~/components/QualifiedRecruitmentCard/QualifiedRecruitmentCard";
import useRoutes from "~/hooks/useRoutes";
import {
  Application,
  isApplicationQualifiedRecruitment,
} from "~/utils/applicationUtils";

interface QualifiedRecruitmentsSectionProps {
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
      className="flex"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5 0)"
    >
      {applicationsDisplay.map((application) => (
        <QualifiedRecruitmentCard
          headingLevel={headingLevel}
          key={application.id}
          candidate={application}
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
