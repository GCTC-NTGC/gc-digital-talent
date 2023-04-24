import React from "react";
import { useIntl } from "react-intl";

import { User } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getBilingualEvaluation,
  getLanguageProficiency,
} from "@gc-digital-talent/i18n";

import { BilingualEvaluation } from "~/api/generated";

import FieldDisplay from "../FieldDisplay";
import DisplayColumn from "../DisplayColumn";

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
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      data-h2-grid-template-rows="p-tablet(repeat(2, 1fr))"
      data-h2-gap="base(x1)"
    >
      <DisplayColumn>
        <FieldDisplay
          hasError={
            !lookingForEnglish && !lookingForFrench && !lookingForBilingual
          }
          label={intl.formatMessage({
            defaultMessage: "Opportunity languages",
            id: "+gl4rv",
            description: "Opportunity languages label",
          })}
        >
          {!lookingForEnglish &&
            !lookingForFrench &&
            !lookingForBilingual &&
            notProvided}
          {lookingForEnglish &&
            !lookingForFrench &&
            !lookingForBilingual &&
            intl.formatMessage({
              defaultMessage: "English positions",
              id: "vFMPHW",
              description: "English Positions message",
            })}
          {!lookingForEnglish &&
            lookingForFrench &&
            !lookingForBilingual &&
            intl.formatMessage({
              defaultMessage: "French positions",
              id: "qT9sS0",
              description: "French Positions message",
            })}
          {lookingForEnglish &&
            lookingForFrench &&
            !lookingForBilingual &&
            intl.formatMessage({
              defaultMessage: "English or French positions",
              id: "fFznH0",
              description: "English or French Positions message",
            })}
          {lookingForBilingual &&
            intl.formatMessage({
              defaultMessage: "Bilingual positions (English and French)",
              id: "6eCvv1",
              description: "Bilingual Positions message",
            })}
        </FieldDisplay>
      </DisplayColumn>
      <div /> {/** Note: Spacer div, please do not remove */}
      <DisplayColumn>
        <FieldDisplay
          hasError={
            lookingForBilingual &&
            (!bilingualEvaluation ||
              ((bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
                bilingualEvaluation === BilingualEvaluation.CompletedFrench) &&
                (!comprehensionLevel || !writtenLevel || !verbalLevel)))
          }
          label={intl.formatMessage({
            defaultMessage: "Language evaluation",
            id: "43xNhn",
            description: "Language evaluation label",
          })}
        >
          {bilingualEvaluation
            ? intl.formatMessage(getBilingualEvaluation(bilingualEvaluation))
            : notProvided}
        </FieldDisplay>
        {(bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
          bilingualEvaluation === BilingualEvaluation.CompletedFrench) && (
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage:
                "Second language level (Comprehension, Written, Verbal)",
              id: "zF0F6w",
              description:
                "Second language level (Comprehension, Written, Verbal) label",
            })}
          >
            {comprehensionLevel || writtenLevel || verbalLevel
              ? `${comprehensionLevel}, ${writtenLevel}, ${verbalLevel}`
              : notProvided}
          </FieldDisplay>
        )}
      </DisplayColumn>
      <DisplayColumn>
        {bilingualEvaluation === BilingualEvaluation.NotCompleted &&
          !!estimatedLanguageAbility && (
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Second language proficiency",
                id: "IexFo4",
                description: "Second language proficiency label",
              })}
            >
              {estimatedLanguageAbility
                ? intl.formatMessage(
                    getLanguageProficiency(estimatedLanguageAbility),
                  )
                : notProvided}
            </FieldDisplay>
          )}
      </DisplayColumn>
    </div>
  );
};

export default Display;
