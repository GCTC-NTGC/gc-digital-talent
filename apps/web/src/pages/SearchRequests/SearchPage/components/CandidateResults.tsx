import React from "react";
import { useIntl } from "react-intl";

import { Button, Heading, Separator } from "@gc-digital-talent/ui";

import { SimpleClassification } from "~/types/pool";
import SearchResultCard, {
  type SearchResultCardProps,
} from "./SearchResultCard";

type CandidateResultsProps = SearchResultCardProps;

const CandidateResults = ({
  candidateCount,
  pool,
  handleSubmit,
}: CandidateResultsProps) => {
  const intl = useIntl();

  return candidateCount > 0 ? (
    <div
      data-h2-background-color="base(foreground)"
      data-h2-shadow="base(medium)"
      data-h2-border-left="base(x.5 solid primary)"
      data-h2-margin="base(x.5, 0, 0, 0)"
      data-h2-radius="base(0, s, s, 0)"
    >
      <SearchResultCard
        candidateCount={candidateCount}
        pool={pool}
        handleSubmit={handleSubmit}
      />
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
          defaultMessage: "We can still help!",
          id: "5U+V2Y",
          description:
            "Heading for helping user if no candidates matched the filters chosen.",
        })}
      </Heading>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            "We have not found any automatic matching candidates but our team can still help.",
          id: "ak4oel",
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
        data-h2-background="base(gray.lighter)"
      />

      <Button
        color="secondary"
        mode="outline"
        onClick={() =>
          handleSubmit(
            candidateCount,
            pool.id,
            pool.classifications as SimpleClassification[],
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

export default CandidateResults;
