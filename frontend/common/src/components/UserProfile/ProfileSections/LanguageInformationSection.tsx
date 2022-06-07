import React from "react";
import { useIntl } from "react-intl";
import { Applicant, BilingualEvaluation } from "../../../api/generated";
import { getLanguageProficiency } from "../../../constants/localizedConstants";

// styling a text bit with red colour within intls
function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
}

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
      {bilingualEvaluation === BilingualEvaluation.CompletedEnglish && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Completed an official GoC evaluation:",
            description:
              "Completed a government of canada abbreviation evaluation label and colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {intl.formatMessage({
              defaultMessage: "Yes, completed English evaluation",
              description: "Completed an English language evaluation",
            })}
          </span>
        </p>
      )}
      {bilingualEvaluation === BilingualEvaluation.CompletedFrench && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Completed an official GoC evaluation:",
            description:
              "Completed a government of canada abbreviation evaluation label and colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {intl.formatMessage({
              defaultMessage: "Yes, completed French evaluation",
              description: "Completed a French language evaluation",
            })}
          </span>
        </p>
      )}
      {bilingualEvaluation === BilingualEvaluation.NotCompleted && (
        <p>
          {intl.formatMessage({
            defaultMessage: "Completed an official GoC evaluation:",
            description:
              "Completed a government of canada abbreviation evaluation label and colon",
          })}{" "}
          <span data-h2-font-weight="b(700)">
            {intl.formatMessage({
              defaultMessage: "No",
              description: "No, did not completed a language evaluation",
            })}
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
                ? getLanguageProficiency(estimatedLanguageAbility)
                    .defaultMessage
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
          {editPath &&
            intl.formatMessage(
              {
                defaultMessage:
                  "There are <redText>required</redText> fields missing.",
                description:
                  "Message that there are required fields missing. Please ignore things in <> tags.",
              },
              {
                redText,
              },
            )}{" "}
          {editPath && (
            <a href={editPath}>
              {intl.formatMessage({
                defaultMessage: "Click here to get started.",
                description: "Message to click on the words to begin something",
              })}
            </a>
          )}
        </p>
      )}
    </div>
  );
};

export default LanguageInformationSection;
