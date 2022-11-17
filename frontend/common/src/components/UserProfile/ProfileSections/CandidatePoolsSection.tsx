import React from "react";
import { useIntl } from "react-intl";
import { getFullPoolAdvertisementTitle } from "../../../helpers/poolUtils";
import Well from "../../Well";
import { unpackMaybes } from "../../../helpers/formUtils";
import type { Applicant } from "../../../api/generated";

interface CandidatePoolsSectionProps {
  applicant: Applicant;
}

const CandidatePoolsSection: React.FC<CandidatePoolsSectionProps> = ({
  applicant,
}) => {
  const intl = useIntl();
  const poolCandidates = unpackMaybes(applicant.poolCandidates);

  return (
    <Well>
      {(!poolCandidates || poolCandidates.length === 0) && (
        <p data-h2-color="base(dt-gray.dark)">
          {intl.formatMessage({
            defaultMessage:
              "You have not been accepted into any hiring pools yet.",
            id: "gWEfA9",
            description: "Message for if user not part of any hiring pools",
          })}
        </p>
      )}
      {poolCandidates &&
        poolCandidates.map((poolCandidate) => (
          <div
            key={poolCandidate?.id}
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(row)"
            data-h2-justify-content="base(space-between)"
            data-h2-padding="base(x1, 0)"
          >
            <div>
              <p>{getFullPoolAdvertisementTitle(intl, poolCandidate?.pool)}</p>
            </div>
            <div>
              <p>
                {intl.formatMessage({
                  defaultMessage: "ID:",
                  id: "CPRJ61",
                  description: "The ID and colon",
                })}{" "}
                {poolCandidate?.id}
              </p>
            </div>
            <div>
              <p>
                {intl.formatMessage({
                  defaultMessage: "Expiry Date:",
                  id: "ZSAzrR",
                  description: "The expiry date label and colon",
                })}{" "}
                {poolCandidate?.expiryDate}
              </p>
            </div>
          </div>
        ))}
    </Well>
  );
};

export default CandidatePoolsSection;
