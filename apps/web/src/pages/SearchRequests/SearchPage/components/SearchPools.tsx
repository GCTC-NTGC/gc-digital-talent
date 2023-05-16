import * as React from "react";
import { useIntl } from "react-intl";

import { Button, ExternalLink, Link, Pill } from "@gc-digital-talent/ui";
import { getLocale, getLocalizedName } from "@gc-digital-talent/i18n";

import { getFullNameHtml } from "~/utils/nameUtils";
import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import { SimpleClassification } from "~/types/pool";
import { Pool } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import { intlFormat } from "date-fns/esm";
import { PoolAdvertisement } from "@gc-digital-talent/graphql";

const testId = (text: React.ReactNode) => (
  <span data-testid="candidateCount">{text}</span>
);

export interface SearchPoolsProps {
  candidateCount: number;
  pool: Pick<
    PoolAdvertisement,
    | "id"
    | "owner"
    | "name"
    | "description"
    | "classifications"
    | "team"
    | "essentialSkills"
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
  const locale = getLocale(intl);
  const selectedClassifications =
    pool.classifications as SimpleClassification[];
  const paths = useRoutes();
  const team = pool?.team;
  const departmentsArray =
    team?.departments && team?.departments.length > 0
      ? team.departments.map((department) => {
          return getLocalizedName(department?.name, intl);
        })
      : null;
  const skillsArray =
    pool?.essentialSkills && pool?.essentialSkills.length > 0
      ? pool.essentialSkills.map((skill) => {
          return (
            <Pill key={skill.id} color="primary" mode="outline">
              {getLocalizedName(skill?.name, intl)}
            </Pill>
          );
        })
      : null;

  return (
    <article
      data-h2-padding="base(x1)"
      aria-labelledby={`search_pool_${pool.id}`}
    >
      <p data-h2-font-weight="base(700)" id={`search_pool_${pool.id}`}>
        {getFullPoolAdvertisementTitleHtml(intl, pool)}
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
        {" "}
        <ExternalLink
          mode="inline"
          type="button"
          color="secondary"
          href={paths.pool(pool.id || "")}
          newTab
        >
          {intl.formatMessage({
            defaultMessage: " View the job poster for this recruitment process",
            id: "UvdxsU",
            description:
              "Link message that shows the job poster for the recruitment process.",
          })}
        </ExternalLink>
      </p>
      <p data-h2-margin="base(x1, 0, 0, 0)">
        {intl.formatMessage({
          defaultMessage:
            "These essentials skills were assessed during the process:",
          id: "NFoOcU",
          description:
            "Text showing the essentials skills assessed during the process",
        })}
      </p>
      <p>{skillsArray}</p>
      <p data-h2-margin="base(x1, 0, 0, 0)">
        {intl.formatMessage(
          {
            defaultMessage: "Process run by {team} at {departments}",
            id: "sXLDU4",
            description: "Text showing the owner of the HR pool.",
          },
          {
            team: pool?.team
              ? getLocalizedName(pool.team.displayName, intl)
              : intl.formatMessage({
                  defaultMessage: "N/A",
                  id: "AauSuA",
                  description: "Not available message.",
                }),
            departments: departmentsArray?.flat().join(" and "),
          },
        )}
      </p>

      <p data-h2-margin="base(x1, 0)">{pool?.description?.[locale]}</p>
      <Button
        color="secondary"
        mode="outline"
        onClick={() =>
          handleSubmit(candidateCount, pool.id, selectedClassifications)
        }
      >
        {intl.formatMessage({
          defaultMessage: "Request Candidates",
          id: "6mDW+R",
          description:
            "Button link message on search page that takes user to the request form.",
        })}
      </Button>
    </article>
  );
};

export default SearchPools;
