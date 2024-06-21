import { useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  FragmentType,
  PoolCandidateStatus,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Link, Well } from "@gc-digital-talent/ui";

import ApplicationCard from "~/components/ApplicationCard/ApplicationCard";
import useRoutes from "~/hooks/useRoutes";

const inlineLink = (href: string, chunks: ReactNode) => (
  <Link href={href} color="black">
    {chunks}
  </Link>
);

const RecruitmentAvailabilityCandidate_Fragment = graphql(/* GraphQL */ `
  fragment RecruitmentAvailabilityCandidate on PoolCandidate {
    status {
      value
    }
    id
    ...ApplicationCard
  }
`);

interface RecruitmentAvailabilityProps {
  candidatesQuery: FragmentType<
    typeof RecruitmentAvailabilityCandidate_Fragment
  >[];
}

const RecruitmentAvailability = ({
  candidatesQuery,
}: RecruitmentAvailabilityProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const applications = getFragment(
    RecruitmentAvailabilityCandidate_Fragment,
    candidatesQuery,
  );

  const activeApplications = unpackMaybes([...applications]).filter(
    ({ status }) =>
      status &&
      [
        PoolCandidateStatus.QualifiedAvailable,
        PoolCandidateStatus.QualifiedUnavailable,
        PoolCandidateStatus.QualifiedWithdrew,
        PoolCandidateStatus.PlacedTentative,
        PoolCandidateStatus.PlacedCasual,
        PoolCandidateStatus.PlacedIndeterminate,
        PoolCandidateStatus.PlacedTerm,
        PoolCandidateStatus.Expired, // if the status is expired, they need to have been qualified first.
      ].includes(status),
  );
  return activeApplications.length > 0 ? (
    activeApplications.map((application) => (
      <ApplicationCard key={application.id} poolCandidateQuery={application} />
    ))
  ) : (
    <Well data-h2-margin="base(x1 0)" data-h2-text-align="base(center)">
      <p data-h2-margin="base(0, 0, x1, 0)" data-h2-font-weight="base(bold)">
        {intl.formatMessage({
          defaultMessage:
            "There aren't any active recruitment processes on your profile right now.",
          id: "p0KALn",
          description:
            "Message displayed in recruitment availability when the user is not in any valid pools",
        })}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Recruitment processes will appear here automatically as you're admitted into them. You can start the process by applying to available opportunities on the <link>browse jobs page</link>.",
            id: "hAN/NC",
            description:
              "Additional message displayed in recruitment availability when the user is not in any valid pools",
          },
          {
            link: (chunks: ReactNode) =>
              inlineLink(paths.browsePools(), chunks),
          },
        )}
      </p>
    </Well>
  );
};

export default RecruitmentAvailability;
