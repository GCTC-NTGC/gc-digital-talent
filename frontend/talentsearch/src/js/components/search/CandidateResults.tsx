import React from "react";
import { useIntl } from "react-intl";

import { TALENTSEARCH_RECRUITMENT_EMAIL } from "../../talentSearchConstants";
import SearchPools, { type SearchPoolsProps } from "./SearchPools";

type CandidateResultsProps = SearchPoolsProps;

const mailLink = (msg: string) => (
  <a
    href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}
    data-h2-font-weight="base(700)"
  >
    {msg}
  </a>
);

const CandidateResults: React.FC<CandidateResultsProps> = ({
  candidateCount,
  pool,
  poolOwner,
  handleSubmit,
}) => {
  const intl = useIntl();

  return candidateCount > 0 ? (
    <div
      data-h2-shadow="base(m)"
      data-h2-border="base(left, x1, solid, dt-secondary.light)"
      data-h2-margin="base(x.5, 0, x1, 0)"
      data-h2-flex-grid="base(center, 0, x3)"
    >
      <SearchPools
        candidateCount={candidateCount}
        pool={pool}
        poolOwner={poolOwner}
        handleSubmit={handleSubmit}
      />
    </div>
  ) : (
    <div
      data-h2-shadow="base(m)"
      data-h2-margin="base(x.5, 0, x1, 0)"
      data-h2-padding="base(x.25, 0, x.25, x.5)"
      data-h2-border="base(left, x1, solid, dt-gray.dark)"
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "We can still help!",
          description:
            "Heading for helping user if no candidates matched the filters chosen.",
        })}
      </p>
      <p data-h2-margin="base(x.125, 0, 0, 0)" data-h2-font-size="base(caption)">
        {intl.formatMessage(
          {
            defaultMessage:
              "If there are no matching candidates <a>Get in touch!</a>",
            description:
              "Message for helping user if no candidates matched the filters chosen.",
          },
          {
            a: mailLink,
          },
        )}
      </p>
    </div>
  );
};

export default CandidateResults;
