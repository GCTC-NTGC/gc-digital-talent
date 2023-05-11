import * as React from "react";
import { useIntl } from "react-intl";

import { ScrollToLink } from "@gc-digital-talent/ui";

import Spinner from "~/components/Spinner/Spinner";

const testId = (chunks: React.ReactNode) => (
  <span data-testid="candidateCount">{chunks}</span>
);

interface CandidateMessageProps {
  candidateCount: number;
}

const CandidateMessage = ({ candidateCount }: CandidateMessageProps) => {
  const intl = useIntl();

  return candidateCount ? (
    <p data-h2-margin="base(0 0 x.5 0)">
      {intl.formatMessage(
        {
          defaultMessage: `{candidateCount, plural,
          =0 {There are approximately <strong><testId>{candidateCount}</testId></strong> candidates right now who meet your criteria.}
          =1 {There is approximately <strong><testId>{candidateCount}</testId></strong> candidate right now who meets your criteria.}
          other {There are approximately <strong><testId>{candidateCount}</testId></strong> candidates right now who meet your criteria.}
        }`,
          id: "xwBt36",
          description:
            "Message for total estimated candidates box next to search form.",
        },
        {
          testId,
          candidateCount,
        },
      )}
    </p>
  ) : (
    <>
      <p data-h2-margin="base(0 0 x.5 0)">
        {intl.formatMessage({
          defaultMessage: "We didn't find any matching candidates.",
          id: "8R2XpK",
          description:
            "Text telling users that their search produced no candidates",
        })}
      </p>
      <p data-h2-font-weight="base(700)" data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage: "We can still help!",
          id: "5U+V2Y",
          description:
            "Heading for helping user if no candidates matched the filters chosen.",
        })}
      </p>
    </>
  );
};

interface EstimatedCandidatesProps {
  candidateCount: number;
  updatePending?: boolean;
}

const EstimatedCandidates = ({
  candidateCount,
  updatePending,
}: EstimatedCandidatesProps) => {
  const intl = useIntl();

  return (
    <div data-h2-height="base(100%)" data-h2-position="base(relative)">
      <div
        data-h2-padding="base(x3, 0, 0, 0)"
        data-h2-position="base(sticky)"
        data-h2-location="p-tablet(0, auto, auto, auto)"
      >
        <div
          data-h2-background-color="base(white)"
          data-h2-overflow="base(hidden)"
          data-h2-radius="base(s)"
          data-h2-shadow="base(l)"
        >
          <div
            data-h2-background-color="base(secondary)"
            data-h2-padding="base(x1)"
            data-h2-radius="base(s, s, 0, 0)"
          >
            <p
              data-h2-text-align="base(center)"
              data-h2-color="base(black)"
              data-h2-font-size="base(h5, 1.3)"
              data-h2-font-weight="base(700)"
            >
              {intl.formatMessage({
                defaultMessage: "Estimated candidates",
                id: "2dkgQe",
                description:
                  "Heading for total estimated candidates box next to search form.",
              })}
            </p>
          </div>
          <div
            data-h2-padding="base(x1)"
            data-h2-radius="base(0, 0, s, s)"
            aria-live="polite"
            data-h2-text-align="base(center)"
          >
            {updatePending ? (
              <div>
                <Spinner />
              </div>
            ) : (
              <CandidateMessage candidateCount={candidateCount} />
            )}
            <p>
              <ScrollToLink
                to="results"
                data-h2-color="base(black) base:hover(primary)"
                data-h2-transition="base:hover(color .2s ease 0s)"
                data-h2-display="base(inline-block)"
              >
                {candidateCount
                  ? intl.formatMessage({
                      defaultMessage: "View results",
                      id: "3wbcnZ",
                      description:
                        "A link to view the pools that contain matching talent.",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "Submit an empty request and tell us more in the comments.",
                      id: "W/cZp2",
                      description:
                        "Link text to scroll to the submit button when no candidates were found",
                    })}
              </ScrollToLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatedCandidates;
