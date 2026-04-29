import RocketLaunchIcon from "@heroicons/react/24/outline/ArchiveBoxIcon";
import { useIntl } from "react-intl";

import { Heading, Ul } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import JobCard from "~/components/JobCard/JobCard";

export const ClosedJobOpportunitiesSectionPool_Fragment = graphql(
  /* GraphQL */ `
    fragment ClosedJobOpportunitiesSectionPool on Pool {
      id
      closingDate
      publishedAt
      ...JobCard
    }
  `,
);

export interface ClosedJobOpportunitiesSectionProps {
  poolsQuery: FragmentType<typeof ClosedJobOpportunitiesSectionPool_Fragment>[];
}

const ClosedJobOpportunitiesSection = ({
  poolsQuery,
}: ClosedJobOpportunitiesSectionProps) => {
  const intl = useIntl();
  const pools = getFragment(
    ClosedJobOpportunitiesSectionPool_Fragment,
    poolsQuery,
  );

  const sortedPools = [...pools].sort(
    (p1, p2) =>
      (p1.closingDate ?? "").localeCompare(p2.closingDate ?? "") || // first level sort: by closing date whichever one closes first should appear first on the list
      (p1.publishedAt ?? "").localeCompare(p2.publishedAt ?? ""), // second level sort: whichever one was published first should appear first
  );

  return (
    <>
      <Heading
        level="h2"
        size="h3"
        icon={RocketLaunchIcon}
        color="secondary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage({
          defaultMessage: "Closed job opportunities",
          id: "0PUTAv",
          description: "Title for the closed jobs recruiting candidates",
        })}
      </Heading>
      <p className="mt-3 mb-6">
        {intl.formatMessage({
          id: "gXBSoI",
          defaultMessage:
            "Here you can find job opportunities that were posted on the platform but are no longer accepting applications.",
          description: "Description of the closed job section",
        })}
      </p>
      {sortedPools.length ? (
        <Ul unStyled className="mt-6">
          {sortedPools.map((pool) => (
            <li key={pool.id}>
              <JobCard poolQuery={pool} />
            </li>
          ))}
        </Ul>
      ) : null}
    </>
  );
};

export default ClosedJobOpportunitiesSection;
