import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Card, Loading, ScrollToLink } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

const testId = (chunks: ReactNode) => (
  <span data-testid="candidateCount">{chunks}</span>
);
interface CandidateMessageProps {
  candidateCount: number;
}

const CandidateMessage = ({ candidateCount }: CandidateMessageProps) => {
  const intl = useIntl();

  return candidateCount ? (
    <p className="mb-3">
      {intl.formatMessage(
        {
          defaultMessage: `{candidateCount, plural,
          =0 {There are approximately <strong><testId>#</testId></strong> candidates right now who meet your criteria.}
          one {There is approximately <strong><testId>#</testId></strong> candidate right now who meets your criteria.}
          other {There are approximately <strong><testId>#</testId></strong> candidates right now who meet your criteria.}
        }`,
          id: "wZKKk1",
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
      <p className="mb-3">
        {intl.formatMessage({
          defaultMessage: "We didn't find any matching candidates.",
          id: "8R2XpK",
          description:
            "Text telling users that their search produced no candidates",
        })}
      </p>
      <p className="my-3 font-bold">
        {intl.formatMessage({
          defaultMessage:
            "However, we have candidates in our talent database who haven't been assessed yet but may meet your needs.",
          id: "llGBZI",
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
    <div className="relative h-full">
      <div className="sticky pt-18 xs:top-6">
        <Card className="overflow-hidden text-center">
          <div className="-m-6 mb-6 bg-primary p-6">
            <p className="text-center text-lg font-bold text-black lg:text-xl">
              {intl.formatMessage({
                defaultMessage: "Estimated candidates",
                id: "2dkgQe",
                description:
                  "Heading for total estimated candidates box next to search form.",
              })}
            </p>
          </div>
          {updatePending ? (
            <Loading inline>
              {intl.formatMessage(commonMessages.searching)}
            </Loading>
          ) : (
            <>
              <CandidateMessage candidateCount={candidateCount} />
              <p>
                <ScrollToLink to="results" color="black" mode="inline">
                  {candidateCount
                    ? intl.formatMessage({
                        defaultMessage: "View results",
                        id: "3wbcnZ",
                        description:
                          "A link to view the pools that contain matching talent.",
                      })
                    : intl.formatMessage({
                        defaultMessage:
                          "Submit an empty request and we will try to help.",
                        id: "9qzCX/",
                        description:
                          "Link text to scroll to the submit button when no candidates were found",
                      })}
                </ScrollToLink>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EstimatedCandidates;
