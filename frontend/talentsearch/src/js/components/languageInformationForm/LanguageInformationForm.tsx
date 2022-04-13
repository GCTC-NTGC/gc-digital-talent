import React, { ReactNode } from "react";
import { useIntl } from "react-intl";
import { commonMessages, errorMessages } from "@common/messages";
import { Checklist, RadioGroup, Select } from "@common/components/form";
import { FormProvider, useForm } from "react-hook-form";
import { enumToOptions } from "@common/helpers/formUtils";
import { compact, omit } from "lodash";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import {
  BilingualEvaluation,
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  GetLanguageInformationQuery,
  UpdateUserAsUserInput,
  useGetLanguageInformationQuery,
  User,
  useUpdateLanguageInformationMutation,
} from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import applicantProfileRoutes from "../../applicantProfileRoutes";

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

// TODO: Look at updating this including resetting un-rendered values
const formValuesToSubmitData = (formValues: FormValues) => {
  const data = {
    ...omit(formValues, ["consideredPositionLanguages"]),
    lookingForEnglish:
      formValues.consideredPositionLanguages.includes("lookingForEnglish"),
    lookingForFrench:
      formValues.consideredPositionLanguages.includes("lookingForFrench"),
    lookingForBilingual: formValues.consideredPositionLanguages.includes(
      "lookingForBilingual",
    ),
  };

  // various IF statements are to clean up cases where user toggles the conditionally rendered stuff before submitting
  // IE, picks looking for bilingual, then picks completed english evaluation before submitting, the conditionally rendered stuff still exists and can get submitted
  if (!data.lookingForBilingual) {
    data.bilingualEvaluation = null;
  }
  if (
    data.bilingualEvaluation !== BilingualEvaluation.CompletedEnglish &&
    data.bilingualEvaluation !== BilingualEvaluation.CompletedFrench
  ) {
    data.comprehensionLevel = null;
    data.writtenLevel = null;
    data.verbalLevel = null;
  }
  if (data.bilingualEvaluation !== BilingualEvaluation.NotCompleted) {
    data.estimatedLanguageAbility = null;
  }

  return data;
};

const dataToFormValues = (
  data: GetLanguageInformationQuery["me"],
): FormValues => {
  return {
    consideredPositionLanguages: compact([
      data?.lookingForEnglish ? "lookingForEnglish" : "",
      data?.lookingForFrench ? "lookingForFrench" : "",
      data?.lookingForBilingual ? "lookingForBilingual" : "",
    ]),
    bilingualEvaluation: data?.bilingualEvaluation
      ? data.bilingualEvaluation
      : BilingualEvaluation.CompletedEnglish,
    comprehensionLevel: data?.comprehensionLevel,
    writtenLevel: data?.writtenLevel,
    verbalLevel: data?.verbalLevel,
    estimatedLanguageAbility: data?.estimatedLanguageAbility,
  };
};

export const LanguageInformationForm: React.FunctionComponent<{
  initialData: GetLanguageInformationQuery["me"];
  submitHandler: (data: UpdateUserAsUserInput) => Promise<void>;
}> = ({ initialData, submitHandler }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const defaultValues = dataToFormValues(initialData);

  const methods = useForm({
    defaultValues,
  });

  const onSubmit = (values: FormValues) =>
    submitHandler(formValuesToSubmitData(values));

  // hooks to watch, needed for conditional rendering
  const [consideredLanguages, bilingualEvaluation] = methods.watch([
    "consideredPositionLanguages",
    "bilingualEvaluation",
  ]);

  const bold = (msg: string) => {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  };
  const greyText = (msg: string) => {
    return <span data-h2-font-color="b([dark]gray)">{msg}</span>;
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
          description: "Message on links to the language evaluation tests",
        })}
      </a>
    );
  };
  const selfAssessmentLink = (msg: string) => {
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
  const BilingualEvaluationItems: {
    value: string;
    label: string | ReactNode;
  }[] = [
    {
      value: BilingualEvaluation.CompletedEnglish,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <bold>have</bold> completed an official <bold>ENGLISH</bold> <languageEvaluationPageLink></languageEvaluationPageLink>",
          description:
            "Message for the completed english bilingual evaluation option",
        },
        {
          bold,
          languageEvaluationPageLink,
        },
      ),
    },
    {
      value: BilingualEvaluation.CompletedFrench,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <bold>have</bold> completed an official <bold>FRENCH</bold> <languageEvaluationPageLink></languageEvaluationPageLink>",
          description:
            "Message for the completed french bilingual evaluation option",
        },
        {
          bold,
          languageEvaluationPageLink,
        },
      ),
    },
    {
      value: BilingualEvaluation.NotCompleted,
      label: intl.formatMessage(
        {
          defaultMessage:
            "I am bilingual (En/Fr) and <bold>have NOT</bold> completed an official <languageEvaluationPageLink></languageEvaluationPageLink>",
          description:
            "Message for the haven't completed bilingual evaluation option",
        },
        {
          bold,
          languageEvaluationPageLink,
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
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                description:
                  "Display Text for Language Information Form Page Link",
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
                            required: intl.formatMessage(
                              errorMessages.required,
                            ),
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
                            required: intl.formatMessage(
                              errorMessages.required,
                            ),
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
                            required: intl.formatMessage(
                              errorMessages.required,
                            ),
                          }}
                          options={EvaluatedAbilityItems}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div data-h2-padding="b(top, s)">
                    <p data-h2-padding="b(bottom, s)">
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "If you want to find out your language proficiency levels, <selfAssessmentLink>click here to find out.</selfAssessmentLink>",
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
      </form>
    </FormProvider>
  );
};

export const LanguageInformationFormContainer: React.FunctionComponent = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);

  const [lookUpResult] = useGetLanguageInformationQuery();
  const { data: userData, fetching, error } = lookUpResult;
  const userId = userData?.me?.id;

  const [, executeMutation] = useUpdateLanguageInformationMutation();

  const handleUpdateUser = (id: string, data: UpdateUserAsUserInput) =>
    executeMutation({ id, user: data }).then((result) => {
      if (result.data?.updateUserAsUser) {
        return result.data.updateUserAsUser;
      }
      return Promise.reject(result.error);
    });

  const onSubmit = async (data: UpdateUserAsUserInput) => {
    if (userId === undefined || userId === "") {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error: user not found",
          description: "Message displayed to user if user is not found",
        }),
      );
      return;
    }
    await handleUpdateUser(userId, data)
      .then(() => {
        navigate(paths.home());
        toast.success(
          intl.formatMessage({
            defaultMessage: "User updated successfully!",
            description:
              "Message displayed to user after user is updated successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating user failed",
            description:
              "Message displayed to user after user fails to get updated.",
          }),
        );
      });
  };

  if (fetching) {
    return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  }

  if (error || !userData) {
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error?.message || ""}
      </p>
    );
  }

  if (!userId) {
    return (
      <p>
        {intl.formatMessage({
          defaultMessage: "Error: user not found",
          description: "Message displayed to user if user is not found",
        })}
      </p>
    );
  }

  return (
    <LanguageInformationForm
      initialData={userData.me}
      submitHandler={onSubmit}
    />
  );
};

export default LanguageInformationFormContainer;
