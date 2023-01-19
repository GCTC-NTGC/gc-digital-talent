import React from "react";
import { useIntl } from "react-intl";

import { TALENTSEARCH_RECRUITMENT_EMAIL } from "../../talentSearchConstants";
import SearchPools, { type SearchPoolsProps } from "./SearchPools";

type CandidateResultsProps = SearchPoolsProps;

const mailLink = (chunks: React.ReactNode) => (
  <a
    href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}
    data-h2-font-weight="base(700)"
  >
    {chunks}
  </a>
);

const CandidateResults: React.FC<CandidateResultsProps> = ({
  candidateCount,
  pool,
  handleSubmit,
}) => {
  const intl = useIntl();

  return candidateCount > 0 ? (
    <div
      data-h2-background-color="base(dt-white)"
      data-h2-shadow="base(m)"
      data-h2-border-left="base(x1 solid dt-secondary.light)"
      data-h2-margin="base(x.5, 0, 0, 0)"
      data-h2-radius="base(0, s, s, 0)"
    >
      <SearchPools
        candidateCount={candidateCount}
        pool={pool}
        handleSubmit={handleSubmit}
      />
    </div>
  ) : (
    <div
      data-h2-shadow="base(m)"
      data-h2-margin="base(x.5, 0, 0, 0)"
      data-h2-padding="base(x1)"
      data-h2-border-left="base(x1 solid dt-gray.dark)"
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "We can still help!",
          id: "5U+V2Y",
          description:
            "Heading for helping user if no candidates matched the filters chosen.",
        })}
      </p>
      <p data-h2-margin="base(x.5, 0, 0, 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "If there are no matching candidates <a>Get in touch!</a>",
            id: "+ZXZj+",
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
