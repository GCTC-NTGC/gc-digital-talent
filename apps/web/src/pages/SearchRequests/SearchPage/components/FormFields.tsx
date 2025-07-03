import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Checklist,
  Field,
  RadioGroup,
  Select,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  getEmploymentEquityGroup,
  getLocalizedName,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";
import {
  Classification,
  Skill,
  WorkStream,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { NullSelection } from "~/types/searchRequest";
import { formatClassificationString } from "~/utils/poolUtils";
import SkillBrowser from "~/components/SkillBrowser/SkillBrowser";
import processMessages from "~/messages/processMessages";

import FilterBlock from "./FilterBlock";
import AdvancedFilters from "./AdvancedFilters";
import { getClassificationLabel } from "../utils";
import { classificationAriaLabels, classificationLabels } from "../labels";

const SearchRequestOptions_Query = graphql(/* GraphQL */ `
  query SearchRequestOptions {
    languageAbilities: localizedEnumStrings(enumName: "LanguageAbility") {
      value
      label {
        en
        fr
      }
    }
    workRegions: localizedEnumStrings(enumName: "WorkRegion") {
      value
      label {
        en
        fr
      }
    }
  }
`);

interface FormFieldsProps {
  classifications: Pick<Classification, "group" | "level">[];
  skills: Skill[];
  workStreams: WorkStream[];
}

const FormFields = ({
  classifications,
  skills,
  workStreams,
}: FormFieldsProps) => {
  const intl = useIntl();
  const [{ data }] = useQuery({
    query: SearchRequestOptions_Query,
  });

  const classificationOptions = classifications.map((classification) => ({
    value: formatClassificationString(classification),
    label: getClassificationLabel(classification, classificationLabels, intl),
    ariaLabel: getClassificationLabel(
      classification,
      classificationAriaLabels,
      intl,
    ),
  }));

  const workStreamOptions = workStreams.map((workStream) => ({
    value: workStream.id,
    label: getLocalizedName(workStream.name, intl),
  }));

  const languageAbilityOptions = localizedEnumToOptions(
    data?.languageAbilities,
    intl,
  );
  const sortedWorkRegions = sortWorkRegion(unpackMaybes(data?.workRegions));
  const workRegionOptions = localizedEnumToOptions(sortedWorkRegions, intl);

  return (
    <>
      <FilterBlock
        id="classificationsFilter"
        title={intl.formatMessage({
          defaultMessage: "Classification filter",
          id: "TxVbLI",
          description: "Heading for classification filter of the search form.",
        })}
        text={intl.formatMessage({
          defaultMessage:
            "We use this filter to match candidates who express interest in a classification level, or certain expected salaries in these classifications.",
          id: "dxv7Jx",
          description:
            "Message describing the classification filter of the search form.",
        })}
      >
        <div className="flex flex-col gap-y-6">
          <Select
            id="classifications"
            label={intl.formatMessage({
              defaultMessage: "Classification filter",
              id: "V8v+/g",
              description: "Label for classification filter in search form.",
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
            label={intl.formatMessage(processMessages.stream)}
            name="stream"
            nullSelection={intl.formatMessage({
              defaultMessage: "Select a stream",
              id: "qobo/x",
              description: "Placeholder for stream filter in search form.",
            })}
            options={workStreamOptions}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            trackUnsaved={false}
          />
        </div>
      </FilterBlock>
      <FilterBlock
        id="skills"
        title={intl.formatMessage({
          defaultMessage: "Skills selection",
          id: "eFvsOG",
          description: "Title for the skill filters on search page.",
        })}
        text={intl.formatMessage({
          defaultMessage:
            "Help us match you to the best candidates by sharing more information with our team on the exact skills you are looking for.",
          id: "R75HsV",
          description:
            "Describing the purpose of the skill filters on the Search page.",
        })}
      >
        <SkillBrowser skills={skills || []} name="skills" />
        <Field.Context className="mt-1.5">
          {intl.formatMessage({
            defaultMessage:
              "<strong>Note:</strong> Results will include any candidate that matches <strong>1 or more</strong> of the selected skills",
            id: "kLGIuJ",
            description: "Context for skills selection filter in search form.",
          })}
        </Field.Context>
      </FilterBlock>
      <FilterBlock
        id="workingLanguageFilter"
        title={intl.formatMessage(commonMessages.workingLanguageAbility)}
        text={intl.formatMessage({
          defaultMessage:
            "Select the working language ability the candidate needs for this position. The selected working language ability will be compared to the one chosen by candidates in their applications. To note, candidates who selected Bilingual may not have Government of Canada second language evaluation results.",
          id: "+PLUZ8",
          description:
            "Message describing the work language ability filter in the search form.",
        })}
      >
        <RadioGroup
          idPrefix="languageAbility"
          legend={intl.formatMessage(commonMessages.language)}
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
            ...languageAbilityOptions,
          ]}
          trackUnsaved={false}
        />
      </FilterBlock>
      <FilterBlock
        id="employmentEquityFilter"
        title={intl.formatMessage(commonMessages.employmentEquity)}
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
            description: "Context for employment equity filter in search form.",
          })}
          items={[
            {
              value: "isWoman",
              label: intl.formatMessage(getEmploymentEquityGroup("woman")),
            },
            {
              value: "isIndigenous",
              label: intl.formatMessage(getEmploymentEquityGroup("indigenous")),
            },
            {
              value: "isVisibleMinority",
              label: intl.formatMessage(getEmploymentEquityGroup("minority")),
            },
            {
              value: "hasDisability",
              label: intl.formatMessage(getEmploymentEquityGroup("disability")),
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
          description: "Heading for work location section of the search form.",
        })}
        text={intl.formatMessage({
          defaultMessage:
            "If you have more detailed work location requirements, let us know in the comment section of the submission form. You can select more than one region.",
          id: "20vfz6",
          description:
            "Message describing the work location filter in the search form.",
        })}
      >
        <Checklist
          idPrefix="locationPreferences"
          id="locationPreferences"
          name="locationPreferences"
          context={intl.formatMessage({
            defaultMessage:
              "<strong>Note:</strong> Results will include any candidate that matches <strong>1 or more</strong> of the selected regions",
            id: "7mb9oA",
            description:
              "Context for the work region/location preferences filter in the search form.",
          })}
          legend={intl.formatMessage({
            defaultMessage: "Region",
            id: "F+WFWB",
            description: "Label for work location filter in search form.",
          })}
          items={workRegionOptions}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </FilterBlock>

      <AdvancedFilters />
    </>
  );
};

export default FormFields;
