import React, { useImperativeHandle, useMemo } from "react";
import { FormProvider, useForm, UseFormTrigger } from "react-hook-form";
import { defineMessages, MessageDescriptor, useIntl } from "react-intl";
import {
  Checklist,
  MultiSelect,
  RadioGroup,
  Select,
} from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { enumToOptions, unpackMaybes } from "@common/helpers/formUtils";
import { getLanguageAbility } from "@common/constants";
import { debounce } from "debounce";
import { useLocation } from "react-router-dom";
import {
  getWorkRegion,
  OperationalRequirementV1,
  getOperationalRequirement,
  getEmploymentEquityGroup,
} from "@common/constants/localizedConstants";
import errorMessages from "@common/messages/errorMessages";
import { hasKey } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import {
  Classification,
  CmoAsset,
  WorkRegion,
  LanguageAbility,
  PoolCandidateFilter,
  PoolCandidateFilterInput,
} from "../../../api/generated";

const NullSelection = "NULL_SELECTION";

const FilterBlock: React.FunctionComponent<{
  id: string;
  title: string | React.ReactNode;
  text: string;
}> = ({ id, title, text, children }) => {
  return (
    <div>
      <h3
        id={id}
        data-h2-font-size="base(h6, 1)"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(x3, 0, x1, 0)"
      >
        {title}
      </h3>
      <p data-h2-margin="base(0, 0, x1, 0)">{text}</p>
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
  "workRegions" | "operationalRequirements"
> & {
  languageAbility: LanguageAbility | typeof NullSelection;
  classification: string | undefined;
  cmoAssets: string[] | undefined;
  employmentEquity: string[] | undefined;
  educationRequirement: "has_diploma" | "no_diploma";
  poolId: string;
};

export interface SearchFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  updateCandidateFilter: (filter: PoolCandidateFilterInput) => void;
  updateInitialValues: (initialValues: FormValues) => void;
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

export const SearchForm = React.forwardRef<SearchFormRef, SearchFormProps>(
  ({ classifications, cmoAssets, updateCandidateFilter }, ref) => {
    const intl = useIntl();
    const locale = getLocale(intl);
    const location = useLocation();

    const classificationMap = useMemo(
      () => mapIdToValue(classifications),
      [classifications],
    );
    const assetMap = useMemo(() => mapIdToValue(cmoAssets), [cmoAssets]);

    // The location state holds the initial values plugged in from user. This is required if the user decides to click back and change any values.
    const initialValuesFromState = location?.state?.initialValues;
    const initialValues = React.useMemo(
      () => initialValuesFromState || {},
      [initialValuesFromState],
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
      updateCandidateFilter(initialValues);
    }, [initialValues, updateCandidateFilter]);

    React.useEffect(() => {
      const formValuesToData = (
        values: FormValues,
      ): PoolCandidateFilterInput => {
        const maybeClassification = values.classification
          ? classificationMap.get(values.classification)
          : undefined;
        return {
          expectedClassifications: maybeClassification
            ? [maybeClassification]
            : [],
          cmoAssets: values.cmoAssets
            ? values.cmoAssets?.map((id) => (id ? assetMap.get(id) : undefined))
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
          locationPreferences: values.workRegions || [],
        };
      };

      const debounceUpdate = debounce((values: PoolCandidateFilterInput) => {
        if (updateCandidateFilter) {
          updateCandidateFilter(values);
        }
      }, 200);

      const subscription = watch((newValues) => {
        const values = formValuesToData(newValues as FormValues);
        debounceUpdate(values);
      });

      return () => subscription.unsubscribe();
    }, [watch, classificationMap, assetMap, updateCandidateFilter]);

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

    const cmoAssetOptions: Option<string>[] = useMemo(
      () =>
        cmoAssets.map(({ id, name }) => ({
          value: id,
          label:
            name[locale] ?? intl.formatMessage(commonMessages.nameNotLoaded),
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
              options={[
                {
                  value: "",
                  disabled: true,
                  label: intl.formatMessage({
                    defaultMessage: "Select a classification",
                    id: "HHEQgM",
                    description:
                      "Placeholder for classification filter in search form.",
                  }),
                },
                ...classificationOptions,
              ]}
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
              items={OperationalRequirementV1.map((value) => ({
                value,
                label: intl.formatMessage(
                  getOperationalRequirement(value, "short"),
                ),
              }))}
            />
          </FilterBlock>
          <FilterBlock
            id="workLocationFilter"
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
              id="workRegions"
              name="workRegions"
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
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
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
          <FilterBlock
            id="cmoAssetFilter"
            title={intl.formatMessage({
              defaultMessage: "Skill filters",
              id: "kAieVP",
              description:
                "Heading for skill filters section of the search form.",
            })}
            text={intl.formatMessage({
              defaultMessage:
                "All applicants in this pool have been assessed for several soft skills.",
              id: "1EyeE7",
              description:
                "Message describing the skill filter in the search form.",
            })}
          >
            <Checklist
              idPrefix="cmoAssets"
              legend={intl.formatMessage({
                defaultMessage: "Skills organized by stream",
                id: "3nKkyo",
                description: "Legend for Skills filter checklist",
              })}
              name="cmoAssets"
              items={cmoAssetOptions}
            />
          </FilterBlock>
        </form>
      </FormProvider>
    );
  },
);
