import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { CardSeparator, Notice, Separator, Ul } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { getFromLocalStorage } from "@gc-digital-talent/storage";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getExamValidityOptions, getLabels } from "~/utils/languageUtils";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { KEY_NEW_USER_LANGUAGE_PRESET } from "~/constants/storageKeys";

const LanguageProfileDisplay_Fragment = graphql(/** GraphQL */ `
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

interface DisplayProps {
  query: FragmentType<typeof LanguageProfileDisplay_Fragment>;
  context: "applicant-view" | "admin-view";
}

const Display = ({ query, context }: DisplayProps) => {
  const intl = useIntl();
  const newUserFlagIsSet = getFromLocalStorage<boolean>(
    KEY_NEW_USER_LANGUAGE_PRESET,
    false,
  );
  const showHelperMessage = newUserFlagIsSet && context == "applicant-view";
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
    preferredLanguageForInterview,
    preferredLanguageForExam,
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
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This section of your applicant profile focuses on the official languages you want to work in, as well as the official languages you would prefer to be tested in.",
          id: "5csRb4",
          description: "Introduction for the language profile form",
        })}
      </p>
      {showHelperMessage ? (
        <Notice.Root color="error">
          <Notice.Content>
            {intl.formatMessage(
              {
                defaultMessage: `The current information was inferred based on your choice of contact language during registration. Please use the "{buttonLabel}" button to review these settings.`,
                id: "ADUuJh",
                description:
                  "Helper message that the language settings were preset",
              },
              {
                buttonLabel: (
                  <ToggleForm.Trigger
                    aria-label={intl.formatMessage({
                      defaultMessage: "Edit language profile",
                      id: "fxPLAl",
                      description:
                        "Button text to start editing language profile",
                    })}
                    color="error"
                    className="font-normal"
                  >
                    {intl.formatMessage(commonMessages.editThisSection)}
                  </ToggleForm.Trigger>
                ),
              },
            )}
          </Notice.Content>
        </Notice.Root>
      ) : null}
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
      {context == "admin-view" ? (
        <Separator space="none" />
      ) : (
        <CardSeparator space="none" />
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldDisplay
          hasError={!preferredLanguageForInterview}
          label={intl.formatMessage({
            defaultMessage: "Preferred interview language",
            id: "m6vOLM",
            description: "Title for preferred spoken interview language",
          })}
        >
          {preferredLanguageForInterview?.label.localized ?? notProvided}
        </FieldDisplay>
        <FieldDisplay
          hasError={!preferredLanguageForExam}
          label={intl.formatMessage({
            defaultMessage: "Preferred written exam language",
            id: "fg2wla",
            description: "Title for preferred written exam language",
          })}
        >
          {preferredLanguageForExam?.label.localized ?? notProvided}
        </FieldDisplay>
      </div>
    </div>
  );
};

export default Display;
