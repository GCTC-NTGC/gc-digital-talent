import * as React from "react";
import { useIntl } from "react-intl";

import { PoolCandidateStatus, User } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Link, Well } from "@gc-digital-talent/ui";

import ApplicationCard from "~/components/ApplicationCard/ApplicationCard";
import useRoutes from "~/hooks/useRoutes";

const inlineLink = (href: string, chunks: React.ReactNode) => (
  <Link href={href} color="black">
    {chunks}
  </Link>
);

const RecruitmentAvailability = ({ user }: { user: User }) => {
  const intl = useIntl();
  const paths = useRoutes();

  const activeApplications = unpackMaybes(user.poolCandidates).filter(
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
        PoolCandidateStatus.Expired,
      ].includes(status),
  );
  return activeApplications.length > 0 ? (
    activeApplications.map((application) => (
      <ApplicationCard key={application.id} application={application} />
    ))
  ) : (
    <Well data-h2-margin="base(x1 0)" data-h2-text-align="base(center)">
      <p data-h2-margin="base(0, 0, x1, 0)" data-h2-font-weight="base(bold)">
        {intl.formatMessage({
          defaultMessage:
            "There aren't any recruitment processes on your profile yet.",
          id: "xCJW2N",
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
            link: (chunks: React.ReactNode) =>
              inlineLink(paths.browsePools(), chunks),
          },
        )}
      </p>
    </Well>
  );
};

export default RecruitmentAvailability;
