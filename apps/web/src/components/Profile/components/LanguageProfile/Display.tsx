import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Ul } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getExamValidityOptions, getLabels } from "~/utils/languageUtils";

export const LanguageProfileDisplay_Fragment = graphql(/** GraphQL */ `
  fragment LanguageProfileDisplay on User {
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    firstOfficialLanguage {
      value
      label {
        localized
      }
    }
    secondLanguageExamCompleted
    secondLanguageExamValidity
    estimatedLanguageAbility {
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
    comprehensionLevel {
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
  }
`);

export interface DisplayProps {
  query: FragmentType<typeof LanguageProfileDisplay_Fragment>;
}

const Display = ({ query }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(commonMessages.notProvided);
  const labels = getLabels(intl);
  const user = getFragment(LanguageProfileDisplay_Fragment, query);
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
  } = user;

  let examValidity = null;
  switch (secondLanguageExamValidity) {
    case true:
      examValidity = getExamValidityOptions(intl).find(
        (option) => option.value === "currently_valid",
      )?.label;
      break;
    case false:
      examValidity = getExamValidityOptions(intl).find(
        (option) => option.value === "expired",
      )?.label;
      break;
    default:
      examValidity = null;
  }

  return (
    <div className="grid gap-6">
      <FieldDisplay
        hasError={
          !lookingForEnglish && !lookingForFrench && !lookingForBilingual
        }
        label={labels.consideredPositionLanguages}
      >
        {lookingForEnglish || lookingForFrench || lookingForBilingual ? (
          <Ul>
            {lookingForEnglish && (
              <li>
                {intl.formatMessage({
                  defaultMessage: "English-only positions",
                  id: "b3c+iw",
                  description: "English Positions message",
                })}
              </li>
            )}
            {lookingForFrench && (
              <li>
                {intl.formatMessage({
                  defaultMessage: "French-only positions",
                  id: "CFIG+8",
                  description: "French Positions message",
                })}
              </li>
            )}
            {lookingForBilingual && (
              <li>
                {intl.formatMessage({
                  defaultMessage: "Bilingual positions",
                  id: "94Pgq+",
                  description: "Bilingual Positions message",
                })}
              </li>
            )}
          </Ul>
        ) : (
          notProvided
        )}
      </FieldDisplay>
      {lookingForBilingual && (
        <>
          <FieldDisplay label={labels.firstOfficialLang}>
            {firstOfficialLanguage?.label
              ? firstOfficialLanguage.label.localized
              : notProvided}
          </FieldDisplay>
          <FieldDisplay label={labels.estimatedLanguageAbility}>
            {estimatedLanguageAbility?.label
              ? estimatedLanguageAbility.label.localized
              : notProvided}
          </FieldDisplay>
          {secondLanguageExamCompleted ? (
            <>
              <FieldDisplay
                label={labels.secondLanguageExamCompletedBoundingBoxLabel}
              >
                {secondLanguageExamCompleted
                  ? labels.secondLanguageExamCompletedLabel
                  : notProvided}
              </FieldDisplay>
              <FieldDisplay label={labels.secondLanguageExamValidityLabel}>
                {examValidity}
              </FieldDisplay>
              <div className="grid gap-6 sm:grid-cols-3">
                <FieldDisplay label={labels.comprehensionLevel}>
                  {comprehensionLevel?.label
                    ? comprehensionLevel.label.localized
                    : notProvided}
                </FieldDisplay>
                <FieldDisplay label={labels.writtenLevel}>
                  {writtenLevel?.label
                    ? writtenLevel.label.localized
                    : notProvided}
                </FieldDisplay>
                <FieldDisplay label={labels.verbalLevel}>
                  {verbalLevel?.label
                    ? verbalLevel.label.localized
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
