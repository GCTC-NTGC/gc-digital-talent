import React, { useMemo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Checklist, MultiSelect, RadioGroup } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { enumToOptions, unpackMaybes } from "@common/helpers/formUtils";
import { getLanguageAbility } from "@common/constants";
import useDeepCompareEffect from "@common/hooks/useDeepCompareEffect";
import { debounce } from "debounce";
import { useLocation } from "@common/helpers/router";
import {
  getOperationalRequirement,
  getWorkRegion,
} from "@common/constants/localizedConstants";
import {
  Classification,
  CmoAsset,
  OperationalRequirement,
  WorkRegion,
  LanguageAbility,
  PoolCandidateFilter,
  PoolCandidateFilterInput,
} from "../../api/generated";

const FilterBlock: React.FunctionComponent<{
  id: string;
  title: string | React.ReactNode;
  text: string;
}> = ({ id, title, text, children }) => {
  return (
    <div>
      <h3
        id={id}
        data-h2-font-size="b(h4)"
        data-h2-font-weight="b(700)"
        data-h2-margin="b(bottom, m)"
      >
        {title}
      </h3>
      <p
        data-h2-font-size="b(caption)"
        data-h2-margin="b(bottom, m)"
        data-h2-padding="b(right, xl)"
      >
        {text}
      </p>
      {children && <div style={{ maxWidth: "30rem" }}>{children}</div>}
    </div>
  );
};

function mapIdToValue<T extends { id: string }>(objs: T[]): Map<string, T> {
  return objs.reduce((map, obj) => {
    map.set(obj.id, obj);
    return map;
  }, new Map());
}

type Option<V> = { value: V; label: string };
export type FormValues = Pick<
  PoolCandidateFilter,
  "languageAbility" | "workRegions" | "operationalRequirements"
> & {
  classifications: string[] | undefined;
  cmoAssets: string[] | undefined;
  employmentEquity: string[] | undefined;
  educationRequirement: "has_diploma" | "no_diploma";
  poolId: string;
};

type LocationState = {
  some: {
    initialValues: FormValues;
  };
};
export interface SearchFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  updateCandidateFilter: (filter: PoolCandidateFilterInput) => void;
  updateInitialValues: (initialValues: FormValues) => void;
}

export const SearchForm: React.FunctionComponent<SearchFormProps> = ({
  classifications,
  cmoAssets,
  updateCandidateFilter,
  updateInitialValues,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const location = useLocation();

  const classificationMap = useMemo(
    () => mapIdToValue(classifications),
    [classifications],
  );
  const assetMap = useMemo(() => mapIdToValue(cmoAssets), [cmoAssets]);

  const formValuesToData = useCallback(
    (values: FormValues): PoolCandidateFilterInput => {
      return {
        classifications: values.classifications
          ? values.classifications?.map((id) => classificationMap.get(id))
          : [],
        cmoAssets: values.cmoAssets
          ? values.cmoAssets?.map((id) => assetMap.get(id))
          : [],
        operationalRequirements: values.operationalRequirements
          ? unpackMaybes(values.operationalRequirements)
          : [],
        hasDiploma: values.educationRequirement === "has_diploma",
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
        ...(values.languageAbility === "ENGLISH" ||
        values.languageAbility === "FRENCH" ||
        values.languageAbility === "BILINGUAL"
          ? { languageAbility: values.languageAbility }
          : {}), // Ensure null in FormValues is converted to undefined
        workRegions: values.workRegions || [],
      };
    },
    [classificationMap, assetMap],
  );

  // The location state holds the initial values plugged in from user. This is required if the user decides to click back and change any values.
  const state = location.state as LocationState;
  const initialValues = state ? state.some.initialValues : {};
  const methods = useForm<FormValues>({ defaultValues: initialValues });
  const { watch } = methods;

  // Whenever form values change (with some debounce allowance), call updateCandidateFilter
  const formValues = watch();
  const submitDebounced = useCallback(
    debounce((values: FormValues) => {
      if (updateCandidateFilter) {
        updateCandidateFilter(formValuesToData(values));
      }
    }, 200),
    [formValuesToData, updateCandidateFilter],
  );

  // Use deep comparison to prevent infinite re-rendering
  useDeepCompareEffect(() => {
    submitDebounced(formValues);
    updateInitialValues(formValues);
    return () => {
      // Clear debounce timer when component unmounts
      submitDebounced.clear();
    };
  }, [formValues]);

  const classificationOptions: Option<string>[] = useMemo(
    () =>
      classifications.map(({ id, group, level }) => ({
        value: id,
        label: `${group}-0${level}`,
      })),
    [classifications],
  );

  const cmoAssetOptions: Option<string>[] = useMemo(
    () =>
      cmoAssets.map(({ id, name }) => ({
        value: id,
        label:
          name[locale] ??
          intl.formatMessage({
            defaultMessage: "Error: name not loaded",
            description: "Error message for cmo asset filer on search form.",
          }),
      })),
    [cmoAssets, locale, intl],
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
            legend="Education Requirement filter"
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
            legend="Conditions of employment"
            name="operationalRequirements"
            items={enumToOptions(OperationalRequirement).map(({ value }) => ({
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
            legend="Language"
            name="languageAbility"
            items={[
              {
                value: "null",
                label: intl.formatMessage({
                  defaultMessage: "Any language",
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
            legend="Conditions of employment"
            name="employmentEquity"
            context={intl.formatMessage({
              defaultMessage:
                "Note: If you select more than one employment equity group, ALL candidates who have self-declared as being members of ANY of the selected EE groups will be referred. If you have more detailed EE requirements, let us know in the comment section of the submission form.",
              description:
                "Context for employment equity filter in search form.",
            })}
            items={[
              {
                value: "isIndigenous",
                label: intl.formatMessage({
                  defaultMessage: "Indigenous",
                  description:
                    "Checklist option for employment equity filter in search form.",
                }),
              },
              {
                value: "isVisibleMinority",
                label: intl.formatMessage({
                  defaultMessage: "Member of a visible minority group",
                  description:
                    "Checklist option for employment equity filter in search form.",
                }),
              },
              {
                value: "hasDisability",
                label: intl.formatMessage({
                  defaultMessage: "Person with a disability",
                  description:
                    "Checklist option for employment equity filter in search form.",
                }),
              },
              {
                value: "isWoman",
                label: intl.formatMessage({
                  defaultMessage: "Woman",
                  description:
                    "Checklist option for employment equity filter in search form.",
                }),
              },
            ]}
          />
        </FilterBlock>
        <FilterBlock
          id="cmoAssetFilter"
          title={intl.formatMessage({
            defaultMessage: "Skill filters",
            description:
              "Heading for skill filters section of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "All applicants in this pool have been assessed for several soft skills.",
            description:
              "Message describing the skill filter in the search form.",
          })}
        >
          <Checklist
            idPrefix="cmoAssets"
            legend="Skills organized by stream"
            name="cmoAssets"
            items={cmoAssetOptions}
          />
        </FilterBlock>
      </form>
    </FormProvider>
  );
};
