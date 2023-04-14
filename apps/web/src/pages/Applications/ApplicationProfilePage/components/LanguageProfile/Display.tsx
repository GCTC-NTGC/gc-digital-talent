import React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";
import {
  getBilingualEvaluation,
  getLanguageProficiency,
} from "@gc-digital-talent/i18n";

import { BilingualEvaluation } from "~/api/generated";

import ProfileLabel from "../ProfileLabel";

interface DisplayProps {
  user: User;
}

const Display = ({
  user: {
    lookingForEnglish,
    lookingForFrench,
    lookingForBilingual,
    bilingualEvaluation,
    estimatedLanguageAbility,
    writtenLevel,
    comprehensionLevel,
    verbalLevel,
  },
}: DisplayProps) => {
  const intl = useIntl();

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      data-h2-gap="base(x1)"
    >
      {lookingForEnglish && !lookingForFrench && !lookingForBilingual && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Interested in:",
              id: "TmCffZ",
              description: "Interested in label and colon",
            })}
          </ProfileLabel>
          <span>
            {intl.formatMessage({
              defaultMessage: "English positions",
              id: "vFMPHW",
              description: "English Positions message",
            })}
          </span>
        </p>
      )}
      {!lookingForEnglish && lookingForFrench && !lookingForBilingual && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Interested in:",
              id: "TmCffZ",
              description: "Interested in label and colon",
            })}
          </ProfileLabel>
          <span>
            {intl.formatMessage({
              defaultMessage: "French positions",
              id: "qT9sS0",
              description: "French Positions message",
            })}
          </span>
        </p>
      )}
      {lookingForEnglish && lookingForFrench && !lookingForBilingual && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Interested in:",
              id: "TmCffZ",
              description: "Interested in label and colon",
            })}
          </ProfileLabel>
          <span>
            {intl.formatMessage({
              defaultMessage: "English or French positions",
              id: "fFznH0",
              description: "English or French Positions message",
            })}
          </span>
        </p>
      )}
      {lookingForBilingual && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Interested in:",
              id: "TmCffZ",
              description: "Interested in label and colon",
            })}
          </ProfileLabel>
          <span>
            {intl.formatMessage({
              defaultMessage: "Bilingual positions (English and French)",
              id: "6eCvv1",
              description: "Bilingual Positions message",
            })}
          </span>
        </p>
      )}
      {bilingualEvaluation && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage: "Completed an official GoC evaluation:",
              id: "shPV27",
              description:
                "Completed a government of canada abbreviation evaluation label and colon",
            })}
          </ProfileLabel>
          <span>
            {intl.formatMessage(getBilingualEvaluation(bilingualEvaluation))}
          </span>
        </p>
      )}
      {(bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
        bilingualEvaluation === BilingualEvaluation.CompletedFrench) && (
        <p>
          <ProfileLabel>
            {intl.formatMessage({
              defaultMessage:
                "Second language level (Comprehension, Written, Verbal):",
              id: "D7Qb41",
              description:
                "Evaluation results for second language, results in that order followed by a colon",
            })}
          </ProfileLabel>
          <span>
            {comprehensionLevel}, {writtenLevel}, {verbalLevel}
          </span>
        </p>
      )}
      {bilingualEvaluation === BilingualEvaluation.NotCompleted &&
        !!estimatedLanguageAbility && (
          <p>
            <ProfileLabel>
              {intl.formatMessage({
                defaultMessage: "Second language level:",
                id: "q3Gl23",
                description:
                  "Estimated skill in second language, followed by a colon",
              })}
            </ProfileLabel>
            <span>
              {estimatedLanguageAbility
                ? intl.formatMessage(
                    getLanguageProficiency(estimatedLanguageAbility),
                  )
                : null}
            </span>
          </p>
        )}
    </div>
  );
};

export default Display;
