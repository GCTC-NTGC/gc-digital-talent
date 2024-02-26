import React from "react";
import { useIntl } from "react-intl";

import { Link, Well } from "@gc-digital-talent/ui";
import {
  getBilingualEvaluation,
  getLanguageProficiency,
  commonMessages,
} from "@gc-digital-talent/i18n";

import { User, BilingualEvaluation } from "~/api/generated";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/languageInformation";
import { wrapAbbr } from "~/utils/nameUtils";
import { getEvaluatedLanguageLevels } from "~/utils/userUtils";

const LanguageInformationSection = ({
  user,
  editPath,
}: {
  user: User;
  editPath?: string;
}) => {
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
  } = user;

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {lookingForEnglish && !lookingForFrench && !lookingForBilingual && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Interested in:",
                  id: "TmCffZ",
                  description: "Interested in label and colon",
                })}
              </span>
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
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Interested in:",
                  id: "TmCffZ",
                  description: "Interested in label and colon",
                })}
              </span>
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
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Interested in:",
                  id: "TmCffZ",
                  description: "Interested in label and colon",
                })}
              </span>
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
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage: "Interested in:",
                  id: "TmCffZ",
                  description: "Interested in label and colon",
                })}
              </span>
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
              <span data-h2-display="base(block)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Completed an official <abbreviation>GC</abbreviation> evaluation:",
                    id: "3E5Xx0",
                    description:
                      "Completed a government of canada abbreviation evaluation label and colon",
                  },
                  {
                    abbreviation: (text: React.ReactNode) =>
                      wrapAbbr(text, intl),
                  },
                )}
              </span>
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
              <span data-h2-display="base(block)">
                {intl.formatMessage({
                  defaultMessage:
                    "Second language level (reading, writing, oral interaction)",
                  id: "qOi2J0",
                  description:
                    "Second language level (reading, writing, oral interaction) label",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </span>
              <span data-h2-font-weight="base(700)">
                {getEvaluatedLanguageLevels(
                  intl,
                  comprehensionLevel,
                  writtenLevel,
                  verbalLevel,
                )}
              </span>
            </p>
          </div>
        )}
        {bilingualEvaluation === BilingualEvaluation.NotCompleted &&
          !!estimatedLanguageAbility && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Second language level:",
                    id: "q3Gl23",
                    description:
                      "Estimated skill in second language, followed by a colon",
                  })}
                </span>
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
        {hasAllEmptyFields(user) && editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "You haven't added any information here yet.",
                id: "SCCX7B",
                description: "Message for when no data exists for the section",
              })}
            </p>
          </div>
        )}
        {hasEmptyRequiredFields(user) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {editPath && (
                <>
                  {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
                  <Link href={editPath}>
                    {intl.formatMessage({
                      defaultMessage: "Edit your language information options.",
                      id: "S9lNLG",
                      description:
                        "Link text to edit language information on profile.",
                    })}
                  </Link>
                </>
              )}
              {!editPath && (
                <>{intl.formatMessage(commonMessages.noInformationProvided)}</>
              )}
            </p>
          </div>
        )}
      </div>
    </Well>
  );
};

export default LanguageInformationSection;
