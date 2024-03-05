import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getBilingualEvaluation,
  getLanguageProficiency,
} from "@gc-digital-talent/i18n";
import { BilingualEvaluation } from "@gc-digital-talent/graphql";

import { getEvaluatedLanguageLevels } from "~/utils/userUtils";

import FieldDisplay from "../FieldDisplay";
import { PartialUser } from "./types";

interface DisplayProps {
  user: PartialUser;
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
                    "I would like to be considered for English positions.",
                  id: "HYSPug",
                  description: "English Positions message",
                })}
              </li>
            )}
            {lookingForFrench && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be considered for French positions.",
                  id: "xff04x",
                  description: "French Positions message",
                })}
              </li>
            )}
            {lookingForBilingual && (
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "I would like to be considered for bilingual positions (English and French).",
                  id: "ak4twG",
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
              "Second language level (reading, writing, oral interaction)",
            id: "qOi2J0",
            description:
              "Second language level (reading, writing, oral interaction) label",
          })}
        >
          {comprehensionLevel || writtenLevel || verbalLevel
            ? getEvaluatedLanguageLevels(
                intl,
                comprehensionLevel,
                writtenLevel,
                verbalLevel,
              )
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
