import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  RadioGroup,
  Select,
  FieldLabels,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  getEvaluatedLanguageAbility,
  uiMessages,
  useLocale,
} from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";

import { BilingualEvaluation, EvaluatedLanguageAbility } from "~/api/generated";

import {
  getBilingualEvaluationItems,
  getEstimatedAbilityOptions,
} from "./utils";

const EvaluatedAbilityItemsSortOrder = [
  EvaluatedLanguageAbility.X,
  EvaluatedLanguageAbility.A,
  EvaluatedLanguageAbility.B,
  EvaluatedLanguageAbility.C,
  EvaluatedLanguageAbility.E,
  EvaluatedLanguageAbility.P,
  EvaluatedLanguageAbility.NotAssessed,
];

interface ConsideredLanguagesProps {
  labels: FieldLabels;
}

const ConsideredLanguages = ({ labels }: ConsideredLanguagesProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const { watch, resetField } = useFormContext();

  const languageEvaluationPageLink = () => {
    return (
      <Link
        newTab
        external
        href={
          locale === "en"
            ? "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service.html"
            : "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde.html"
        }
      >
        {intl.formatMessage({
          defaultMessage: "Government of Canada language evaluation",
          id: "3vjhOA",
          description: "Message on links to the language evaluation tests",
        })}
      </Link>
    );
  };

  const selfAssessmentLink = (msg: React.ReactNode) => {
    return (
      <Link
        newTab
        external
        href={
          locale === "en"
            ? "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service/self-assessment-tests.html"
            : "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde/tests-autoevaluation.html"
        }
      >
        {msg}
      </Link>
    );
  };

  // hooks to watch, needed for conditional rendering
  const [consideredLanguages, bilingualEvaluation] = watch([
    "consideredPositionLanguages",
    "bilingualEvaluation",
  ]);

  const BilingualEvaluationItems = getBilingualEvaluationItems(
    intl,
    languageEvaluationPageLink,
  );

  const evaluatedAbilityItems = enumToOptions(
    EvaluatedLanguageAbility,
    EvaluatedAbilityItemsSortOrder,
  ).map(({ value }) => ({
    value,
    label: intl.formatMessage(getEvaluatedLanguageAbility(value)),
  }));

  // const evaluatedAbilityItems = getEvaluatedAbilityOptions(intl);

  const estimatedAbilityItems = getEstimatedAbilityOptions(intl);

  const isLookingForBilingual = consideredLanguages.includes(
    "lookingForBilingual",
  );
  const hasCompletedEvaluation =
    bilingualEvaluation !== BilingualEvaluation.NotCompleted;

  /**
   * Reset un-rendered fields
   */
  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false });
    };

    const resetEvaluations = () => {
      resetDirtyField("comprehensionLevel");
      resetDirtyField("writtenLevel");
      resetDirtyField("verbalLevel");
    };

    const resetEstimation = () => {
      resetDirtyField("estimatedLanguageAbility");
    };

    // Reset all bilingual fields
    if (!isLookingForBilingual) {
      resetDirtyField("bilingualEvaluation");
      resetEstimation();
      resetEvaluations();
    }

    // Reset either evaluation or estimation
    // fields depending on the users evaluation status
    if (!hasCompletedEvaluation) {
      resetEvaluations();
    } else {
      resetEstimation();
    }
  }, [resetField, isLookingForBilingual, hasCompletedEvaluation]);

  return isLookingForBilingual ? (
    <>
      <RadioGroup
        idPrefix="bilingualEvaluation"
        legend={labels.bilingualEvaluation}
        name="bilingualEvaluation"
        id="bilingualEvaluation"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={BilingualEvaluationItems}
      />
      {hasCompletedEvaluation ? (
        <>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please indicate the language levels you acquired from your Government of Canada language evaluation.",
              id: "Y7l4/n",
              description:
                "Text requesting language levels given from bilingual evaluation in language information form",
            })}
          </p>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
            data-h2-gap="l-tablet(0, x1)"
          >
            <Select
              id="comprehensionLevel"
              name="comprehensionLevel"
              label={labels.comprehensionLevel}
              nullSelection={intl.formatMessage(
                uiMessages.nullSelectionOptionLevel,
              )}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={evaluatedAbilityItems}
              doNotSort
            />
            <Select
              id="writtenLevel"
              name="writtenLevel"
              label={labels.writtenLevel}
              nullSelection={intl.formatMessage(
                uiMessages.nullSelectionOptionLevel,
              )}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={evaluatedAbilityItems}
              doNotSort
            />
            <Select
              id="verbalLevel"
              name="verbalLevel"
              label={labels.verbalLevel}
              nullSelection={intl.formatMessage(
                uiMessages.nullSelectionOptionLevel,
              )}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              options={evaluatedAbilityItems}
              doNotSort
            />
          </div>
        </>
      ) : (
        <>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "You can find out your levels with a <selfAssessmentLink>language proficiency self-assessment</selfAssessmentLink>.",
                id: "4faEVw",
                description:
                  "Text including link to language proficiency evaluation in language information form",
              },
              {
                selfAssessmentLink,
              },
            )}
          </p>
          <RadioGroup
            idPrefix="estimatedLanguageAbility"
            legend={labels.estimatedLanguageAbility}
            name="estimatedLanguageAbility"
            id="estimatedLanguageAbility"
            items={estimatedAbilityItems}
          />
        </>
      )}
    </>
  ) : null;
};

export default ConsideredLanguages;
