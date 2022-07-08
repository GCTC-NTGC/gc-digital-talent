import * as React from "react";
import { useIntl } from "react-intl";
import Spinner from "../Spinner";

interface EstimatedCandidatesProps {
  candidateCount: number;
  updatePending?: boolean;
}

const weight = (msg: string) => (
  <span data-h2-font-weight="b(800)" data-testid="candidateCount">
    {msg}
  </span>
);

const EstimatedCandidates: React.FunctionComponent<
  EstimatedCandidatesProps
> = ({ candidateCount, updatePending }) => {
  const intl = useIntl();

  return (
    <div data-h2-height="b(100%)">
      <div
        data-h2-position="b(sticky)"
        data-h2-offset="p-tablet(x3, auto, auto, auto)">
        <div
          data-h2-background-color="b(dt-white)"
          data-h2-overflow="b(hidden, all)"
          data-h2-radius="b(10px)"
          data-h2-shadow="b(l)"
        >
          <div
            data-h2-background-color="b(dt-secondary)"
            data-h2-padding="b(x1)"
          >
            <p
              data-h2-color="b(dt-white)"
              data-h2-font-size="b(h5, 1.3)"
              data-h2-font-weight="b(700)"
            >
              {intl.formatMessage({
                defaultMessage: "Estimated Candidates",
                description:
                  "Heading for total estimated candidates box next to search form.",
              })}
            </p>
          </div>
          <div
            data-h2-padding="b(x1)"
            aria-live="polite"
          >
            <p data-h2-text-align="b(center)">
              {updatePending ? (
                <Spinner />
              ) : (
                <>
                  {intl.formatMessage(
                    {
                      defaultMessage: `{candidateCount, plural,
                          one {There is approximately <weight>{candidateCount}</weight> candidate right now who meets your criteria.}
                          other {There are approximately <weight>{candidateCount}</weight> candidates right now who meet your criteria.}
                        }`,
                      description:
                        "Message for total estimated candidates box next to search form.",
                    },
                    {
                      weight,
                      candidateCount,
                    },
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatedCandidates;
