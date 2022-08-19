import React from "react";
import { useIntl } from "react-intl";
import { Applicant, BilingualEvaluation } from "../../../api/generated";
import messages from "../../../messages/commonMessages";
import {
  getBilingualEvaluation,
  getLanguageProficiency,
} from "../../../constants/localizedConstants";

const LanguageInformationSection: React.FunctionComponent<{
  applicant: Pick<
    Applicant,
    | "lookingForEnglish"
    | "lookingForFrench"
    | "lookingForBilingual"
    | "bilingualEvaluation"
    | "estimatedLanguageAbility"
    | "writtenLevel"
    | "comprehensionLevel"
    | "verbalLevel"
  >;
  editPath?: string;
}> = ({ applicant, editPath }) => {
  const intl = useIntl();

  const {
    lookingForEnglish,
    lookingForFrench,
    lookingForBilingual,
    bilingualEvaluation,
    estimatedLanguageAbility,
    writtenLevel,
    comprehensionLevel,
    verbalLevel,
  } = applicant;

  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(all, m)"
      data-h2-radius="b(s)"
    >
      {lookingForEnglish && !lookingForFrench && !lookingForBilingual && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Interested in:",
            description: "Interested in label and colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {intl.formatMessage({
              defaultMessage: "English positions",
              description: "English Positions message",
            })}
          </span>
        </p>
      )}
      {!lookingForEnglish && lookingForFrench && !lookingForBilingual && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Interested in:",
            description: "Interested in label and colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {intl.formatMessage({
              defaultMessage: "French positions",
              description: "French Positions message",
            })}
          </span>
        </p>
      )}
      {lookingForEnglish && lookingForFrench && !lookingForBilingual && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Interested in:",
            description: "Interested in label and colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {intl.formatMessage({
              defaultMessage: "English or French positions",
              description: "English or French Positions message",
            })}
          </span>
        </p>
      )}
      {lookingForBilingual && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Interested in:",
            description: "Interested in label and colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {intl.formatMessage({
              defaultMessage: "Bilingual positions (English and French)",
              description: "Bilingual Positions message",
            })}
          </span>
        </p>
      )}
      {bilingualEvaluation && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Completed an official GoC evaluation:",
            description:
              "Completed a government of canada abbreviation evaluation label and colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {intl.formatMessage(getBilingualEvaluation(bilingualEvaluation))}
          </span>
        </p>
      )}
      {(bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
        bilingualEvaluation === BilingualEvaluation.CompletedFrench) && (
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Second language level (Comprehension, Written, Verbal):",
            description:
              "Evaluation results for second language, results in that order followed by a colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {comprehensionLevel}, {writtenLevel}, {verbalLevel}
          </span>
        </p>
      )}
      {bilingualEvaluation === BilingualEvaluation.NotCompleted &&
        !!estimatedLanguageAbility && (
          <p>
            {intl.formatMessage({
              defaultMessage: "Second language level:",
              description:
                "Estimated skill in second language, followed by a colon",
            })}{" "}
            <span data-h2-font-weight="b(700)">
              {estimatedLanguageAbility
                ? intl.formatMessage(
                    getLanguageProficiency(estimatedLanguageAbility),
                  )
                : ""}
            </span>
          </p>
        )}
      {!lookingForEnglish &&
        !lookingForFrench &&
        !lookingForBilingual &&
        !bilingualEvaluation &&
        editPath && (
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven't added any information here yet.",
              description: "Message for when no data exists for the section",
            })}
          </p>
        )}
      {((!lookingForEnglish && !lookingForFrench && !lookingForBilingual) ||
        (lookingForBilingual &&
          (!bilingualEvaluation ||
            ((bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
              bilingualEvaluation === BilingualEvaluation.CompletedFrench) &&
              (!comprehensionLevel || !writtenLevel || !verbalLevel))))) && (
        <p>
          {editPath && (
            <>
              {intl.formatMessage(messages.requiredFieldsMissing)}{" "}
              <a href={editPath}>
                {intl.formatMessage({
                  defaultMessage: "Edit your language information options.",
                  description:
                    "Link text to edit language information on profile.",
                })}
              </a>
            </>
          )}
          {!editPath && (
            <>
              {intl.formatMessage({
                defaultMessage: "No information has been provided.",
                description:
                  "Message on Admin side when user not filled language section.",
              })}
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default LanguageInformationSection;
