import React, { ReactNode } from "react";
import { useIntl } from "react-intl";
import { commonMessages, errorMessages } from "@common/messages";
import {
  BasicForm,
  Checklist,
  RadioGroup,
  Select,
} from "@common/components/form";
import { SubmitHandler, useWatch } from "react-hook-form";
import { enumToOptions } from "@common/helpers/formUtils";
import { compact, omit } from "lodash";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import { toast } from "react-toastify";
import { OperationResult } from "urql";
import {
  BilingualEvaluation,
  EstimatedLanguageAbility,
  EvaluatedLanguageAbility,
  Exact,
  GetLanguageInformationQuery,
  UpdateLanguageInformationMutation,
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

const FormStructure = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

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
        Government of Canada language evaluation.
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
  );
};

export interface LanguageInformationFormProps {
  initialData: GetLanguageInformationQuery | undefined;
  onUpdateLanguageInformation: (
    id: string,
    data: UpdateUserAsUserInput,
  ) => Promise<UpdateLanguageInformationMutation["updateUserAsUser"]>;
}

export const LanguageInformationForm: React.FunctionComponent<
  LanguageInformationFormProps
> = ({ initialData, onUpdateLanguageInformation }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);

  const dataToFormValues = (data: GetLanguageInformationQuery): FormValues => {
    const self = data.me;
    return {
      ...omit(self, [
        "id",
        "__typename",
        "lookingForEnglish",
        "lookingForFrench",
        "lookingForBilingual",
      ]),
      consideredPositionLanguages: compact([
        self?.lookingForEnglish ? "lookingForEnglish" : "",
        self?.lookingForFrench ? "lookingForFrench" : "",
        self?.lookingForBilingual ? "lookingForBilingual" : "",
      ]),
      bilingualEvaluation: self?.bilingualEvaluation
        ? self.bilingualEvaluation
        : BilingualEvaluation.CompletedEnglish,
    };
  };

  const formValuesToSubmitData = (formValues: FormValues) => {
    return {
      ...omit(formValues, ["consideredPositionLanguages"]),
      lookingForEnglish:
        formValues.consideredPositionLanguages.includes("lookingForEnglish"),
      lookingForFrench:
        formValues.consideredPositionLanguages.includes("lookingForFrench"),
      lookingForBilingual: formValues.consideredPositionLanguages.includes(
        "lookingForBilingual",
      ),
    };
  };

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    if (!initialData?.me?.id) {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error: user not found",
          description: "Message displayed to user if user is not found",
        }),
      );
      return;
    }

    await onUpdateLanguageInformation(
      initialData?.me?.id,
      formValuesToSubmitData(formValues),
    )
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

  return initialData?.me ? (
    <BasicForm
      onSubmit={handleSubmit}
      options={{ defaultValues: dataToFormValues(initialData) }}
    >
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
        <FormStructure />
        <ProfileFormFooter mode="saveButton" />
      </ProfileFormWrapper>
    </BasicForm>
  ) : (
    <p>
      {intl.formatMessage({
        defaultMessage: "Could not load user.",
        description:
          "Error message that appears when current user could not be retrieved.",
      })}
    </p>
  );
};

export const LanguageInformationFormContainer: React.FunctionComponent = () => {
  const intl = useIntl();

  const [result] = useGetLanguageInformationQuery();
  const { data: userData, fetching, error } = result;

  const [, executeMutation] = useUpdateLanguageInformationMutation();

  const handleUpdateUser = async (
    id: string,
    values: UpdateUserAsUserInput,
  ) => {
    return executeMutation({ id, user: values }).then(
      (
        res: OperationResult<
          UpdateLanguageInformationMutation,
          Exact<{ id: string; user: UpdateUserAsUserInput }>
        >,
      ) => {
        if (res.data?.updateUserAsUser) {
          return res.data.updateUserAsUser;
        }

        return Promise.reject(res.error);
      },
    );
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

  return (
    <LanguageInformationForm
      initialData={userData}
      onUpdateLanguageInformation={handleUpdateUser}
    />
  );
};

export default LanguageInformationFormContainer;
