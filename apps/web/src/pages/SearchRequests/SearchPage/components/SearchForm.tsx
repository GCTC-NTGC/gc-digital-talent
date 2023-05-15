import React, { useImperativeHandle } from "react";
import { FormProvider, useForm, UseFormTrigger } from "react-hook-form";
import { defineMessages, MessageDescriptor, useIntl } from "react-intl";
import debounce from "lodash/debounce";
import { useLocation } from "react-router-dom";

import {
  Checklist,
  RadioGroup,
  Select,
  MultiSelectField,
  enumToOptions,
  unpackMaybes,
} from "@gc-digital-talent/forms";
import {
  getLanguageAbility,
  getEmploymentEquityGroup,
  getWorkRegion,
  EmploymentDuration,
  getPoolStream,
  errorMessages,
} from "@gc-digital-talent/i18n";
import { hasKey, notEmpty } from "@gc-digital-talent/helpers";

import {
  LanguageAbility,
  ApplicantFilterInput,
  WorkRegion,
  PoolStream,
  Skill,
  PositionDuration,
  Maybe,
} from "~/api/generated";
import { SimpleClassification, SimplePool } from "~/types/pool";
import { poolMatchesClassification } from "~/utils/poolUtils";
import {
  FormValues,
  LocationState,
  NullSelection,
  Option,
} from "~/types/searchRequest";

import AdvancedFilters from "./AdvancedFilters";
import AddSkillsToFilter from "./AddSkillsToFilter";
import FilterBlock from "./FilterBlock";

const positionDurationToEmploymentDuration = (
  durations: Maybe<PositionDuration>[],
): string => {
  if (durations && durations.includes(PositionDuration.Temporary)) {
    return EmploymentDuration.Term;
  }
  return EmploymentDuration.Indeterminate;
};

const dataToFormValues = (
  data: ApplicantFilterInput,
  selectedClassifications?: Maybe<SimpleClassification[]>,
  pools?: SimplePool[],
): FormValues => {
  const dataPoolsSafe = data.pools ? data.pools : [];
  const poolsSafe = pools ? pools.filter(notEmpty) : [];

  const poolMap = new Map(poolsSafe.map((pool) => [pool.id, pool]));
  return {
    classification: selectedClassifications
      ? `${selectedClassifications[0].group}-0${selectedClassifications[0].level}`
      : "",
    languageAbility: data?.languageAbility
      ? data?.languageAbility
      : "NULL_SELECTION",
    employmentEquity: data.equity
      ? [
          ...(data.equity.hasDisability ? ["hasDisability"] : []),
          ...(data.equity.isIndigenous ? ["isIndigenous"] : []),
          ...(data.equity.isVisibleMinority ? ["isVisibleMinority"] : []),
          ...(data.equity.isWoman ? ["isWoman"] : []),
        ]
      : [],
    educationRequirement: data.hasDiploma ? "has_diploma" : "no_diploma",
    skills: data.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    stream: dataPoolsSafe[0]
      ? poolMap.get(dataPoolsSafe[0].id)?.stream || ""
      : "",
    locationPreferences: data.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirements:
      data.operationalRequirements?.filter(notEmpty) ?? [],
    employmentDuration: data.positionDuration
      ? positionDurationToEmploymentDuration(data.positionDuration)
      : "",
  };
};

function mapObjectsByKey<T>(
  keyFunction: (t: T) => string,
  objects: T[],
): Map<string, T> {
  return objects.reduce((map, obj) => {
    map.set(keyFunction(obj), obj);
    return map;
  }, new Map());
}

const classificationToKey = (classification: SimpleClassification) =>
  `${classification.group}-0${classification.level}`;

export interface SearchFormProps {
  classifications: SimpleClassification[];
  skills?: Skill[];
  pools?: SimplePool[];
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

const classificationAriaLabels: Record<string, MessageDescriptor> =
  defineMessages({
    "IT-01": {
      defaultMessage: "Technician I T 1 ($60,000 to $78,000)",
      id: "1c+inU",
      description:
        "IT-01 classification aria label including titles and salaries",
    },
    "IT-02": {
      defaultMessage: "Analyst I T 2 ($75,000 to $91,000)",
      id: "BkHx2X",
      description:
        "IT-02 classification aria label including titles and salaries",
    },
    "IT-03": {
      defaultMessage:
        "Technical Advisor or Team Leader I T 3 ($88,000 to $110,000)",
      id: "++WV3O",
      description:
        "IT-03 classification aria label including titles and salaries",
    },
    "IT-04": {
      defaultMessage: "Senior Advisor or Manager I T 4 ($101,000 to $126,000)",
      id: "Ix0KgU",
      description:
        "IT-04 classification aria label including titles and salaries",
    },
  });

const durationSelectionToEnum = (
  selection: string | null,
): PositionDuration[] | null => {
  if (selection && selection === EmploymentDuration.Term) {
    return [PositionDuration.Temporary];
  }
  if (selection && selection === EmploymentDuration.Indeterminate) {
    return [PositionDuration.Permanent];
  }
  return null;
};

const SearchForm = React.forwardRef<SearchFormRef, SearchFormProps>(
  ({ classifications, skills, pools, onUpdateApplicantFilter }, ref) => {
    const intl = useIntl();
    const location = useLocation();

    const classificationMap = React.useMemo(() => {
      return mapObjectsByKey(classificationToKey, classifications);
    }, [classifications]);

    // The location state holds the initial values plugged in from user. This is required if the user decides to click back and change any values.
    const state = location.state as LocationState;
    const initialValues = React.useMemo(
      () => (state ? state.applicantFilter : {}),
      [state],
    );

    const methods = useForm<FormValues>({
      defaultValues: dataToFormValues(
        initialValues ?? {},
        state?.selectedClassifications,
        pools,
      ),
      mode: "onChange",
      reValidateMode: "onChange",
    });
    const { watch, trigger } = methods;

    useImperativeHandle(
      ref,
      () => ({
        triggerValidation: trigger,
      }),
      [trigger],
    );

    React.useEffect(() => {
      const formValuesToData = (values: FormValues): ApplicantFilterInput => {
        const selectedClassification = values.classification
          ? classificationMap.get(values.classification)
          : undefined;
        return {
          qualifiedClassifications: [selectedClassification],
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
          positionDuration: values.employmentDuration
            ? durationSelectionToEnum(values.employmentDuration)
            : null,
          locationPreferences: values.locationPreferences || [],
          qualifiedStreams: values.stream ? [values.stream] : undefined,
          pools: pools
            ? pools
                .filter(notEmpty)
                .filter(
                  (pool) =>
                    selectedClassification === undefined || // If a classification hasn't been selected yet, do not filter out any pools.
                    poolMatchesClassification(pool, selectedClassification),
                )
                .filter(
                  (pool) =>
                    values.stream === "" || // If a stream hasn't been selected yet, do not filter out any pools.
                    pool.stream === values.stream,
                )
            : [],
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
    }, [watch, classificationMap, onUpdateApplicantFilter, pools, state]);

    const getClassificationLabel = React.useCallback(
      (
        group: string,
        level: number,
        labels: Record<string, MessageDescriptor>,
      ): string => {
        const key = `${group}-0${level}`;
        return !hasKey(classificationLabels, key)
          ? key
          : intl.formatMessage(labels[key]);
      },
      [intl],
    );

    const classificationOptions: Option<string>[] = React.useMemo(
      () =>
        classifications.map(({ group, level }) => ({
          value: classificationToKey({ group, level }),
          label: getClassificationLabel(group, level, classificationLabels),
          ariaLabel: getClassificationLabel(
            group,
            level,
            classificationAriaLabels,
          ),
        })),
      [classifications, getClassificationLabel],
    );
    const streamOptions: Option<PoolStream>[] = enumToOptions(PoolStream).map(
      ({ value }) => ({
        value: value as PoolStream,
        label: intl.formatMessage(getPoolStream(value)),
      }),
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
                defaultMessage: "Select a classification",
                id: "HHEQgM",
                description:
                  "Placeholder for classification filter in search form.",
              })}
              name="classification"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a classification",
                id: "HHEQgM",
                description:
                  "Placeholder for classification filter in search form.",
              })}
              options={classificationOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              trackUnsaved={false}
            />
            <Select
              id="stream"
              label={intl.formatMessage({
                defaultMessage: "Stream",
                id: "qYWmzA",
                description: "Label for stream filter in search form.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select a job stream",
                id: "QJ5uDV",
                description: "Placeholder for stream filter in search form.",
              })}
              name="stream"
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a job stream",
                id: "QJ5uDV",
                description: "Placeholder for stream filter in search form.",
              })}
              options={streamOptions}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              trackUnsaved={false}
            />
          </FilterBlock>
          <AddSkillsToFilter allSkills={skills ?? []} linkId="skillFilter" />
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
              trackUnsaved={false}
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
                "Managers can request candidates by employment equity group to address current and future representation gaps in the workforce. Categories reflect employment equity data defined under the Public Service Employment Act and collected through the Public Service Commission of Canada's (PSC) application process. For consistency, this platform reflects the PSC's category terminology.",
              id: "dlRmxI",
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
                  "<strong>Note:</strong> Results will include any candidate that matches <strong>1 or more</strong> of the selected EE groups",
                id: "UXsUvN",
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
              trackUnsaved={false}
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
            <MultiSelectField
              id="locationPreferences"
              name="locationPreferences"
              context={intl.formatMessage({
                defaultMessage:
                  "<strong>Note:</strong> Results will include any candidate that matches <strong>1 or more</strong> of the selected regions",
                id: "7mb9oA",
                description:
                  "Context for the work region/location preferences filter in the search form.",
              })}
              label={intl.formatMessage({
                defaultMessage: "Region",
                id: "F+WFWB",
                description: "Label for work location filter in search form.",
              })}
              placeholder={intl.formatMessage({
                defaultMessage: "Select a location",
                id: "bo+d/M",
                description:
                  "Placeholder for work location filter in search form.",
              })}
              options={enumToOptions(WorkRegion).map(({ value }) => ({
                value,
                label: intl.formatMessage(getWorkRegion(value)),
              }))}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          </FilterBlock>

          <AdvancedFilters />
        </form>
      </FormProvider>
    );
  },
);

export default SearchForm;
