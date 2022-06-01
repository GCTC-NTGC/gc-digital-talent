import React from "react";
import { useIntl } from "react-intl";

import { unpackMaybes } from "../../../helpers/formUtils";
import type { Applicant } from "../../../api/generated";
import { getLocale } from "../../../helpers/localize";

interface CandidatePoolsSectionProps {
  applicant: Applicant;
}

const CandidatePoolsSection: React.FC<CandidatePoolsSectionProps> = ({
  applicant,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const poolCandidates = unpackMaybes(applicant.poolCandidates);
  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {(!poolCandidates || poolCandidates.length === 0) && (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "You have not been accepted into any hiring pools yet.",
            description: "Message for if user not part of any hiring pools",
          })}
        </p>
      )}
      {poolCandidates &&
        poolCandidates.map((poolCandidate) => (
          <div
            key={poolCandidate?.id}
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(row)"
            data-h2-justify-content="b(space-between)"
            data-h2-padding="b(top-bottom, m)"
          >
            <div>
              <p>{poolCandidate?.pool?.name?.[locale]}</p>
            </div>
            <div>
              <p>
                {intl.formatMessage({
                  defaultMessage: "ID:",
                  description: "The ID and colon",
                })}{" "}
                {poolCandidate?.id}
              </p>
            </div>
            <div>
              <p>
                {intl.formatMessage({
                  defaultMessage: "Expiry Date:",
                  description: "The expiry date label and colon",
                })}{" "}
                {poolCandidate?.expiryDate}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CandidatePoolsSection;
