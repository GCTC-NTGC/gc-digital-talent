import React from "react";
import { useIntl } from "react-intl";

import {
  CandidateSearchPoolResult,
  ClassificationFilterInput,
} from "@gc-digital-talent/graphql";
import { Button, Heading, Loading, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { SimpleClassification } from "~/types/pool";

import CandidateResults from "./CandidateResults";

interface ResultsDisplayProps {
  pending: boolean;
  totalCandidateCount: number;
  selectedClassifications?: ClassificationFilterInput[];
  results?: Array<CandidateSearchPoolResult>;
  handleSubmit: (
    candidateCount: number,
    poolId: string | null,
    selectedClassifications: SimpleClassification[],
  ) => Promise<void>;
}

const ResultsDisplay = ({
  pending,
  results,
  handleSubmit,
  totalCandidateCount,
  selectedClassifications,
}: ResultsDisplayProps) => {
  const intl = useIntl();

  if (pending) {
    return (
      <Loading inline>{intl.formatMessage(commonMessages.searching)}</Loading>
    );
  }

  return results && results.length ? (
    <div>
      {results.map(({ pool, candidateCount }) => (
        <CandidateResults
          key={pool.id}
          candidateCount={candidateCount}
          pool={pool}
          handleSubmit={handleSubmit}
        />
      ))}
    </div>
  ) : (
    <div
      data-h2-background="base(foreground)"
      data-h2-shadow="base(medium)"
      data-h2-margin="base(x.5, 0, 0, 0)"
      data-h2-padding="base(x1)"
      data-h2-border-left="base(x.5 solid primary)"
      data-h2-radius="base(0, s, s, 0)"
    >
      <Heading level="h4" size="h6" data-h2-margin="base(0)">
        {intl.formatMessage({
          defaultMessage: "We may be able to help!",
          id: "xAfVa9",
          description:
            "Heading for helping user if no candidates matched the filters chosen.",
        })}
      </Heading>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            "We have not found any automatic matching candidates but our team may still be able to help.",
          id: "bq1MMd",
          description:
            "Text telling users they can still be helped regardless of search results",
        })}
      </p>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            "The Digital Community Management office is interested in helping you find the right talent.",
          id: "JUejJU",
          description:
            "Text telling users that Digital Community Management can still help them",
        })}
      </p>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            'Submit this request "as-is" and we\'ll get back to you.',
          id: "pvQVVh",
          description:
            "Instructions telling the user to submit a request even though there are no candidates",
        })}
      </p>

      <Separator
        orientation="horizontal"
        data-h2-margin="base(x1 0)"
        data-h2-background="base(black.30)"
      />

      <Button
        color="secondary"
        onClick={() =>
          handleSubmit(
            totalCandidateCount,
            null,
            selectedClassifications as SimpleClassification[],
          )
        }
      >
        {intl.formatMessage({
          defaultMessage: "Request candidates",
          id: "3BfvIy",
          description:
            "Button link message on search page that takes user to the request form.",
        })}
      </Button>
    </div>
  );
};

export default ResultsDisplay;
