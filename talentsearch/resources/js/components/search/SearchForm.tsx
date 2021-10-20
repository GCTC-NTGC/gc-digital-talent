import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { Checklist, MultiSelect, RadioGroup } from "@common/components/form";
import { Checkbox } from "@common/components/form/Checklist";
import { getLocale } from "@common/helpers/localize";
import { enumToOptions, unpackIds } from "@common/helpers/formUtils";
import { getLanguageAbility } from "@common/constants";
import {
  Classification,
  CmoAsset,
  OperationalRequirement,
  WorkRegion,
  LanguageAbility,
  PoolCandidateFilter,
} from "../../api/generated";

const FilterBlock: React.FunctionComponent<{
  title: string | React.ReactNode;
  text: string;
}> = ({ title, text, children }) => {
  return (
    <div>
      <h3
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

type Option<V> = { value: V; label: string };
type FormValues = Pick<
  PoolCandidateFilter,
  "languageAbility" | "workRegions"
> & {
  classifications: string[] | undefined;
  cmoAssets: string[] | undefined;
  operationalRequirements: string[] | undefined;
  employmentEquity: string[] | undefined;
};

interface SearchFormProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  initialPoolCandidateFilter: PoolCandidateFilter;
  operationalRequirements: OperationalRequirement[];
  totalEstimatedCandidates: number;
}

const SearchForm: React.FunctionComponent<SearchFormProps> = ({
  classifications,
  cmoAssets,
  initialPoolCandidateFilter,
  operationalRequirements,
  totalEstimatedCandidates,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const dataToFormValues = (data: PoolCandidateFilter): FormValues => ({
    ...data,
    classifications: unpackIds(data?.classifications),
    cmoAssets: unpackIds(data?.cmoAssets),
    operationalRequirements: unpackIds(data?.operationalRequirements),
    employmentEquity: [
      data.isIndigenous ? "isIndigenous" : "",
      data.isVisibleMinority ? "isVisibleMinority" : "",
      data.hasDisability ? "hasDisability" : "",
      data.isWoman ? "isWoman" : "",
    ],
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(initialPoolCandidateFilter),
  });
  const { handleSubmit } = methods;

  const classificationOptions: Option<string>[] = classifications.map(
    ({ id, group, level }) => ({
      value: id,
      label: `${group}-0${level}`,
    }),
  );

  const cmoAssetOptions: Option<string>[] = cmoAssets.map(({ id, name }) => ({
    value: id,
    label: name[locale] ?? "Error: name not loaded",
  }));

  const operationalRequirementOptions: Option<string>[] =
    operationalRequirements.map(({ id, name }) => ({
      value: id,
      label: name[locale] || "Error: operational requirement name not found.",
    }));

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(() => {
          console.log("Submit");
        })}
      >
        <FilterBlock
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
              description: "Label for classfication filter in search form.",
            })}
            placeholder={intl.formatMessage({
              defaultMessage: "Select one or more classification(s)",
              description:
                "Placeholder for classfication filter in search form.",
            })}
            name="classifications"
            options={classificationOptions}
          />
        </FilterBlock>
        <FilterBlock
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
          title={intl.formatMessage({
            defaultMessage: "Employment equity",
            description:
              "Heading for employment equity section of the search form.",
          })}
          text={intl.formatMessage({
            defaultMessage:
              "Managers can request candidates by employment equity group(s) to address current of future representation gaps in the workforce. (Catergories reflect EE data defined under the Public Service Employment Act and collected through the PSC application process. For consistency, this platform reflects the PSC's category terminlogy.)",
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
        <FilterBlock
          title={intl.formatMessage(
            {
              defaultMessage:
                "Results: <span>{totalEstimatedCandidates}</span> matching candidates",
              description:
                "Heading for total matching candidates in results section of search page.",
            },
            {
              span: (msg: string): JSX.Element => (
                <span data-h2-font-color="b(lightpurple)">{msg}</span>
              ),
              totalEstimatedCandidates,
            },
          )}
          text={intl.formatMessage({
            defaultMessage:
              "To improve your results, try removing some of these filters:",
            description:
              "Heading for total matching candidates in results section of search page.",
          })}
        />
      </form>
    </FormProvider>
  );
};

export default SearchForm;
