import * as React from "react";
import { useIntl } from "react-intl";

import { Button, ExternalLink, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import { SimpleClassification } from "~/types/pool";
import useRoutes from "~/hooks/useRoutes";
import { Pool } from "@gc-digital-talent/graphql";

const testId = (text: React.ReactNode) => (
  <span data-testid="candidateCount">{text}</span>
);

export interface SearchPoolsProps {
  candidateCount: number;
  pool: Pick<
    Pool,
    "id" | "owner" | "name" | "classifications" | "team" | "essentialSkills"
  >;
  handleSubmit: (
    candidateCount: number,
    poolId: string,
    selectedClassifications: SimpleClassification[],
  ) => Promise<void>;
}

const SearchPools = ({
  candidateCount,
  pool,
  handleSubmit,
}: SearchPoolsProps) => {
  const intl = useIntl();
  const selectedClassifications =
    pool.classifications as SimpleClassification[];
  const paths = useRoutes();
  const team = pool?.team;
  const departmentsArray =
    team?.departments && team?.departments.length > 0
      ? team.departments.map((department) =>
          getLocalizedName(department?.name, intl),
        )
      : null;

  return (
    <article
      data-h2-padding="base(x1)"
      aria-labelledby={`search_pool_${pool.id}`}
    >
      <p data-h2-font-weight="base(700)" id={`search_pool_${pool.id}`}>
        {getFullPoolTitleHtml(intl, pool)}
      </p>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage(
          {
            defaultMessage: `{candidateCount, plural,
              one {There is <strong><testId>{candidateCount}</testId></strong> matching candidate in this pool.}
              other {There are <strong><testId>{candidateCount}</testId></strong> matching candidates in this pool.}
            }`,
            id: "oyFGYC",
            description:
              "Message for total estimated matching candidates in pool",
          },
          {
            testId,
            candidateCount,
          },
        )}
      </p>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        <ExternalLink
          mode="inline"
          type="button"
          color="secondary"
          href={paths.pool(pool.id || "")}
          newTab
        >
          {intl.formatMessage({
            defaultMessage: "View the job poster for this recruitment process",
            id: "2Ljgvn",
            description:
              "Link message that shows the job poster for the recruitment process.",
          })}
        </ExternalLink>
      </p>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "These essential skills were assessed during the process:",
          id: "VN6uCI",
          description:
            "Text showing the essentials skills assessed during the process",
        })}
      </p>
      <p
        data-h2-margin="base(x1, 0, 0, 0)"
        data-h2-display="base(flex)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-gap="base(x.25, x.125)"
      >
        {pool?.essentialSkills && pool?.essentialSkills.length > 0
          ? pool.essentialSkills.map((skill) => (
              <span key={skill.id}>
                <Pill key={skill.id} color="secondary" mode="outline">
                  {getLocalizedName(skill?.name, intl)}
                </Pill>
              </span>
            ))
          : null}
      </p>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage(
          {
            defaultMessage: "Process run by {team} at {departments}",
            id: "e2qUId",
            description: "Team and department of pool",
          },
          {
            team: pool?.team
              ? getLocalizedName(pool.team.displayName, intl)
              : intl.formatMessage({
                  defaultMessage: "Digital Community Management Team",
                  id: "S82O61",
                  description: "Default team for pool",
                }),
            departments: departmentsArray
              ? departmentsArray.join(", ")
              : intl.formatMessage({
                  defaultMessage: "Treasury Board of Canada Secretariat",
                  id: "SZ2DsZ",
                  description: "Default department for pool",
                }),
          },
        )}
      </p>
      <Button
        color="secondary"
        mode="outline"
        onClick={() =>
          handleSubmit(candidateCount, pool.id, selectedClassifications)
        }
      >
        {intl.formatMessage({
          defaultMessage: "Request candidates",
          id: "3BfvIy",
          description:
            "Button link message on search page that takes user to the request form.",
        })}
      </Button>
    </article>
  );
};

export default SearchPools;
