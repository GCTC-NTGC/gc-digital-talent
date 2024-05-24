import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import { ReactNode, useEffect } from "react";

import {
  RadioGroup,
  FieldLabels,
  enumToOptions,
  Checkbox,
} from "@gc-digital-talent/forms";
import {
  Locales,
  errorMessages,
  getEvaluatedLanguageAbility,
  getLanguage,
  getLocale,
} from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";
import { EvaluatedLanguageAbility, Language } from "@gc-digital-talent/graphql";

import { getEstimatedAbilityOptions, getExamValidityOptions } from "./utils";

const EvaluatedAbilityItemsSortOrder = [
  EvaluatedLanguageAbility.P,
  EvaluatedLanguageAbility.E,
  EvaluatedLanguageAbility.C,
  EvaluatedLanguageAbility.B,
  EvaluatedLanguageAbility.A,
  EvaluatedLanguageAbility.X,
  EvaluatedLanguageAbility.NotAssessed,
];

const languageEvaluationPageLink = (msg: ReactNode, locale: Locales) => {
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
      {msg}
    </Link>
  );
};

const selfAssessmentLink = (msg: ReactNode, locale: Locales) => {
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
interface ConsideredLanguagesProps {
  labels: FieldLabels;
}

const ConsideredLanguages = ({ labels }: ConsideredLanguagesProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { watch, resetField } = useFormContext();

  // hooks to watch, needed for conditional rendering
  const [consideredLanguages, secondLanguageExamCompleted] = watch([
    "consideredPositionLanguages",
    "secondLanguageExamCompleted",
  ]);

  const evaluatedAbilityItems = enumToOptions(
    EvaluatedLanguageAbility,
    EvaluatedAbilityItemsSortOrder,
  ).map(({ value }) => ({
    value,
    label: intl.formatMessage(getEvaluatedLanguageAbility(value)),
  }));

  const estimatedAbilityItems = getEstimatedAbilityOptions(intl);

  const isLookingForBilingual = consideredLanguages.includes(
    "lookingForBilingual",
  );

  const hasCompletedSecondLanguageExam = secondLanguageExamCompleted;

  /**
   * Reset un-rendered fields
   */
  useEffect(() => {
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

    const resetFirstOfficialLanguage = () => {
      resetDirtyField("firstOfficialLanguage");
    };

    const resetSecondLanguageExamCompleted = () => {
      resetDirtyField("secondLanguageExamCompleted");
    };

    const resetSecondLanguageExamValidity = () => {
      resetDirtyField("secondLanguageExamValidity");
    };

    // Reset all bilingual fields
    if (!isLookingForBilingual) {
      resetFirstOfficialLanguage();
      resetEstimation();
      resetSecondLanguageExamCompleted();
      resetSecondLanguageExamValidity();
      resetEvaluations();
    }

    // Reset either evaluation or estimation
    if (!hasCompletedSecondLanguageExam) {
      resetSecondLanguageExamValidity();
      resetEvaluations();
    }
  }, [resetField, isLookingForBilingual, hasCompletedSecondLanguageExam]);

  return isLookingForBilingual ? (
    <>
      <RadioGroup
        idPrefix="firstOfficialLanguage"
        legend={labels.firstOfficialLanguage}
        name="firstOfficialLanguage"
        id="firstOfficialLanguage"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={enumToOptions(Language).map(({ value }) => ({
          value,
          label: intl.formatMessage(getLanguage(value)),
        }))}
      />
      <p>
        {intl.formatMessage({
          defaultMessage:
            "<strong>Please select an appropriate second language proficiency level based on the definitions provided.</strong>",
          id: "buZsS/",
          description:
            "Text requesting language levels given from bilingual evaluation in language information form",
        })}
      </p>
      <RadioGroup
        idPrefix="estimatedLanguageAbility"
        legend={labels.estimatedLanguageAbility}
        name="estimatedLanguageAbility"
        id="estimatedLanguageAbility"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={estimatedAbilityItems}
        context={intl.formatMessage(
          {
            defaultMessage:
              "<languageEvaluationPageLink>Learn more about choosing a second language proficiency.</languageEvaluationPageLink>",
            id: "Le97Ow",
            description:
              "Context message for estimated language ability in language information form.",
          },
          {
            languageEvaluationPageLink: (chunks: ReactNode) =>
              languageEvaluationPageLink(chunks, locale),
          },
        )}
      />
      <Checkbox
        boundingBox
        boundingBoxLabel={labels.secondLanguageExamCompletedBoundingBoxLabel}
        id="secondLanguageExamCompleted"
        name="secondLanguageExamCompleted"
        label={labels.secondLanguageExamCompletedLabel}
      />
      {hasCompletedSecondLanguageExam ? (
        <>
          <RadioGroup
            idPrefix="secondLanguageExamValidity"
            legend={labels.secondLanguageExamValidityLabel}
            name="secondLanguageExamValidity"
            id="secondLanguageExamValidity"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            items={getExamValidityOptions(intl)}
            context={intl.formatMessage(
              {
                defaultMessage:
                  "The Public Service Commission’s official evaluation provides you with 3 letter grades that indicate your proficiency in your second language. You can <selfAssessmentLink>learn more about this evaluation on their website.</selfAssessmentLink>",
                id: "J/kDDk",
                description:
                  "Context message for exam validity in language information form.",
              },
              {
                selfAssessmentLink: (chunks: ReactNode) =>
                  selfAssessmentLink(chunks, locale),
              },
            )}
          />
          <p>
            {intl.formatMessage({
              defaultMessage:
                "<strong>Please provide your most recent levels obtained from the Public Service Commission.</strong>",
              id: "aO23nW",
              description:
                "Text requesting language levels given from bilingual evaluation in language information form",
            })}
          </p>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
            data-h2-gap="base(x1, 0) l-tablet(0, x1)"
          >
            <RadioGroup
              idPrefix="comprehensionLevel"
              legend={labels.comprehensionLevel}
              id="comprehensionLevel"
              name="comprehensionLevel"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={evaluatedAbilityItems}
            />
            <RadioGroup
              idPrefix="writtenLevel"
              legend={labels.writtenLevel}
              id="writtenLevel"
              name="writtenLevel"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={evaluatedAbilityItems}
            />
            <RadioGroup
              idPrefix="verbalLevel"
              legend={labels.verbalLevel}
              id="verbalLevel"
              name="verbalLevel"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={evaluatedAbilityItems}
            />
          </div>
        </>
      ) : null}
    </>
  ) : null;
};

export default ConsideredLanguages;
