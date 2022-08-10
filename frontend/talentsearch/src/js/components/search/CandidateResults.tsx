import React from "react";
import { useIntl } from "react-intl";

import { TALENTSEARCH_RECRUITMENT_EMAIL } from "../../talentSearchConstants";
import SearchPools, { type SearchPoolsProps } from "./SearchPools";

type CandidateResultsProps = SearchPoolsProps;

const mailLink = (msg: string) => (
  <a
    href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}
    data-h2-font-weight="b(700)"
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
      data-h2-shadow="b(m)"
      data-h2-border="b(lightnavy, left, solid, l)"
      data-h2-margin="b(top, s) b(bottom, m)"
      data-h2-flex-grid="b(middle, contained, flush, xl)"
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
      data-h2-shadow="b(m)"
      data-h2-margin="b(top, s) b(bottom, m)"
      data-h2-padding="b(top-bottom, xs) b(left, s)"
      data-h2-border="b(darkgray, left, solid, l)"
    >
      <p data-h2-margin="b(bottom, none)">
        {intl.formatMessage({
          defaultMessage: "We can still help!",
          description:
            "Heading for helping user if no candidates matched the filters chosen.",
        })}
      </p>
      <p data-h2-margin="b(top, xxs)" data-h2-font-size="b(caption)">
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
