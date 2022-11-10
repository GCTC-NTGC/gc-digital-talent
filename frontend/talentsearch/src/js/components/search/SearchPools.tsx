import { Button } from "@common/components";
import { getLocale } from "@common/helpers/localize";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import * as React from "react";
import { useIntl } from "react-intl";
import { Pool } from "../../api/generated";
import { SimpleClassification } from "../../types/poolUtils";

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

const SearchPools: React.FunctionComponent<SearchPoolsProps> = ({
  candidateCount,
  pool,
  handleSubmit,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const selectedClassifications =
    pool.classifications as SimpleClassification[];

  return (
    <div data-h2-padding="base(x1)">
      <p data-h2-font-weight="base(700)">{pool?.name?.[locale]}</p>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage(
          {
            defaultMessage: `{candidateCount, plural,
              one {There is <strong><testId>{candidateCount}</testId></strong> matching candidate in this pool}
              other {There are <strong><testId>{candidateCount}</testId></strong> matching candidates in this pool}
            }`,
            id: "bbso+7",
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
        color="cta"
        mode="solid"
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
    </div>
  );
};

export default SearchPools;
