import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";

import { Checklist, MultiSelect, RadioGroup } from "@common/components/form";
import { getLanguageAbility } from "@common/constants";
import {
  getEmploymentEquityGroup,
  getOperationalRequirement,
  getWorkRegion,
  OperationalRequirementV2,
} from "@common/constants/localizedConstants";
import { enumToOptions, unpackMaybes } from "@common/helpers/formUtils";
import { useLocation } from "@common/helpers/router";
import {
  Classification,
  LanguageAbility,
  PoolCandidateFilter,
  Skill,
  ApplicantFilterInput,
  WorkRegion,
  UserPoolFilterInput,
} from "../../api/generated";
import FilterBlock from "./FilterBlock";
import AddSkillsToFilter from "../skills/AddSkillsToFilter";

const NullSelection = "NULL_SELECTION";

function mapIdToValue<T extends { id: string }>(objects: T[]): Map<string, T> {
  return objects.reduce((map, obj) => {
    map.set(obj.id, obj);
    return map;
  }, new Map());
}

type Option<V> = { value: V; label: string };
export type FormValues = Pick<
  PoolCandidateFilter,
  "workRegions" | "operationalRequirements"
> & {
  languageAbility: LanguageAbility | typeof NullSelection;
  employmentDuration: string | typeof NullSelection;
  classifications: string[] | undefined;
  skills: string[] | undefined;
  employmentEquity: string[] | undefined;
  educationRequirement: "has_diploma" | "no_diploma";
  poolId: string;
  poolCandidates: UserPoolFilterInput;
};

type LocationState = {
  some: {
    initialValues: FormValues;
  };
};

export interface SearchFormProps {
  classifications: Classification[];
  skills?: Skill[];
  onUpdateCandidateFilter: (filter: ApplicantFilterInput) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  classifications,
  skills,
  onUpdateCandidateFilter,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const classificationMap = React.useMemo(
    () => mapIdToValue(classifications),
    [classifications],
  );

  // The location state holds the initial values plugged in from user. This is required if the user decides to click back and change any values.
  const state = location.state as LocationState;
  const initialValues = React.useMemo(
    () => (state ? state.some.initialValues : {}),
    [state],
  );
  const methods = useForm<FormValues>({ defaultValues: initialValues });
  const { watch } = methods;

  React.useEffect(() => {
    onUpdateCandidateFilter(initialValues);
  }, [initialValues, onUpdateCandidateFilter]);

  React.useEffect(() => {
    const formValuesToData = (values: FormValues): ApplicantFilterInput => {
      return {
        expectedClassifications: values.classifications
          ? values.classifications
              ?.filter((id) => !!id)
              .map((id) => (id ? classificationMap.get(id) : undefined))
          : [],
        skills: values.skills
          ? values.skills
              .filter((id) => !!id)
              .map((id) => ({
                id,
              }))
          : [],
        operationalRequirements: values.operationalRequirements
          ? unpackMaybes(values.operationalRequirements)
          : [],
        hasDiploma: values.educationRequirement === "has_diploma",
        equity: {
          hasDisability:
            values.employmentEquity &&
            values.employmentEquity?.includes("hasDisability"),
          isIndigenous:
            values.employmentEquity &&
            values.employmentEquity?.includes("isIndigenous"),
          isVisibleMinority:
            values.employmentEquity &&
            values.employmentEquity?.includes("isVisibleMinority"),
          isWoman:
            values.employmentEquity &&
            values.employmentEquity?.includes("isWoman"),
        },
        ...(values.languageAbility !== NullSelection
          ? { languageAbility: values.languageAbility as LanguageAbility }
          : {}), // Ensure null in FormValues is converted to undefined
        wouldAcceptTemporary:
          values.employmentDuration === "true" ? true : null,
        locationPreferences: values.workRegions || [],
      };
    };

    const debounceUpdate = debounce((values: ApplicantFilterInput) => {
      if (onUpdateCandidateFilter) {
        onUpdateCandidateFilter(values);
      }
    }, 200);

    const subscription = watch((newValues) => {
      const values = formValuesToData(newValues as FormValues);
      debounceUpdate(values);
    });

    return () => subscription.unsubscribe();
  }, [watch, classificationMap, onUpdateCandidateFilter]);

  const classificationOptions: Option<string>[] = React.useMemo(
    () =>
      classifications.map(({ id, group, level }) => ({
        value: id,
        label: `${group}-0${level}`,
      })),
    [classifications],
  );

  return (
    <FormProvider {...methods}>
      <form>
        <FilterBlock
          id="classificationsFilter"
          title={intl.formatMessage({
            defaultMessage: "Classification filter",
            description:
              "Heading for classification filter of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "We use this filter to match candidates who express interest in a classification level, or certain expected salaries in these classifications.",
            description:
              "Message describing the classification filter of the search form.",
          })}
        >
          <MultiSelect
            id="classifications"
            label={intl.formatMessage({
              defaultMessage: "Classification filter",
              description: "Label for classification filter in search form.",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Select one or more classification(s)",
              description:
                "Placeholder for classification filter in search form.",
            })}
            name="classifications"
            options={classificationOptions}
          />
        </FilterBlock>
        <FilterBlock
          id="educationRequirementFilter"
          title={intl.formatMessage({
            defaultMessage: "Education requirement for the job",
            description:
              "Heading for education requirement filter of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "Most jobs in the Digital community do not require a diploma, change this only if the job requires a diploma.",
            description:
              "Message describing the education requirement filter of the search form.",
          })}
        >
          <RadioGroup
            idPrefix="education_requirement"
            legend={intl.formatMessage({
              defaultMessage: "Education Requirement filter",
              description:
                "Legend for the Education Requirement filter radio group",
            })}
            name="educationRequirement"
            defaultSelected="no_diploma"
            items={[
              {
                value: "no_diploma",
                label: intl.formatMessage({
                  defaultMessage:
                    "Can accept a combination of work experience and education",
                  description:
                    "Radio group option for education requirement filter in search form.",
                }),
              },
              {
                value: "has_diploma",
                label: intl.formatMessage({
                  defaultMessage:
                    "Required diploma from post-secondary institution",
                  description:
                    "Radio group option for education requirement filter in search form.",
                }),
              },
            ]}
          />
        </FilterBlock>
        <FilterBlock
          id="operationalRequirementFilter"
          title={intl.formatMessage({
            defaultMessage:
              "Conditions of employment / Operational requirements",
            description:
              "Heading for operational requirements section of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "The selected conditions of employment will be compared to those chosen by candidates in their applications.",
            description:
              "Message describing the operational requirements filter in the search form.",
          })}
        >
          <Checklist
            idPrefix="operationalRequirements"
            legend={intl.formatMessage({
              defaultMessage: "Conditions of employment",
              description:
                "Legend for the Conditions of Employment filter checklist",
            })}
            name="operationalRequirements"
            items={OperationalRequirementV2.map((value) => ({
              value,
              label: intl.formatMessage(getOperationalRequirement(value)),
            }))}
          />
        </FilterBlock>
        <FilterBlock
          id="workLocationFilter"
          title={intl.formatMessage({
            defaultMessage: "Work location",
            description:
              "Heading for work location section of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "If you have more detailed work location requirement, let us know in the comment section of the submission form.",
            description:
              "Message describing the work location filter in the search form.",
          })}
        >
          <MultiSelect
            id="workRegions"
            name="workRegions"
            label={intl.formatMessage({
              defaultMessage: "Region",
              description: "Label for work location filter in search form.",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Select a location...",
              description:
                "Placeholder for work location filter in search form.",
            })}
            options={enumToOptions(WorkRegion).map(({ value }) => ({
              value,
              label: intl.formatMessage(getWorkRegion(value)),
            }))}
          />
        </FilterBlock>
        <FilterBlock
          id="workingLanguageFilter"
          title={intl.formatMessage({
            defaultMessage: "Working language ability",
            description:
              "Heading for working language ability section of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "Select the working language ability the candidate needs for this position.",
            description:
              "Message describing the work language ability filter in the search form.",
          })}
        >
          <RadioGroup
            idPrefix="languageAbility"
            legend={intl.formatMessage({
              defaultMessage: "Language",
              description:
                "Legend for the Working Language Ability radio buttons",
            })}
            name="languageAbility"
            defaultSelected={NullSelection}
            items={[
              {
                value: NullSelection,
                label: intl.formatMessage({
                  defaultMessage: "Any language (English or French)",
                  description:
                    "No preference for language ability - will accept English or French",
                }),
              },
              ...enumToOptions(LanguageAbility).map(({ value }) => ({
                value,
                label: intl.formatMessage(getLanguageAbility(value)),
              })),
            ]}
          />
        </FilterBlock>
        <FilterBlock
          id="employmentDurationFilter"
          title={intl.formatMessage({
            defaultMessage: "Employment Duration",
            description:
              "Heading for employment duration section of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "The selected duration will be compared to the one chosen by candidates in their applications. Change this only if the job offer has a determined duration.",
            description:
              "Message describing the employment duration filter in the search form.",
          })}
        >
          <RadioGroup
            idPrefix="employmentDuration"
            legend="Duration"
            name="employmentDuration"
            defaultSelected={NullSelection}
            items={[
              {
                value: NullSelection,
                label: intl.formatMessage({
                  defaultMessage:
                    "Any duration (short term, long term or indeterminate) (Recommended)",
                  description:
                    "No preference for employment duration - will accept any",
                }),
              },
              {
                value: "true",
                label: intl.formatMessage({
                  defaultMessage: "Term duration (short term, long term)",
                  description: "Duration of a non-permanent length",
                }),
              },
              {
                value: "nothing",
                label: intl.formatMessage({
                  defaultMessage: "Indeterminate duration (permanent)",
                  description: "Duration that is permanent",
                }),
              },
            ]}
          />
        </FilterBlock>
        <FilterBlock
          id="employmentEquityFilter"
          title={intl.formatMessage({
            defaultMessage: "Employment equity",
            description:
              "Heading for employment equity section of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "Managers can request candidates by employment equity group(s) to address current of future representation gaps in the workforce. (Categories reflect EE data defined under the Public Service Employment Act and collected through the PSC application process. For consistency, this platform reflects the PSC's category terminology.)",
            description:
              "Message describing the employment equity filter in the search form.",
          })}
        >
          <Checklist
            idPrefix="employmentEquity"
            legend={intl.formatMessage({
              defaultMessage: "Employment equity groups",
              description: "Legend for the employment equity checklist",
            })}
            name="employmentEquity"
            context={intl.formatMessage({
              defaultMessage:
                "<strong>Note:</strong> If you select more than one employment equity group, ALL candidates who have self-declared as being members of ANY of the selected EE groups will be referred. If you have more detailed EE requirements, let us know in the comment section of the submission form.",
              description:
                "Context for employment equity filter in search form.",
            })}
            items={[
              {
                value: "isWoman",
                label: intl.formatMessage(getEmploymentEquityGroup("woman")),
              },
              {
                value: "isIndigenous",
                label: intl.formatMessage(
                  getEmploymentEquityGroup("indigenous"),
                ),
              },
              {
                value: "isVisibleMinority",
                label: intl.formatMessage(getEmploymentEquityGroup("minority")),
              },
              {
                value: "hasDisability",
                label: intl.formatMessage(
                  getEmploymentEquityGroup("disability"),
                ),
              },
            ]}
          />
        </FilterBlock>
        <AddSkillsToFilter allSkills={skills ?? []} />
      </form>
    </FormProvider>
  );
};

export default SearchForm;
