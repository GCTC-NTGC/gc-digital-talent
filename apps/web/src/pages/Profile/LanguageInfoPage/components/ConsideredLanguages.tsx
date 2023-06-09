import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  RadioGroup,
  Select,
  enumToOptions,
  FieldLabels,
} from "@gc-digital-talent/forms";
import { errorMessages, useLocale } from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";

import {
  BilingualEvaluation,
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
} from "~/api/generated";

const EvaluatedAbilityItemsSortOrder = [
  EvaluatedLanguageAbility.X,
  EvaluatedLanguageAbility.A,
  EvaluatedLanguageAbility.B,
  EvaluatedLanguageAbility.C,
  EvaluatedLanguageAbility.E,
  EvaluatedLanguageAbility.P,
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

  const BilingualEvaluationItems = [
    {
      value: BilingualEvaluation.CompletedEnglish,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <strong>have</strong> completed an official <strong>ENGLISH</strong> <languageEvaluationPageLink></languageEvaluationPageLink>.",
          id: "HPDqDV",
          description:
            "Message for the completed english bilingual evaluation option",
        },
        {
          languageEvaluationPageLink,
        },
      ),
    },
    {
      value: BilingualEvaluation.CompletedFrench,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <strong>have</strong> completed an official <strong>FRENCH</strong> <languageEvaluationPageLink></languageEvaluationPageLink>.",
          id: "shwFSK",
          description:
            "Message for the completed french bilingual evaluation option",
        },
        {
          languageEvaluationPageLink,
        },
      ),
    },
    {
      value: BilingualEvaluation.NotCompleted,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <strong>have NOT</strong> completed an official <languageEvaluationPageLink></languageEvaluationPageLink>.",
          id: "5g49WB",
          description:
            "Message for the haven't completed bilingual evaluation option",
        },
        {
          languageEvaluationPageLink,
        },
      ),
    },
  ];

  const EvaluatedAbilityItems = enumToOptions(
    EvaluatedLanguageAbility,
    EvaluatedAbilityItemsSortOrder,
  ).map(({ value }) => ({
    value,
    label: value,
  }));

  const estimatedAbilityItems = [
    {
      value: EstimatedLanguageAbility.Beginner,
      label: intl.formatMessage({
        defaultMessage:
          "Beginner <gray>- I have basic reading, writing and verbal communication skills.</gray>",
        id: "ZuFBx5",
        description: "Message for the beginner language ability option",
      }),
    },
    {
      value: EstimatedLanguageAbility.Intermediate,
      label: intl.formatMessage({
        defaultMessage:
          "Intermediate <gray>- I have strong reading, writing and verbal communication skills.</gray>",
        id: "t5G3Fz",
        description: "Message for the intermediate language ability option",
      }),
    },
    {
      value: EstimatedLanguageAbility.Advanced,
      label: intl.formatMessage({
        defaultMessage: "Advanced <gray>- I am completely fluent.</gray>",
        id: "paLFgh",
        description: "Message for the advanced language ability option",
      }),
    },
  ];

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
      <div data-h2-padding="base(x.5, 0, 0, 0)">
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
      </div>
      {hasCompletedEvaluation ? (
        <div data-h2-padding="base(x.5, 0, 0, 0)">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please indicate the language levels you acquired from your Government of Canada language evaluation.",
              id: "Y7l4/n",
              description:
                "Text requesting language levels given from bilingual evaluation in language information form",
            })}
          </p>
          <div data-h2-flex-grid="base(normal, x1)">
            <div data-h2-flex-item="base(1of1) p-tablet(1of3) desktop(1of4)">
              <Select
                id="comprehensionLevel"
                name="comprehensionLevel"
                label={labels.comprehensionLevel}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a level",
                  id: "mX4+Dq",
                  description:
                    "Placeholder displayed on the language information form comprehension field.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={EvaluatedAbilityItems}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of3) desktop(1of4)">
              <Select
                id="writtenLevel"
                name="writtenLevel"
                label={labels.writtenLevel}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a level",
                  id: "4JS9Yp",
                  description:
                    "Placeholder displayed on the language information form written field.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={EvaluatedAbilityItems}
              />
            </div>
            <div data-h2-flex-item="base(1of1) p-tablet(1of3) desktop(1of4)">
              <Select
                id="verbalLevel"
                name="verbalLevel"
                label={labels.verbalLevel}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a level",
                  id: "tl7bV2",
                  description:
                    "Placeholder displayed on the language information form verbal field.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                options={EvaluatedAbilityItems}
              />
            </div>
          </div>
        </div>
      ) : (
        <div data-h2-padding="base(x.5, 0, 0, 0)">
          <p data-h2-padding="base(0, 0, x.5, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You can find out find out your levels with a <selfAssessmentLink>language proficiency self-assessment</selfAssessmentLink>.",
                id: "1F7at9",
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
        </div>
      )}
    </>
  ) : null;
};

export default ConsideredLanguages;
