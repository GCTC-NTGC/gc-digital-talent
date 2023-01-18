import * as React from "react";
import { useIntl } from "react-intl";

import { ScrollToLink } from "@common/components/Link";

import Spinner from "../Spinner";

interface EstimatedCandidatesProps {
  candidateCount: number;
  updatePending?: boolean;
}

const testId = (chunks: React.ReactNode) => (
  <span data-testid="candidateCount">{chunks}</span>
);

const EstimatedCandidates: React.FunctionComponent<
  EstimatedCandidatesProps
> = ({ candidateCount, updatePending }) => {
  const intl = useIntl();

  return (
    <div data-h2-height="base(100%)" data-h2-position="base(relative)">
      <div
        data-h2-padding="base(x3, 0, 0, 0)"
        data-h2-position="base(sticky)"
        data-h2-location="p-tablet(0, auto, auto, auto)"
      >
        <div
          data-h2-background-color="base(dt-white)"
          data-h2-overflow="base(hidden)"
          data-h2-radius="base(s)"
          data-h2-shadow="base(l)"
        >
          <div
            data-h2-background-color="base(dt-secondary)"
            data-h2-padding="base(x1)"
            data-h2-radius="base(s, s, 0, 0)"
          >
            <p
              data-h2-text-align="base(center)"
              data-h2-color="base(dt-white)"
              data-h2-font-size="base(h5, 1.3)"
              data-h2-font-weight="base(700)"
            >
              {intl.formatMessage({
                defaultMessage: "Estimated Candidates",
                id: "09x+E7",
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
            <p>
              {updatePending ? (
                <Spinner />
              ) : (
                <>
                  {intl.formatMessage(
                    {
                      defaultMessage: `{candidateCount, plural,
                        =0 {There are approximately <strong><testId>{candidateCount}</testId></strong> candidates right now who meet your criteria.}
                        =1 {There is approximately <strong><testId>{candidateCount}</testId></strong> candidate right now who meets your criteria.}
                        other {There are approximately <strong><testId>{candidateCount}</testId></strong> candidates right now who meet your criteria.}
                      }`,
                      id: "Bp3HEe",
                      description:
                        "Message for total estimated candidates box next to search form.",
                    },
                    {
                      testId,
                      candidateCount,
                    },
                  )}
                </>
              )}
            </p>
            {candidateCount > 0 && (
              <ScrollToLink
                to="results"
                data-h2-color="base(dt-black) base:hover(dt-primary)"
                data-h2-transition="base:hover(color, .2s, ease, 0s)"
                data-h2-display="base(inline-block)"
                data-h2-margin="base(x1, 0, 0, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "View results",
                  id: "3wbcnZ",
                  description:
                    "A link to view the pools that contain matching talent.",
                })}
              </ScrollToLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimatedCandidates;
