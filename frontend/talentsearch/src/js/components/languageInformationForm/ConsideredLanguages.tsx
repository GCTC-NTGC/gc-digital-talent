import React from "react";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import { RadioGroup, Select } from "@common/components/form";
import { errorMessages } from "@common/messages";
import useLocale from "@common/hooks/useLocale";
import { enumToOptions } from "@common/helpers/formUtils";
import { FieldLabels } from "@common/components/form/BasicForm";
import {
  BilingualEvaluation,
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
} from "../../api/generated";

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
  const locale = useLocale();
  const { watch } = useFormContext();

  const selfAssessmentLink = (msg: React.ReactNode): React.ReactNode => {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={
          locale === "en"
            ? "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service/self-assessment-tests.html"
            : "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde/tests-autoevaluation.html"
        }
      >
        {msg}
      </a>
    );
  };

  const languageEvaluationPageLink = () => {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={
          locale === "en"
            ? "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service.html"
            : "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde.html"
        }
      >
        {intl.formatMessage({
          defaultMessage: "Government of Canada language evaluation.",
          id: "Ugr5Yt",
          description: "Message on links to the language evaluation tests",
        })}
      </a>
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
            "I am bilingual (En/Fr) and <strong>have</strong> completed an official <strong>ENGLISH</strong> <languageEvaluationPageLink></languageEvaluationPageLink>",
          id: "ljnSYf",
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
            "I am bilingual (En/Fr) and <strong>have</strong> completed an official <strong>FRENCH</strong> <languageEvaluationPageLink></languageEvaluationPageLink>",
          id: "pak8ye",
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
            "I am bilingual (En/Fr) and <strong>have NOT</strong> completed an official <languageEvaluationPageLink></languageEvaluationPageLink>",
          id: "FfEyFv",
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

  return consideredLanguages.includes("lookingForBilingual") ? (
    <>
      <div data-h2-padding="base(x.5, 0, 0, 0)">
        <RadioGroup
          idPrefix="bilingualEvaluation"
          legend={labels.bilingualEvaluation}
          name="bilingualEvaluation"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={BilingualEvaluationItems}
        />
      </div>
      {bilingualEvaluation !== BilingualEvaluation.NotCompleted ? (
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
                  defaultMessage: "Select a level...",
                  id: "8QN6ZC",
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
                  defaultMessage: "Select a level...",
                  id: "aQJOd0",
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
                  defaultMessage: "Select a level...",
                  id: "Y7jEXr",
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
                  "If you want to find out your language proficiency levels, <selfAssessmentLink>click here to find out.</selfAssessmentLink>",
                id: "nVh2Qh",
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
            items={estimatedAbilityItems}
          />
        </div>
      )}
    </>
  ) : null;
};

export default ConsideredLanguages;
