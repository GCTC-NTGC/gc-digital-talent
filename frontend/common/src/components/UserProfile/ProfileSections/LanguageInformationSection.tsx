import React from "react";
import { useIntl } from "react-intl";
import { Applicant, BilingualEvaluation } from "../../../api/generated";
import { getLanguageProficiency } from "../../../constants/localizedConstants";

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
      data-h2-background-color="base(light.dt-gray)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(s)"
    >
      <div data-h2-flex-grid="base(flex-start, 0, x2, x1)">
        {lookingForEnglish && !lookingForFrench && !lookingForBilingual && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Interested in:",
                description: "Interested in label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "English positions",
                  description: "English Positions message",
                })}
              </span>
            </p>
          </div>
        )}
        {!lookingForEnglish && lookingForFrench && !lookingForBilingual && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Interested in:",
                description: "Interested in label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "French positions",
                  description: "French Positions message",
                })}
              </span>
            </p>
          </div>
        )}
        {lookingForEnglish && lookingForFrench && !lookingForBilingual && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Interested in:",
                description: "Interested in label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "English or French positions",
                  description: "English or French Positions message",
                })}
              </span>
            </p>
          </div>
        )}
        {lookingForBilingual && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Interested in:",
                description: "Interested in label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Bilingual positions (English and French)",
                  description: "Bilingual Positions message",
                })}
              </span>
            </p>
          </div>
        )}
        {bilingualEvaluation === BilingualEvaluation.CompletedEnglish && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Completed an official GoC evaluation:",
                description:
                  "Completed a government of canada abbreviation evaluation label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Yes, completed English evaluation",
                  description: "Completed an English language evaluation",
                })}
              </span>
            </p>
          </div>
        )}
        {bilingualEvaluation === BilingualEvaluation.CompletedFrench && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Completed an official GoC evaluation:",
                description:
                  "Completed a government of canada abbreviation evaluation label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Yes, completed French evaluation",
                  description: "Completed a French language evaluation",
                })}
              </span>
            </p>
          </div>
        )}
        {bilingualEvaluation === BilingualEvaluation.NotCompleted && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Completed an official GoC evaluation:",
                description:
                  "Completed a government of canada abbreviation evaluation label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "No",
                  description: "No, did not completed a language evaluation",
                })}
              </span>
            </p>
          </div>
        )}
        {(bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
          bilingualEvaluation === BilingualEvaluation.CompletedFrench) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Second language level (Comprehension, Written, Verbal):",
                description:
                  "Evaluation results for second language, results in that order followed by a colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {comprehensionLevel}, {writtenLevel}, {verbalLevel}
              </span>
            </p>
          </div>
        )}
        {bilingualEvaluation === BilingualEvaluation.NotCompleted &&
          !!estimatedLanguageAbility && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage({
                  defaultMessage: "Second language level:",
                  description:
                    "Estimated skill in second language, followed by a colon",
                })}
                <br />
                <span data-h2-font-weight="base(700)">
                  {estimatedLanguageAbility
                    ? getLanguageProficiency(estimatedLanguageAbility)
                        .defaultMessage
                    : ""}
                </span>
              </p>
            </div>
          )}
        {!lookingForEnglish &&
          !lookingForFrench &&
          !lookingForBilingual &&
          !bilingualEvaluation &&
          editPath && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage({
                  defaultMessage: "You haven't added any information here yet.",
                  description:
                    "Message for when no data exists for the section",
                })}
              </p>
            </div>
          )}
        {((!lookingForEnglish && !lookingForFrench && !lookingForBilingual) ||
          (lookingForBilingual &&
            (!bilingualEvaluation ||
              ((bilingualEvaluation === BilingualEvaluation.CompletedEnglish ||
                bilingualEvaluation === BilingualEvaluation.CompletedFrench) &&
                (!comprehensionLevel || !writtenLevel || !verbalLevel))))) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {editPath &&
                intl.formatMessage({
                  defaultMessage:
                    "There are <red>required</red> fields missing.",
                  description:
                    "Message that there are required fields missing. Please ignore things in <> tags.",
                })}
              <br />
              {editPath && (
                <a href={editPath}>
                  {intl.formatMessage({
                    defaultMessage: "Click here to get started.",
                    description:
                      "Message to click on the words to begin something",
                  })}
                </a>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageInformationSection;
