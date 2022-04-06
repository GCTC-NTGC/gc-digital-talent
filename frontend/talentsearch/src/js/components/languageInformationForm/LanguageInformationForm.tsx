import React from "react";
import { useIntl } from "react-intl";
import { errorMessages } from "@common/messages";
import {
  BasicForm,
  Checklist,
  RadioGroup,
  Select,
} from "@common/components/form";
import { SubmitHandler } from "react-hook-form";
import { fakeUsers } from "@common/fakeData";
import { enumToOptions } from "@common/helpers/formUtils";
import { EvaluatedLanguageAbility, User } from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

export type FormValues = Pick<
  User,
  | "lookingForEnglish"
  | "lookingForFrench"
  | "lookingForBilingual"
  | "bilingualEvaluation"
  | "comprehensionLevel"
  | "writtenLevel"
  | "verbalLevel"
  | "estimatedLanguageAbility"
>;

export const LanguageInformationForm: React.FunctionComponent<{
  self: User;
}> = ({ self }) => {
  const intl = useIntl();

  const [bilingualSelected, setBilingualSelected] = React.useState(false);
  const [completedEvaluation, setCompletedEvaluation] = React.useState(true);

  // TODO: Should probably move this into a constants file
  const ConsideredLangItems: { value: string; label: string }[] = [
    {
      value: "english-positions",
      label: intl.formatMessage({
        defaultMessage: "English positions",
        description: "Message for the english positions option",
      }),
    },
    {
      value: "french-positions",
      label: intl.formatMessage({
        defaultMessage: "French positions",
        description: "Message for the french positions option",
      }),
    },
    {
      value: "bilingual-positions",
      label: intl.formatMessage({
        defaultMessage: "Bilingual positions (English and French)",
        description: "Message for the bilingual positions option",
      }),
    },
  ];
  const BilingualEvaluationItems: { value: string; label: string }[] = [
    {
      // TODO: figure out how to bold and underline the right parts of these
      // Are these just underlines or should they be links?
      value: "completed-english",
      label: intl.formatMessage({
        defaultMessage:
          "I am bilingual (En/Fr) and have completed an official ENGLISH Government of Canada language evaluation.",
        description:
          "Message for the completed english bilingual evaluation option",
      }),
    },
    {
      value: "completed-french",
      label: intl.formatMessage({
        defaultMessage:
          "I am bilingual (En/Fr) and have completed an official FRENCH Government of Canada language evaluation.",
        description:
          "Message for the completed french bilingual evaluation option",
      }),
    },
    {
      value: "not-completed",
      label: intl.formatMessage({
        defaultMessage:
          "I am bilingual (En/Fr) and have NOT completed an official Government of Canada language evaluation.",
        description:
          "Message for the haven't completed bilingual evaluation option",
      }),
    },
  ];
  const EstimatedAbilityItems: { value: string; label: string }[] = [
    {
      // TODO: figure out how to change colour on part of this
      value: "beginner",
      label: intl.formatMessage({
        defaultMessage:
          "Beginner - I have basic reading, writing and verbal communication skills.",
        description: "Message for the beginner language ability option",
      }),
    },
    {
      value: "intermediate",
      label: intl.formatMessage({
        defaultMessage:
          "Intermediate - I have strong reading, writing and verbal communication skills.",
        description: "Message for the intermediate language ability option",
      }),
    },
    {
      value: "advanced",
      label: intl.formatMessage({
        defaultMessage: "Advanced - I am completely fluent.",
        description: "Message for the advanced language ability option",
      }),
    },
  ];

  return (
    <div data-h2-padding="b(bottom, l)">
      <div
        data-h2-width="b(100) xs(75) m(50)"
        data-h2-padding="b(top-bottom, s)"
      >
        <Checklist
          idPrefix="considered-position-languages"
          legend={intl.formatMessage({
            defaultMessage:
              "Select the positions you would like to be considered for",
            description:
              "Legend for considered position languages check list in language information form",
          })}
          name="consideredPositionLanguages"
          rules={{
            required: intl.formatMessage(errorMessages.required),
            onChange: (e) => {
              if (e.target.value === "bilingual-positions") {
                setBilingualSelected(e.target.checked);
              }
            },
          }}
          items={ConsideredLangItems}
        />
      </div>
      {bilingualSelected && (
        <>
          <div data-h2-padding="b(top, s)">
            <RadioGroup
              idPrefix="bilingual-evaluation"
              legend={intl.formatMessage({
                defaultMessage: "Bilingual evaluation",
                description:
                  "Legend bilingual evaluation status in language information form",
              })}
              name="bilingualEvaluation"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                onChange: (e) => {
                  setCompletedEvaluation(e.target.value !== "not-completed");
                },
              }}
              items={BilingualEvaluationItems}
            />
          </div>
          {completedEvaluation ? (
            <div
              data-h2-padding="b(top, s)"
              data-h2-flex-grid="b(normal, contained, flush, m)"
            >
              <p data-h2-flex-item="b(1of1)">
                {intl.formatMessage({
                  defaultMessage:
                    "Please indicate the language levels you acquired from your Government of Canada language evaluation.",
                  description:
                    "Text requesting language levels given from bilingual evaluation in language information form",
                })}
              </p>
              <div data-h2-flex-item="b(1of1) s(1of3) l(1of4)">
                <Select
                  id="comprehension"
                  name="comprehension"
                  label={intl.formatMessage({
                    defaultMessage: "Comprehension",
                    description:
                      "Label displayed on the language information form comprehension field.",
                  })}
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a level...",
                    description:
                      "Placeholder displayed on the language information form comprehension field.",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  // Are these options different in french? Do they need translated?
                  // TODO: organize these with X on top
                  options={enumToOptions(EvaluatedLanguageAbility).map(
                    ({ value }) => ({
                      value,
                      label: value,
                    }),
                  )}
                />
              </div>
              <div data-h2-flex-item="b(1of1) s(1of3) l(1of4)">
                <Select
                  id="written"
                  name="written"
                  label={intl.formatMessage({
                    defaultMessage: "Written",
                    description:
                      "Label displayed on the language information form written field.",
                  })}
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a level...",
                    description:
                      "Placeholder displayed on the language information form written field.",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  // Are these options different in french? Do they need translated?
                  options={enumToOptions(EvaluatedLanguageAbility).map(
                    ({ value }) => ({
                      value,
                      label: value,
                    }),
                  )}
                />
              </div>
              <div data-h2-flex-item="b(1of1) s(1of3) l(1of4)">
                <Select
                  id="verbal"
                  name="verbal"
                  label={intl.formatMessage({
                    defaultMessage: "Verbal",
                    description:
                      "Label displayed on the language information form verbal field.",
                  })}
                  nullSelection={intl.formatMessage({
                    defaultMessage: "Select a level...",
                    description:
                      "Placeholder displayed on the language information form verbal field.",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  // Are these options different in french? Do they need translated?
                  options={enumToOptions(EvaluatedLanguageAbility).map(
                    ({ value }) => ({
                      value,
                      label: value,
                    }),
                  )}
                />
              </div>
            </div>
          ) : (
            <div data-h2-padding="b(top, s)">
              <p data-h2-padding="b(bottom, s)">
                {intl.formatMessage({
                  defaultMessage:
                    "If you want to find out your language proficiency levels, click here to find out.",
                  description:
                    "Text including link to language proficiency evaluation in language information form",
                })}
              </p>
              <RadioGroup
                idPrefix="estimated-proficiency"
                legend={intl.formatMessage({
                  defaultMessage: "Second language proficiency level",
                  description:
                    "Legend for second language proficiency level in language information form",
                })}
                name="estimatedProficiency"
                items={EstimatedAbilityItems}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const LanguageInformationFormContainer: React.FunctionComponent = () => {
  const intl = useIntl();

  // TODO: Update this with an api call
  const self = fakeUsers()[0];

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {};

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "Use the form below to help us better understand your language preferences and capabilities",
        description:
          "Description text for Profile Form wrapper in Language Information Form",
      })}
      title={intl.formatMessage({
        defaultMessage: "Language Information",
        description:
          "Title for Profile Form wrapper in Language Information Form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Language Information",
            description: "Display Text for Language Information Form Page Link",
          }),
        },
      ]}
    >
      <BasicForm onSubmit={onSubmit}>
        <LanguageInformationForm self={self} />
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default LanguageInformationFormContainer;
