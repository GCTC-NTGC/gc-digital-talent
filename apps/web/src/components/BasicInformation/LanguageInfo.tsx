import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Ul } from "@gc-digital-talent/ui";

import FieldDisplay from "../FieldDisplay/FieldDisplay";
import BoolCheckIcon from "../BoolCheckIcon/BoolCheckIcon";
import { getLabels } from "../Profile/components/LanguageProfile/utils";
import { getEstimatedLanguageAbility } from "./utils";
import Caption from "./Caption";

export const LanguageInfo_Fragment = graphql(/* GraphQL */ `
  fragment LanguageInfo on User {
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    firstOfficialLanguage {
      value
      label {
        localized
      }
    }
    estimatedLanguageAbility {
      value
      label {
        localized
      }
    }
    secondLanguageExamCompleted
    secondLanguageExamValidity
    comprehensionLevel {
      value
      label {
        localized
      }
    }
    writtenLevel {
      value
      label {
        localized
      }
    }
    verbalLevel {
      value
      label {
        localized
      }
    }
    preferredLanguageForInterview {
      value
      label {
        localized
      }
    }
    preferredLanguageForExam {
      value
      label {
        localized
      }
    }
  }
`);

export interface DisplayProps {
  languageInfoQuery: FragmentType<typeof LanguageInfo_Fragment>;
}

const LanguageInfo = ({ languageInfoQuery }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const labels = getLabels(intl);

  const {
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
    preferredLanguageForInterview,
    preferredLanguageForExam,
  } = getFragment(LanguageInfo_Fragment, languageInfoQuery);

  return (
    <div className="grid gap-6 xs:grid-cols-1">
      <FieldDisplay
        label={intl.formatMessage({
          defaultMessage:
            "Language of positions they'd like to be considered for",
          id: "DQKNn+",
          description: "Label for considered languages field view",
        })}
      >
        {lookingForEnglish || lookingForFrench || lookingForBilingual ? (
          <Ul unStyled space="md">
            <li>
              <BoolCheckIcon
                value={lookingForEnglish}
                trueLabel={intl.formatMessage(commonMessages.interested)}
                falseLabel={intl.formatMessage(commonMessages.notInterested)}
              >
                {intl.formatMessage({
                  defaultMessage: "English-only positions",
                  id: "oHIWzo",
                  description: "Label for language for english field",
                })}
              </BoolCheckIcon>
            </li>
            <li>
              <BoolCheckIcon
                value={lookingForFrench}
                trueLabel={intl.formatMessage(commonMessages.interested)}
                falseLabel={intl.formatMessage(commonMessages.notInterested)}
              >
                {intl.formatMessage({
                  defaultMessage: "French-only positions",
                  id: "BsNhUK",
                  description: "Label for language for french field",
                })}
              </BoolCheckIcon>
            </li>
            <li>
              <BoolCheckIcon
                value={lookingForBilingual}
                trueLabel={intl.formatMessage(commonMessages.interested)}
                falseLabel={intl.formatMessage(commonMessages.notInterested)}
              >
                {intl.formatMessage({
                  defaultMessage: "Bilingual positions",
                  id: "Mwq0NB",
                  description: "Label for language for bilingual field",
                })}
              </BoolCheckIcon>
            </li>
          </Ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      {lookingForBilingual && (
        <>
          <FieldDisplay label={labels.firstOfficialLang}>
            {firstOfficialLanguage?.label.localized ?? notProvided}
          </FieldDisplay>
          <FieldDisplay label={labels.estimatedLanguageAbility}>
            {estimatedLanguageAbility?.label.localized ? (
              <div className="flex flex-col">
                <span>{estimatedLanguageAbility?.label.localized}</span>
                <Caption>
                  {intl.formatMessage(
                    getEstimatedLanguageAbility(estimatedLanguageAbility.value),
                  )}
                </Caption>
              </div>
            ) : (
              notProvided
            )}
          </FieldDisplay>
          {secondLanguageExamCompleted ? (
            <>
              <FieldDisplay
                label={labels.secondLanguageExamCompletedBoundingBoxLabel}
              >
                <BoolCheckIcon value={secondLanguageExamCompleted}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Completed a Public Service Commission evaluation of their second official language.",
                    id: "y/F2My",
                    description:
                      "Message for official exam status field display",
                  })}
                </BoolCheckIcon>
              </FieldDisplay>
              <FieldDisplay label={labels.secondLanguageExamValidityLabel}>
                {secondLanguageExamValidity
                  ? intl.formatMessage({
                      defaultMessage:
                        "All three language level exams are currently valid",
                      id: "nFlN/H",
                      description: "Message for exam validity field display",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "One or more language levels are expired.",
                      id: "N832OY",
                      description: "Message for exam validity field display",
                    })}
              </FieldDisplay>
              <div className="grid gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0">
                <FieldDisplay label={labels.comprehensionLevel}>
                  {comprehensionLevel?.label.localized ?? notProvided}
                </FieldDisplay>
                <FieldDisplay label={labels.writtenLevel}>
                  {writtenLevel?.label.localized ?? notProvided}
                </FieldDisplay>
                <FieldDisplay label={labels.verbalLevel}>
                  {verbalLevel?.label.localized ?? notProvided}
                </FieldDisplay>
              </div>
            </>
          ) : null}
        </>
      )}
      <div className="grid gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0">
        <FieldDisplay label={labels.prefSpokenInterviewLang}>
          {preferredLanguageForInterview?.label.localized ?? notProvided}
        </FieldDisplay>
        <FieldDisplay label={labels.prefWrittenExamLang}>
          {preferredLanguageForExam?.label.localized ?? notProvided}
        </FieldDisplay>
      </div>
    </div>
  );
};

export default LanguageInfo;
