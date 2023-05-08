import * as React from "react";
import { useIntl } from "react-intl";

import { Button } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import { getFullNameHtml } from "~/utils/nameUtils";
import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import { SimpleClassification } from "~/types/pool";
import { Pool } from "~/api/generated";

const testId = (text: React.ReactNode) => (
  <span data-testid="candidateCount">{text}</span>
);

export interface SearchPoolsProps {
  candidateCount: number;
  pool: Pick<Pool, "id" | "owner" | "name" | "description" | "classifications">;
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
      <p data-h2-margin="base(x1, 0, 0, 0)">
        {intl.formatMessage(
          {
            defaultMessage: "Pool Owner: {name}",
            id: "o+a0IN",
            description: "Text showing the owner of the HR pool.",
          },
          {
            name: pool?.owner
              ? getFullNameHtml(
                  pool?.owner.firstName,
                  pool?.owner.lastName,
                  intl,
                )
              : intl.formatMessage({
                  defaultMessage: "N/A",
                  id: "AauSuA",
                  description: "Not available message.",
                }),
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
