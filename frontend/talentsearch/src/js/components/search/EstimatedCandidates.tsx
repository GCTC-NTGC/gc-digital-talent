import * as React from "react";
import { useIntl } from "react-intl";

interface EstimatedCandidatesProps {
  candidateCount: number;
  updatePending?: boolean;
}

const EstimatedCandidates: React.FunctionComponent<
  EstimatedCandidatesProps
> = ({ candidateCount, updatePending }) => {
  const intl = useIntl();
  const [pluralizedWord, setPluralizedWord] = React.useState("candidates");

  function weight(msg: string) {
    return updatePending ? (
      <span className="lds-dual-ring" />
    ) : (
      <span data-h2-font-weight="b(800)">{msg}</span>
    );
  }
  React.useEffect(() => {
    if (candidateCount < 2) {
      setPluralizedWord("candidate");
    } else {
      setPluralizedWord("candidates");
    }
  }, [updatePending, candidateCount]);

  return (
    <div
      data-h2-bg-color="b(white)"
      data-h2-border="b(lightgray, all, solid, s)"
      data-h2-shadow="b(m)"
    >
      <div
        data-h2-bg-color="b(linear-70[lightpurple][lightnavy])"
        data-h2-padding="b(top-bottom, s) b(left, s) b(right, s)"
      >
        <p
          data-h2-font-color="b(white)"
          data-h2-font-size="b(h4)"
          data-h2-margin="b(all, none)"
          data-h2-font-weight="b(700)"
        >
          {intl.formatMessage({
            defaultMessage: "Estimated Candidates",
            description:
              "Heading for total estimated candidates box next to search form.",
          })}
        </p>
      </div>
      <div data-h2-margin="b(top-bottom, m) b(right-left, l)">
        <p data-h2-text-align="b(center)">
          {intl.formatMessage(
            {
              defaultMessage:
                "There are approximately <weight>{candidateCount}</weight> {pluralizedWord} right now who meet your criteria.",
              description:
                "Message for total estimated candidates box next to search form.",
            },
            {
              weight,
              candidateCount,
              pluralizedWord,
            },
          )}
        </p>
      </div>
    </div>
  );
};

export default EstimatedCandidates;
