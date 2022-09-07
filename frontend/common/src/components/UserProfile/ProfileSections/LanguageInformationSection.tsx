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
                id: "TmCffZ",
                description: "Interested in label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "English positions",
                  id: "vFMPHW",
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
                id: "TmCffZ",
                description: "Interested in label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "French positions",
                  id: "qT9sS0",
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
                id: "TmCffZ",
                description: "Interested in label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "English or French positions",
                  id: "fFznH0",
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
                id: "TmCffZ",
                description: "Interested in label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Bilingual positions (English and French)",
                  id: "6eCvv1",
                  description: "Bilingual Positions message",
                })}
              </span>
            </p>
          </div>
        )}
        {bilingualEvaluation && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "Completed an official GoC evaluation:",
                id: "shPV27",
                description:
                  "Completed a government of canada abbreviation evaluation label and colon",
              })}
              <br />
              <span data-h2-font-weight="base(700)">
                {intl.formatMessage(
                  getBilingualEvaluation(bilingualEvaluation),
                )}
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
                id: "D7Qb41",
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
                  id: "q3Gl23",
                  description:
                    "Estimated skill in second language, followed by a colon",
                })}
                <br />
                <span data-h2-font-weight="base(700)">
                  {estimatedLanguageAbility
                    ? intl.formatMessage(
                        getLanguageProficiency(estimatedLanguageAbility),
                      )
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
                  id: "SCCX7B",
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
              {editPath && (
                <>
                  {intl.formatMessage(messages.requiredFieldsMissing)}{" "}
                  <a href={editPath}>
                    {intl.formatMessage({
                      defaultMessage: "Edit your language information options.",
                      id: "S9lNLG",
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
                    id: "xjtRjr",
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
