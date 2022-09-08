import React, { useImperativeHandle } from "react";
import { FormProvider, useForm, UseFormTrigger } from "react-hook-form";
import { defineMessages, MessageDescriptor, useIntl } from "react-intl";
import debounce from "lodash/debounce";

import {
  Checklist,
  MultiSelect,
  RadioGroup,
  Select,
} from "@common/components/form";
import { getLanguageAbility } from "@common/constants";
import {
  getEmploymentEquityGroup,
  getOperationalRequirement,
  getWorkRegion,
  getEmploymentDuration,
  EmploymentDuration,
  OperationalRequirementV2,
} from "@common/constants/localizedConstants";
import { enumToOptions, unpackMaybes } from "@common/helpers/formUtils";
import { useLocation } from "@common/helpers/router";
import errorMessages from "@common/messages/errorMessages";
import { hasKey } from "@common/helpers/util";
import {
  Classification,
  LanguageAbility,
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
  ApplicantFilterInput,
  "locationPreferences" | "operationalRequirements"
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
  onUpdateApplicantFilter: (filter: ApplicantFilterInput) => void;
}

export interface SearchFormRef {
  triggerValidation: UseFormTrigger<FormValues>;
}

const classificationLabels: Record<string, MessageDescriptor> = defineMessages({
  "IT-01": {
    defaultMessage: "IT-01: Technician ($60,000 to $78,000)",
    id: "ZuyuPO",
    description: "IT-01 classification label including titles and salaries",
  },
  "IT-02": {
    defaultMessage: "IT-02: Analyst ($75,000 to $91,000)",
    id: "UN2Ncr",
    description: "IT-02 classification label including titles and salaries",
  },
  "IT-03": {
    defaultMessage:
      "IT-03: Technical Advisor or Team Leader ($88,000 to $110,000)",
    id: "Aa8SIB",
    description: "IT-03 classification label including titles and salaries",
  },
  "IT-04": {
    defaultMessage: "IT-04: Senior Advisor or Manager ($101,000 to $126,000)",
    id: "5YzNJj",
    description: "IT-04 classification label including titles and salaries",
  },
});

const SearchForm = React.forwardRef<SearchFormRef, SearchFormProps>(
  ({ classifications, skills, onUpdateApplicantFilter }, ref) => {
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
    const { watch, trigger } = methods;

    useImperativeHandle(
      ref,
      () => ({
        triggerValidation: trigger,
      }),
      [trigger],
    );

    React.useEffect(() => {
      onUpdateApplicantFilter(initialValues);
    }, [initialValues, onUpdateApplicantFilter]);

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
          locationPreferences: values.locationPreferences || [],
        };
      };

      const debounceUpdate = debounce((values: ApplicantFilterInput) => {
        if (onUpdateApplicantFilter) {
          onUpdateApplicantFilter(values);
        }
      }, 200);

      const subscription = watch((newValues) => {
        const values = formValuesToData(newValues as FormValues);
        debounceUpdate(values);
      });

      return () => subscription.unsubscribe();
    }, [watch, classificationMap, onUpdateApplicantFilter]);

    const getClassificationLabel = React.useCallback(
      (group: string, level: number): string => {
        const key = `${group}-0${level}`;
        return !hasKey(classificationLabels, key)
          ? key
          : intl.formatMessage(classificationLabels[key]);
      },
      [intl],
    );

    const classificationOptions: Option<string>[] = React.useMemo(
      () =>
        classifications.map(({ id, group, level }) => ({
          value: id,
          label: getClassificationLabel(group, level),
        })),
      [classifications, getClassificationLabel],
    );

    return (
      <FormProvider {...methods}>
        <form>
          <FilterBlock
            id="classificationsFilter"
            title={intl.formatMessage({
              defaultMessage: "Classification filter",
              id: "TxVbLI",
              description:
                "Heading for classification filter of the search form.",
            })}
            text={intl.formatMessage({
              defaultMessage:
                "We use this filter to match candidates who express interest in a classification level, or certain expected salaries in these classifications.",
              id: "dxv7Jx",
              description:
                "Message describing the classification filter of the search form.",
            })}
          >
            <Select
              id="classifications"
              label={intl.formatMessage({
                defaultMessage: "Classification filter",
                id: "V8v+/g",
                description: "Label for classification filter in search form.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select one or more classification(s)",
                id: "iNsxYi",
                description:
                  "Placeholder for classification filter in search form.",
              })}
              name="classifications"
              options={classificationOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </FilterBlock>
          <FilterBlock
            id="educationRequirementFilter"
            title={intl.formatMessage({
              defaultMessage: "Education requirement for the job",
              id: "AyP6Fr",
              description:
                "Heading for education requirement filter of the search form.",
            })}
            text={intl.formatMessage({
              defaultMessage:
                "Most jobs in the Digital community do not require a diploma, change this only if the job requires a diploma.",
              id: "mhtcMd",
              description:
                "Message describing the education requirement filter of the search form.",
            })}
          >
            <RadioGroup
              idPrefix="education_requirement"
              legend={intl.formatMessage({
                defaultMessage: "Education Requirement filter",
                id: "/JQ6DD",
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
                    id: "74WtLG",
                    description:
                      "Radio group option for education requirement filter in search form.",
                  }),
                },
                {
                  value: "has_diploma",
                  label: intl.formatMessage({
                    defaultMessage:
                      "Required diploma from post-secondary institution",
                    id: "KoPFx4",
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
              id: "laGCzG",
              description:
                "Heading for operational requirements section of the search form.",
            })}
            text={intl.formatMessage({
              defaultMessage:
                "The selected conditions of employment will be compared to those chosen by candidates in their applications.",
              id: "IT6Djp",
              description:
                "Message describing the operational requirements filter in the search form.",
            })}
          >
            <Checklist
              idPrefix="operationalRequirements"
              legend={intl.formatMessage({
                defaultMessage: "Conditions of employment",
                id: "bKvvaI",
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
            id="locationPreferencesFilter"
            title={intl.formatMessage({
              defaultMessage: "Work location",
              id: "uP+q43",
              description:
                "Heading for work location section of the search form.",
            })}
            text={intl.formatMessage({
              defaultMessage:
                "If you have more detailed work location requirement, let us know in the comment section of the submission form.",
              id: "v7sYE7",
              description:
                "Message describing the work location filter in the search form.",
            })}
          >
            <MultiSelect
              id="locationPreferences"
              name="locationPreferences"
              label={intl.formatMessage({
                defaultMessage: "Region",
                id: "F+WFWB",
                description: "Label for work location filter in search form.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select a location...",
                id: "asqSAJ",
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
              id: "p72C40",
              description:
                "Heading for working language ability section of the search form.",
            })}
            text={intl.formatMessage({
              defaultMessage:
                "Select the working language ability the candidate needs for this position.",
              id: "RGzfes",
              description:
                "Message describing the work language ability filter in the search form.",
            })}
          >
            <RadioGroup
              idPrefix="languageAbility"
              legend={intl.formatMessage({
                defaultMessage: "Language",
                id: "sk9CeW",
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
                    id: "YyHN1i",
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
              id: "VwVtqr",
              description:
                "Heading for employment duration section of the search form.",
            })}
            text={intl.formatMessage({
              defaultMessage:
                "The selected duration will be compared to the one chosen by candidates in their applications. Change this only if the job offer has a determined duration.",
              id: "iN2H6J",
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
                    id: "8fQWTc",
                    description:
                      "No preference for employment duration - will accept any",
                  }),
                },
                {
                  value: "true",
                  label: intl.formatMessage(
                    getEmploymentDuration(EmploymentDuration.Term),
                  ),
                },
                {
                  value: "nothing",
                  label: intl.formatMessage(
                    getEmploymentDuration(EmploymentDuration.Indeterminate),
                  ),
                },
              ]}
            />
          </FilterBlock>
          <FilterBlock
            id="employmentEquityFilter"
            title={intl.formatMessage({
              defaultMessage: "Employment equity",
              id: "ITkmBQ",
              description:
                "Heading for employment equity section of the search form.",
            })}
            text={intl.formatMessage({
              defaultMessage:
                "Managers can request candidates by employment equity group(s) to address current of future representation gaps in the workforce. (Categories reflect EE data defined under the Public Service Employment Act and collected through the PSC application process. For consistency, this platform reflects the PSC's category terminology.)",
              id: "Za/qCZ",
              description:
                "Message describing the employment equity filter in the search form.",
            })}
          >
            <Checklist
              idPrefix="employmentEquity"
              legend={intl.formatMessage({
                defaultMessage: "Employment equity groups",
                id: "m3qn9l",
                description: "Legend for the employment equity checklist",
              })}
              name="employmentEquity"
              context={intl.formatMessage({
                defaultMessage:
                  "<strong>Note:</strong> If you select more than one employment equity group, ALL candidates who have self-declared as being members of ANY of the selected EE groups will be referred. If you have more detailed EE requirements, let us know in the comment section of the submission form.",
                id: "GIPciq",
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
                  label: intl.formatMessage(
                    getEmploymentEquityGroup("minority"),
                  ),
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
  },
);

export default SearchForm;
