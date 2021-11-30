import React, { useMemo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Checklist, MultiSelect, RadioGroup } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { enumToOptions } from "@common/helpers/formUtils";
import { getLanguageAbility } from "@common/constants";
import { Id } from "@common/types/utilityTypes";
import useDeepCompareEffect from "@common/hooks/useDeepCompareEffect";
import { debounce } from "debounce";
import {
  Classification,
  CmoAsset,
  OperationalRequirement,
  WorkRegion,
  LanguageAbility,
  PoolCandidateFilter,
  PoolCandidateFilterInput,
} from "../../api/generated";
import EstimatedCandidates from "./EstimatedCandidates";

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
      <p data-h2-font-size="b(caption)" data-h2-margin="b(bottom, m)">
        {text}
      </p>
      {children && <div style={{ maxWidth: "30rem" }}>{children}</div>}
    </div>
  );
};

const PoolBlock: React.FunctionComponent<{
  pool: Pool;
  totalEstimatedCandidates: number;
  setPoolIdValue: (poolId: string) => void;
  handleSubmit: () => void;
}> = ({ pool, totalEstimatedCandidates, setPoolIdValue, handleSubmit }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  function span(msg: string) {
    return (
      <span data-h2-font-weight="b(700)" data-h2-font-color="b(lightpurple)">
        {msg}
      </span>
    );
  }

  return (
    <div
      data-h2-shadow="b(m)"
      data-h2-border="b(lightnavy, left, solid, l)"
      data-h2-margin="b(top, s) b(bottom, m)"
      data-h2-flex-grid="b(middle, contained, flush, xl)"
    >
      <div
        data-h2-flex-item="b(1of1) m(1of2)"
        style={{ padding: "0", paddingLeft: "1rem" }}
      >
        <p data-h2-margin="b(bottom, none)" data-h2-font-weight="b(700)">
          {pool.name?.[locale]
            ? pool.name?.[locale]
            : intl.formatMessage({
                defaultMessage: "N/A",
                description: "Text shown when the filter was not selected",
              })}
        </p>
        <p
          data-h2-margin="b(top, xxs) b(bottom, m)"
          data-h2-font-weight="b(100)"
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "There are <span>{totalEstimatedCandidates}</span> matching candidates in this pool",
              description:
                "Message for total estimated candidates box next to search form.",
            },
            {
              span,
              totalEstimatedCandidates,
            },
          )}
        </p>
        <p data-h2-margin="b(bottom, none)" data-h2-font-size="b(caption)">
          {intl.formatMessage({ defaultMessage: "Pool Owner" })}:{" "}
          {pool.owner?.firstName
            ? pool.owner?.firstName
            : intl.formatMessage({
                defaultMessage: "N/A",
                description: "Text shown when the filter was not selected",
              })}{" "}
          {pool.owner?.lastName
            ? pool.owner?.lastName
            : intl.formatMessage({
                defaultMessage: "N/A",
                description: "Text shown when the filter was not selected",
              })}
        </p>
        <p data-h2-margin="b(bottom, s)" data-h2-font-size="b(caption)">
          {pool.description?.[locale]
            ? pool.description?.[locale]
            : intl.formatMessage({
                defaultMessage: "N/A",
                description: "Text shown when the filter was not selected",
              })}
        </p>
      </div>
      <div
        data-h2-flex-item="b(1of1) m(1of2)"
        data-h2-display="b(flex)"
        data-h2-justify-content="b(center) m(flex-end)"
      >
        <Button
          color="cta"
          mode="solid"
          onClick={() => {
            // Set the poolId state
            setPoolIdValue(pool.id);
            // Fire submit handler with form data and save to history state api.
            handleSubmit();
          }}
        >
          {intl.formatMessage({
            defaultMessage: "Request Candidates",
            description:
              "Button link message on search page that takes user to the request form.",
          })}
        </Button>
      </div>
    </div>
  );
};

type Option<V> = { value: V; label: string };
type FormValues = Pick<
  PoolCandidateFilter,
  "languageAbility" | "workRegions"
> & {
  classifications: Id[] | undefined;
  cmoAssets: Id[] | undefined;
  operationalRequirements: Id[] | undefined;
  employmentEquity: string[] | undefined;
  educationRequirement: "has_diploma" | "no_diploma";
};

export interface SearchFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  operationalRequirements: OperationalRequirement[];
  updateCandidateFilter: (filter: PoolCandidateFilterInput) => void;
}

function mapIdToValue<T extends { id: Id }>(objs: T[]): Map<Id, T> {
  return objs.reduce((map, obj) => {
    map.set(obj.id, obj);
    return map;
  }, new Map());
}

export const SearchForm: React.FunctionComponent<SearchFormProps> = ({
  classifications,
  cmoAssets,
  operationalRequirements,
  updateCandidateFilter,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const location = useLocation();

  const classificationMap = useMemo(
    () => mapIdToValue(classifications),
    [classifications],
  );
  const assetMap = useMemo(() => mapIdToValue(cmoAssets), [cmoAssets]);
  const requirementMap = useMemo(
    () => mapIdToValue(operationalRequirements),
    [operationalRequirements],
  );

  const formValuesToData = useCallback(
    (values: FormValues): PoolCandidateFilterInput => ({
      classifications: values.classifications?.map((id) =>
        classificationMap.get(id),
      ),
      cmoAssets: values.cmoAssets?.map((id) => assetMap.get(id)),
      operationalRequirements: values.operationalRequirements?.map((id) =>
        requirementMap.get(id),
      ),
      hasDiploma: values.educationRequirement === "has_diploma",
      hasDisability: values.employmentEquity?.includes("hasDisability"),
      isIndigenous: values.employmentEquity?.includes("isIndigenous"),
      isVisibleMinority: values.employmentEquity?.includes("isVisibleMinority"),
      isWoman: values.employmentEquity?.includes("isWoman"),
      ...(values.languageAbility === "ENGLISH" ||
      values.languageAbility === "FRENCH" ||
      values.languageAbility === "BILINGUAL"
        ? { languageAbility: values.languageAbility }
        : {}), // Ensure null in FormValues is converted to undefined
      workRegions: values.workRegions,
    }),
    [classificationMap, assetMap, requirementMap],
  );

  const methods = useForm<FormValues>();
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
        label: name[locale] ?? "Error: name not loaded",
      })),
    [cmoAssets, locale],
  );

  const operationalRequirementOptions: Option<string>[] = useMemo(
    () =>
      operationalRequirements.map(({ id, name }) => ({
        value: id,
        label: name[locale] || "Error: operational requirement name not found.",
      })),
    [operationalRequirements, locale],
  );

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    // Build the poolCandidateFilter that will be stored into the history.state api.
    const poolCandidateFilter: PoolCandidateFilter = {
      id: "",
      classifications:
        data.classifications && data.classifications.length > 0
          ? data.classifications?.map((classification) => {
              const newClassification = classifications.find(
                ({ id }) => id === classification,
              );
              return newClassification;
            })
          : [],
      cmoAssets:
        data.cmoAssets && data.cmoAssets.length > 0
          ? data.cmoAssets.map((cmoAsset) => {
              const newCmoAsset = cmoAssets.find(({ id }) => id === cmoAsset);
              return newCmoAsset;
            })
          : [],
      operationalRequirements:
        data.operationalRequirements && data.operationalRequirements.length > 0
          ? data.operationalRequirements.map((operationalRequirement) => {
              const newOperationalRequirement = operationalRequirements.find(
                ({ id }) => id === operationalRequirement,
              );
              return newOperationalRequirement;
            })
          : [],
      pools: pools.filter(({ id }) => id === data.poolId),
      hasDiploma: !!Number(data.hasDiploma),
      hasDisability: data.employmentEquity
        ? data.employmentEquity?.includes("hasDisability")
        : false,
      isIndigenous: data.employmentEquity
        ? data.employmentEquity?.includes("isIndigenous")
        : false,
      isVisibleMinority: data.employmentEquity
        ? data.employmentEquity?.includes("isVisibleMinority")
        : false,
      isWoman: data.employmentEquity
        ? data.employmentEquity?.includes("isWoman")
        : false,
      languageAbility:
        data.languageAbility === "null" ? null : data.languageAbility,
      workRegions: data.workRegions,
    };
    return pushToStateThenNavigate(requestPath(), {
      poolCandidateFilter,
      initialValues: data,
    });
  };

  const useHandleSubmit = () => handleSubmit(onSubmit)();

  function span(msg: string): JSX.Element {
    return <span data-h2-font-color="b(lightpurple)">{msg}</span>;
  }

  function a(msg: string): JSX.Element {
    return (
      <a href="/search" data-h2-font-weight="b(700)">
        {msg}
      </a>
    );
  }

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
            items={operationalRequirementOptions}
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
            options={enumToOptions(WorkRegion)}
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
              "Bilingual applicants have been assessed and meet a minimum level (BBB) of Bilingual proficiency.",
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
                  defaultMessage: "Aboriginal",
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
              "All applicants in this pool have been assessed on four essential soft skills, in addition. These are some of the skills applicants have claimed to have. These skills have not been pre-assessed. If you have more detailed skill requirements, let us know in the comment section of the submission form.",
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

export const SearchFormApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [lookupResult] = useGetSearchFormDataQuery();
  const { data: lookupData, fetching, error } = lookupResult;
  const classifications: Classification[] | [] =
    lookupData?.classifications.filter(notEmpty) ?? [];
  const cmoAssets: CmoAsset[] = lookupData?.cmoAssets.filter(notEmpty) ?? [];
  const operationalRequirements: OperationalRequirement[] =
    lookupData?.operationalRequirements.filter(notEmpty) ?? [];
  const pools: Pool[] = lookupData?.pools.filter(notEmpty) ?? [];

  if (fetching)
    return (
      <div
        data-h2-display="b(flex)"
        data-h2-justify-content="b(center)"
        data-h2-align-items="b(center)"
        style={{ minHeight: "20rem" }}
      >
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </div>
    );
  if (error)
    return (
      <div
        data-h2-display="b(flex)"
        data-h2-justify-content="b(center)"
        data-h2-align-items="b(center)"
        style={{ minHeight: "20rem" }}
      >
        <p>
          {intl.formatMessage(commonMessages.loadingError)} {error.message}
        </p>
      </div>
    );

  return (
    <SearchForm
      classifications={classifications}
      cmoAssets={cmoAssets}
      operationalRequirements={operationalRequirements}
      pools={pools}
      totalEstimatedCandidates={0} // TODO: Replace with number of candidates queried from api.
    />
  );
};
