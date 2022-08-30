import React, { ReactNode } from "react";
import { useIntl } from "react-intl";
import { commonMessages, errorMessages } from "@common/messages";
import { Checklist, RadioGroup, Select } from "@common/components/form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { enumToOptions } from "@common/helpers/formUtils";
import { compact, omit } from "lodash";
import { getLocale } from "@common/helpers/localize";
import { checkFeatureFlag } from "@common/helpers/runtimeVariable";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import { BriefcaseIcon } from "@heroicons/react/solid";
import {
  BilingualEvaluation,
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  GetLanguageInformationQuery,
  PoolCandidate,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
  User,
} from "../../api/generated";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";
import applicantProfileRoutes from "../../applicantProfileRoutes";
import directIntakeRoutes from "../../directIntakeRoutes";
import profileMessages from "../profile/profileMessages";

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

export type LanguageInformationUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;

export const LanguageInformationForm: React.FunctionComponent<{
  initialData: User;
  application?: PoolCandidate;
  submitHandler: LanguageInformationUpdateHandler;
}> = ({ initialData, application, submitHandler }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const profilePaths = applicantProfileRoutes(locale);
  const directIntakePaths = directIntakeRoutes(locale);
  const returnRoute =
    application && checkFeatureFlag("FEATURE_DIRECTINTAKE")
      ? directIntakePaths.poolApply(application.pool.id)
      : profilePaths.home(initialData.id);

  const defaultValues = dataToFormValues(initialData);

  const methods = useForm({
    defaultValues,
  });

  const onSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await submitHandler(initialData.id, formValuesToSubmitData(formValues))
      .then(() => {
        navigate(returnRoute);
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  // hooks to watch, needed for conditional rendering
  const [consideredLanguages, bilingualEvaluation] = methods.watch([
    "consideredPositionLanguages",
    "bilingualEvaluation",
  ]);

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
            "I am bilingual (En/Fr) and <strong>have</strong> completed an official <strong>ENGLISH</strong> <languageEvaluationPageLink></languageEvaluationPageLink>",
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
          description:
            "Message for the haven't completed bilingual evaluation option",
        },
        {
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
        label: intl.formatMessage({
          defaultMessage:
            "Beginner <gray>- I have basic reading, writing and verbal communication skills.</gray>",
          description: "Message for the beginner language ability option",
        }),
      },
      {
        value: EstimatedLanguageAbility.Intermediate,
        label: intl.formatMessage({
          defaultMessage:
            "Intermediate <gray>- I have strong reading, writing and verbal communication skills.</gray>",
          description: "Message for the intermediate language ability option",
        }),
      },
      {
        value: EstimatedLanguageAbility.Advanced,
        label: intl.formatMessage({
          defaultMessage: "Advanced <gray>- I am completely fluent.</gray>",
          description: "Message for the advanced language ability option",
        }),
      },
    ];

  const applicationBreadcrumbs = application
    ? [
        {
          title: intl.formatMessage({
            defaultMessage: "My Applications",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          href: directIntakePaths.applications(application.user.id),
          icon: <BriefcaseIcon style={{ width: "1rem", marginRight: "5px" }} />,
        },
        {
          title:
            application.poolAdvertisement?.name?.[locale] ||
            intl.formatMessage({
              defaultMessage: "Pool name not found",
              description:
                "Pools name breadcrumb from applicant profile wrapper if no name set.",
            }),
          href: directIntakePaths.poolApply(application.pool.id),
        },
        {
          href: directIntakePaths.reviewApplication(application.id),
          title: intl.formatMessage(commonMessages.stepOne),
        },
      ]
    : [];

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
          cancelLink={{
            href: returnRoute,
          }}
          crumbs={[
            ...applicationBreadcrumbs,
            {
              title: intl.formatMessage({
                defaultMessage: "Language Information",
                description:
                  "Display Text for Language Information Form Page Link",
              }),
            },
          ]}
          prefixBreadcrumbs={!application}
        >
          <div data-h2-padding="base(0, 0, x2, 0)">
            <div
              data-h2-width="base(100%) p-tablet(75%) l-tablet(50%)"
              data-h2-padding="base(x.5, 0)"
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
                <div data-h2-padding="base(x.5, 0, 0, 0)">
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
                  <div data-h2-padding="base(x.5, 0, 0, 0)">
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Please indicate the language levels you acquired from your Government of Canada language evaluation.",
                        description:
                          "Text requesting language levels given from bilingual evaluation in language information form",
                      })}
                    </p>
                    <div data-h2-flex-grid="base(normal, 0, x1)">
                      <div data-h2-flex-item="base(1of1) p-tablet(1of3) desktop(1of4)">
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
                      <div data-h2-flex-item="base(1of1) p-tablet(1of3) desktop(1of4)">
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
                      <div data-h2-flex-item="base(1of1) p-tablet(1of3) desktop(1of4)">
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
                  <div data-h2-padding="base(x.5, 0, 0, 0)">
                    <p data-h2-padding="base(0, 0, x.5, 0)">
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

export default LanguageInformationForm;
