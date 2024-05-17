import { useIntl } from "react-intl";

import { HeadingRank, Link, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import QualifiedRecruitmentCard from "~/components/QualifiedRecruitmentCard/QualifiedRecruitmentCard";
import useRoutes from "~/hooks/useRoutes";
import { isQualifiedStatus } from "~/utils/poolCandidate";

const QualifiedRecruitmentsCandidate_Fragment = graphql(/* GraphQL */ `
  fragment QualifiedRecruitmentsCandidate on PoolCandidate {
    id
    status
    ...QualifiedRecruitmentCard
  }
`);

interface QualifiedRecruitmentsSectionProps {
  applicationsQuery: FragmentType<
    typeof QualifiedRecruitmentsCandidate_Fragment
  >[];
  headingLevel?: HeadingRank;
}

const QualifiedRecruitmentsSection = ({
  applicationsQuery,
  headingLevel = "h3",
}: QualifiedRecruitmentsSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const applications = getFragment(
    QualifiedRecruitmentsCandidate_Fragment,
    applicationsQuery,
  );

  const applicationsNotNull = unpackMaybes([...applications]);

  const applicationsDisplay = applicationsNotNull.filter((application) =>
    isQualifiedStatus(application.status),
  );

  return applicationsDisplay.length >= 1 ? (
    <div
      className="flex"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5 0)"
    >
      {applicationsDisplay.map((application) => (
        <QualifiedRecruitmentCard
          headingLevel={headingLevel}
          key={application.id}
          candidateQuery={application}
        />
      ))}
    </div>
  ) : (
    <Well data-h2-text-align="base(center)">
      <p className="font-bold" data-h2-margin-bottom="base(x.5)">
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
