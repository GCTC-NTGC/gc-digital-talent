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
    <div data-h2-display="base(grid)" data-h2-gap="base(x1)">
      <FieldDisplay
        hasError={
          !lookingForEnglish && !lookingForFrench && !lookingForBilingual
        }
        label={intl.formatMessage({
          defaultMessage: "Job languages",
          id: "/MMizV",
          description: "Opportunity languages label",
        })}
      >
        {lookingForEnglish || lookingForFrench || lookingForBilingual ? (
          <ul>
            {lookingForEnglish && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be considered for English positions",
                  id: "vmj/E4",
                  description: "English Positions message",
                })}
              </li>
            )}
            {lookingForFrench && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be considered for French positions",
                  id: "sWBbdX",
                  description: "French Positions message",
                })}
              </li>
            )}
            {lookingForBilingual && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be considered for bilingual positions (English and French)",
                  id: "jx7Sf1",
                  description: "Bilingual Positions message",
                })}
              </li>
            )}
          </ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
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
    </div>
  );
};

export default Display;
