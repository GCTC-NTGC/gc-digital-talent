import { useIntl } from "react-intl";
import { useQuery } from "urql";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

import {
  DateInput,
  Input,
  DATE_SEGMENT,
  localizedEnumToOptions,
  TextArea,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import type { Locales } from "@gc-digital-talent/i18n";
import {
  errorMessages,
  sortAwardedTo,
  sortAwardedScope,
  getLocale,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { AwardedScope, AwardedTo, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Loading } from "@gc-digital-talent/ui";

import type {
  AwardFormValues,
  SubExperienceFormProps,
} from "~/types/experience";
import {
  getExperienceFormLabels,
  getExperienceName,
  isAwardExperience,
} from "~/utils/experienceUtils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const AwardOptions_Query = graphql(/* GraphQL */ `
  query AwardOptions {
    awardedTo: localizedEnumStrings(enumName: "AwardedTo") {
      value
      label {
        localized
      }
    }
    awardedScopes: localizedEnumStrings(enumName: "AwardedScope") {
      value
      label {
        localized
      }
    }
    me {
      id
      experiences {
        id
        ... on CommunityExperience {
          __typename
          id
          title
          organization
        }
        ... on EducationExperience {
          __typename
          id
          educationType {
            value
            label {
              localized
            }
          }
          degreeType {
            label {
              localized
            }
          }
          fellowshipType {
            value
            label {
              localized
            }
          }
          otherFellowshipType
          otherEducationType
          areaOfStudy
          institution
          licenseOrAccreditation
          certification
        }
        ... on PersonalExperience {
          __typename
          id
          title
        }
        ... on WorkExperience {
          __typename
          id
          role
          organization
          employmentCategory {
            value
          }
          department {
            id
            name {
              en
              fr
            }
          }
          cafForce {
            label {
              en
              fr
            }
          }
        }
      }
    }
  }
`);

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

const AwardFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceLabels = getExperienceFormLabels(intl);
  const todayDate = new Date();
  const [{ data, fetching }] = useQuery({ query: AwardOptions_Query });
  const myExperiences = unpackMaybes(data?.me?.experiences).filter(
    (experience) => !isAwardExperience(experience),
  );

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  const { resetField, setValue } = useFormContext<AwardFormValues>();
  const watchAwardedTo = useWatch<AwardFormValues>({
    name: "awardedTo",
  });
  const watchRelatedExperienceId = useWatch<AwardFormValues>({
    name: "relatedExperienceId",
  });

  useEffect(() => {
    // Reset the project name if awarded to changes
    if (watchAwardedTo !== AwardedTo.MyProject) {
      resetField("projectName", { keepDirty: false, defaultValue: null });
    }

    // Set the related experience type
    const relatedExperienceType = myExperiences.find(
      (experience) => experience.id === watchRelatedExperienceId,
    );
    if (relatedExperienceType) {
      setValue("relatedExperienceType", relatedExperienceType.__typename);
    }
  }, [
    watchAwardedTo,
    watchRelatedExperienceId,
    resetField,
    myExperiences,
    setValue,
  ]);

  return (
    <>
      {fetching ? (
        <div className="col-span-2">
          <Loading inline />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 xs:grid-cols-2">
            <Input
              id="awardTitle"
              label={labels.awardTitle}
              name="awardTitle"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <DateInput
              id="awardedDate"
              legend={labels.awardedDate}
              name="awardedDate"
              show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                max: {
                  value: strToFormDate(todayDate.toISOString()),
                  message: intl.formatMessage(
                    errorMessages.mustNotBeFutureAwardedDate,
                  ),
                },
              }}
            />
            <Input
              id="issuedBy"
              label={labels.issuedBy}
              name="issuedBy"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
              list={
                organizationSuggestions.length
                  ? "organizationSuggestions"
                  : undefined
              }
            />
            {organizationSuggestions.length > 0 && (
              <datalist id="organizationSuggestions">
                {organizationSuggestions.map((suggestion) => {
                  return <option key={suggestion} value={suggestion}></option>;
                })}
              </datalist>
            )}
            <Select
              id="relatedExperienceId"
              label={labels.relatedExperience}
              name="relatedExperienceId"
              nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
              options={myExperiences.map((experience) => ({
                value: experience.id,
                label: getExperienceName(experience, intl),
              }))}
            />
            <RadioGroup
              idPrefix="awardedTo"
              name="awardedTo"
              legend={labels.awardedTo}
              items={localizedEnumToOptions(
                sortAwardedTo(data?.awardedTo),
                intl,
              )}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />

            {watchAwardedTo === AwardedTo.MyProject && (
              <Input
                id="projectName"
                label={labels.projectName}
                name="projectName"
                type="text"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
              />
            )}
            <RadioGroup
              idPrefix="awardedScope"
              name="awardedScope"
              legend={labels.awardedScope}
              items={localizedEnumToOptions(
                sortAwardedScope(data?.awardedScopes),
                intl,
              ).map(({ value, label }) => {
                return {
                  label,
                  value,
                  contentBelow:
                    value === AwardedScope.SubOrganizational.toString()
                      ? intl.formatMessage({
                          defaultMessage:
                            "Recognized by the branch, team, etc.",
                          id: "5hHlpL",
                          description:
                            "Additional info on sub org radio button",
                        })
                      : null,
                };
              })}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "If there are any other relevant details about this experience you'd like to share, you can do so here.",
                id: "ioYWI6",
                description:
                  "Help text for the experience additional details field",
              })}
            </p>
            <TextArea
              id="details"
              name="details"
              rows={TEXT_AREA_ROWS}
              wordLimit={wordCountLimits[locale]}
              label={experienceLabels.details}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AwardFields;
