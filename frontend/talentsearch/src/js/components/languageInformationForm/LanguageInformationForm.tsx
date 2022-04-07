import React, { ReactNode } from "react";
import { useIntl } from "react-intl";
import { errorMessages } from "@common/messages";
import {
  BasicForm,
  Checklist,
  RadioGroup,
  Select,
} from "@common/components/form";
import { SubmitHandler, useWatch } from "react-hook-form";
import { fakeUsers } from "@common/fakeData";
import { enumToOptions } from "@common/helpers/formUtils";
import { compact } from "lodash";
import {
  BilingualEvaluation,
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  User,
} from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

export type FormValues = Pick<
  User,
  | "bilingualEvaluation"
  | "comprehensionLevel"
  | "writtenLevel"
  | "verbalLevel"
  | "estimatedLanguageAbility"
> & {
  consideredPositionLanguages: string[];
};

export const LanguageInformationForm: React.FunctionComponent = () => {
  const intl = useIntl();

  const bold = (msg: string) => {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  };
  const greyText = (msg: string) => {
    return <span data-h2-font-color="b([dark]gray)">{msg}</span>;
  };

  const consideredLanguages = useWatch({
    name: "consideredPositionLanguages",
  });
  const bilingualEvaluation = useWatch({
    name: "bilingualEvaluation",
  });

  const ConsideredLangItems: { value: string; label: string }[] = [
    {
      value: "lookingForEnglish",
      label: intl.formatMessage({
        defaultMessage: "English positions",
        description: "Message for the english positions option",
      }),
    },
    {
      value: "lookingForFrench",
      label: intl.formatMessage({
        defaultMessage: "French positions",
        description: "Message for the french positions option",
      }),
    },
    {
      value: "lookingForBilingual",
      label: intl.formatMessage({
        defaultMessage: "Bilingual positions (English and French)",
        description: "Message for the bilingual positions option",
      }),
    },
  ];
  // TODO: Add in the underline/link to these once I figure out which it should be
  const BilingualEvaluationItems: {
    value: string;
    label: string | ReactNode;
  }[] = [
    {
      value: BilingualEvaluation.CompletedEnglish,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <bold>have</bold> completed an official <bold>ENGLISH</bold> Government of Canada language evaluation.",
          description:
            "Message for the completed english bilingual evaluation option",
        },
        {
          bold,
        },
      ),
    },
    {
      value: BilingualEvaluation.CompletedFrench,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <bold>have</bold> completed an official <bold>FRENCH</bold> Government of Canada language evaluation.",
          description:
            "Message for the completed french bilingual evaluation option",
        },
        {
          bold,
        },
      ),
    },
    {
      value: BilingualEvaluation.NotCompleted,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <bold>have NOT</bold> completed an official Government of Canada language evaluation.",
          description:
            "Message for the haven't completed bilingual evaluation option",
        },
        {
          bold,
        },
      ),
    },
  ];
  const EvaluatedAbilityItemsSortOrder = [
    EvaluatedLanguageAbility.X,
    EvaluatedLanguageAbility.A,
    EvaluatedLanguageAbility.B,
    EvaluatedLanguageAbility.C,
    EvaluatedLanguageAbility.E,
    EvaluatedLanguageAbility.P,
  ];
  const EvaluatedAbilityItems: { value: string; label: string }[] =
    enumToOptions(EvaluatedLanguageAbility, EvaluatedAbilityItemsSortOrder).map(
      ({ value }) => ({
        value,
        label: value,
      }),
    );
  const EstimatedAbilityItems: { value: string; label: string | ReactNode }[] =
    [
      {
        value: EstimatedLanguageAbility.Beginner,
        label: intl.formatMessage(
          {
            defaultMessage:
              "Beginner <greyText>- I have basic reading, writing and verbal communication skills.</greyText>",
            description: "Message for the beginner language ability option",
          },
          {
            greyText,
          },
        ),
      },
      {
        value: EstimatedLanguageAbility.Intermediate,
        label: intl.formatMessage(
          {
            defaultMessage:
              "Intermediate <greyText>- I have strong reading, writing and verbal communication skills.</greyText>",
            description: "Message for the intermediate language ability option",
          },
          {
            greyText,
          },
        ),
      },
      {
        value: EstimatedLanguageAbility.Advanced,
        label: intl.formatMessage(
          {
            defaultMessage:
              "Advanced <greyText>- I am completely fluent.</greyText>",
            description: "Message for the advanced language ability option",
          },
          {
            greyText,
          },
        ),
      },
    ];

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
            }}
            items={ConsideredLangItems}
          />
        </div>
        {consideredLanguages.includes("lookingForBilingual") && (
          <>
            <div data-h2-padding="b(top, s)">
              <RadioGroup
                idPrefix="bilingualEvaluation"
                legend={intl.formatMessage({
                  defaultMessage: "Bilingual evaluation",
                  description:
                    "Legend bilingual evaluation status in language information form",
                })}
                name="bilingualEvaluation"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={BilingualEvaluationItems}
              />
            </div>
            {bilingualEvaluation !== BilingualEvaluation.NotCompleted ? (
              <div data-h2-padding="b(top, s)">
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please indicate the language levels you acquired from your Government of Canada language evaluation.",
                    description:
                      "Text requesting language levels given from bilingual evaluation in language information form",
                  })}
                </p>
                <div data-h2-flex-grid="b(normal, contained, flush, m)">
                  <div data-h2-flex-item="b(1of1) s(1of3) l(1of4)">
                    <Select
                      id="comprehensionLevel"
                      name="comprehensionLevel"
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
                      options={EvaluatedAbilityItems}
                    />
                  </div>
                  <div data-h2-flex-item="b(1of1) s(1of3) l(1of4)">
                    <Select
                      id="writtenLevel"
                      name="writtenLevel"
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
                      options={EvaluatedAbilityItems}
                    />
                  </div>
                  <div data-h2-flex-item="b(1of1) s(1of3) l(1of4)">
                    <Select
                      id="verbalLevel"
                      name="verbalLevel"
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
                      options={EvaluatedAbilityItems}
                    />
                  </div>
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
                  idPrefix="estimatedLanguageAbility"
                  legend={intl.formatMessage({
                    defaultMessage: "Second language proficiency level",
                    description:
                      "Legend for second language proficiency level in language information form",
                  })}
                  name="estimatedLanguageAbility"
                  items={EstimatedAbilityItems}
                />
              </div>
            )}
          </>
        )}
      </div>
      <ProfileFormFooter mode="saveButton" />
    </ProfileFormWrapper>
  );
};

// TODO: Update type with proper query data
export const dataToFormValues = (data: User): FormValues => ({
  ...data,
  consideredPositionLanguages: compact([
    data.lookingForEnglish ? "lookingForEnglish" : "",
    data.lookingForFrench ? "lookingForFrench" : "",
    data.lookingForBilingual ? "lookingForBilingual" : "",
  ]),
  bilingualEvaluation: data.bilingualEvaluation
    ? data.bilingualEvaluation
    : BilingualEvaluation.CompletedEnglish,
});

export const LanguageInformationFormContainer: React.FunctionComponent = () => {
  // TODO: Update this with an api call
  const self = fakeUsers()[0];

  // TODO: Replace this with an api call
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {};

  return (
    <BasicForm onSubmit={onSubmit} options={{ defaultValues: {} }}>
      <LanguageInformationForm />
    </BasicForm>
  );
};

export default LanguageInformationFormContainer;
