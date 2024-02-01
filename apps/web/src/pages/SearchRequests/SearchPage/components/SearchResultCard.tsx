import * as React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Button, Link, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import { Pool } from "~/api/generated";
import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

const testId = (text: React.ReactNode) => (
  <span data-testid="candidateCount">{text}</span>
);

export interface SearchResultCardProps {
  candidateCount: number;
  pool: Pool;
}

const SearchResultCard = ({ candidateCount, pool }: SearchResultCardProps) => {
  const intl = useIntl();
  const { register, setValue } = useFormContext();
  const poolSubmitProps = register("pool");
  const paths = useRoutes();
  const departments = pool?.team?.departments
    ?.filter(notEmpty)
    .map((department) => getLocalizedName(department.name, intl));

  return (
    <article
      data-h2-background-color="base(foreground)"
      data-h2-shadow="base(larger)"
      data-h2-border-left="base(x.5 solid secondary)"
      data-h2-margin="base(x1, 0, 0, 0)"
      data-h2-radius="base(0, s, s, 0)"
      data-h2-padding="base(x1)"
      aria-labelledby={`search_pool_${pool.id}`}
    >
      <p
        data-h2-font-size="base(h6)"
        data-h2-font-weight="base(700)"
        id={`search_pool_${pool.id}`}
      >
        {getFullPoolTitleHtml(intl, pool)}
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
            departments: departments
              ? departments.join(", ")
              : intl.formatMessage({
                  defaultMessage: "Treasury Board of Canada Secretariat",
                  id: "SZ2DsZ",
                  description: "Default department for pool",
                }),
          },
        )}
        .
      </p>
      <p data-h2-margin="base(x1, 0, x.25, 0)" data-h2-font-weight="base(700)">
        {intl.formatMessage({
          defaultMessage:
            "These essential skills were assessed during the process:",
          id: "VN6uCI",
          description:
            "Text showing the essentials skills assessed during the process",
        })}
      </p>
      <p
        data-h2-display="base(flex)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-gap="base(x.125)"
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
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage(
          {
            defaultMessage: `{candidateCount, plural,
              one {There is approximately <strong><testId>{candidateCount}</testId></strong> matching candidate in this pool.}
              other {There are approximately <strong><testId>{candidateCount}</testId></strong> matching candidates in this pool.}
            }`,
            id: "JZk4NZ",
            description:
              "Message for total estimated matching candidates in pool",
          },
          {
            testId,
            candidateCount,
          },
        )}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(row)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(x1)"
        data-h2-margin="base(x1, 0, 0, 0)"
      >
        <Button
          color="secondary"
          type="submit"
          {...poolSubmitProps}
          value={pool.id}
          onClick={() => {
            setValue("pool", pool.id);
            setValue("count", candidateCount);
          }}
        >
          {intl.formatMessage({
            defaultMessage: "Request candidates",
            id: "3BfvIy",
            description:
              "Button link message on search page that takes user to the request form.",
          })}
        </Button>
        <Link
          mode="inline"
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
        </Link>
      </div>
    </article>
  );
};

export default SearchResultCard;
