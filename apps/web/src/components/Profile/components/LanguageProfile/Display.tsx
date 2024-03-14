import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getEvaluatedLanguageAbility,
  getLanguage,
  getLanguageProficiency,
} from "@gc-digital-talent/i18n";

import FieldDisplay from "../FieldDisplay";
import { PartialUser } from "./types";
import { getExamValidityOptions, getLabels } from "./utils";

interface DisplayProps {
  user: PartialUser;
  context?: "admin" | "default" | "print";
}

const Display = ({
  user: {
    lookingForEnglish,
    lookingForFrench,
    lookingForBilingual,
    firstOfficialLanguage,
    secondLanguageExamCompleted,
    secondLanguageExamValidity,
    estimatedLanguageAbility,
    writtenLevel,
    comprehensionLevel,
    verbalLevel,
  },
  context = "default",
}: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const labels = getLabels(intl);

  return (
    <div
      data-h2-display="base(grid)"
      {...(context !== "print" && { "data-h2-gap": "base(x1)" })}
    >
      <FieldDisplay
        hasError={
          !lookingForEnglish && !lookingForFrench && !lookingForBilingual
        }
        label={labels.consideredPositionLanguages}
        context={context}
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
      {lookingForBilingual && (
        <>
          <FieldDisplay label={labels.firstOfficialLanguage} context={context}>
            {firstOfficialLanguage
              ? intl.formatMessage(getLanguage(firstOfficialLanguage))
              : notProvided}
          </FieldDisplay>
          <FieldDisplay
            label={labels.estimatedLanguageAbility}
            context={context}
          >
            {estimatedLanguageAbility
              ? intl.formatMessage(
                  getLanguageProficiency(estimatedLanguageAbility),
                )
              : notProvided}
          </FieldDisplay>
          {secondLanguageExamCompleted ? (
            <>
              <FieldDisplay
                label={labels.secondLanguageExamCompletedBoundingBoxLabel}
                context={context}
              >
                {secondLanguageExamCompleted
                  ? labels.secondLanguageExamCompletedLabel
                  : notProvided}
              </FieldDisplay>
              <FieldDisplay
                label={labels.secondLanguageExamValidityLabel}
                context={context}
              >
                {secondLanguageExamValidity
                  ? getExamValidityOptions(intl).find(
                      (option) => option.value === "currently_valid",
                    )?.label
                  : notProvided}
              </FieldDisplay>
              <div
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
                data-h2-gap="base(x1, 0) l-tablet(0, x1)"
                {...(context === "print" && { "data-h2-gap": "base(0, 0)" })}
              >
                <FieldDisplay
                  label={labels.comprehensionLevel}
                  context={context}
                >
                  {comprehensionLevel
                    ? intl.formatMessage(
                        getEvaluatedLanguageAbility(comprehensionLevel),
                      )
                    : notProvided}
                </FieldDisplay>
                <FieldDisplay label={labels.writtenLevel} context={context}>
                  {writtenLevel
                    ? intl.formatMessage(
                        getEvaluatedLanguageAbility(writtenLevel),
                      )
                    : notProvided}
                </FieldDisplay>
                <FieldDisplay label={labels.verbalLevel} context={context}>
                  {verbalLevel
                    ? intl.formatMessage(
                        getEvaluatedLanguageAbility(verbalLevel),
                      )
                    : notProvided}
                </FieldDisplay>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Display;
