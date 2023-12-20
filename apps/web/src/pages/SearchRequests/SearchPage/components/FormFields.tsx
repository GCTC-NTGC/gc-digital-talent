import React from "react";
import { useIntl } from "react-intl";

import {
  Checklist,
  Field,
  RadioGroup,
  Select,
  enumToOptions,
  enumToOptionsWorkRegionSorted,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  getEmploymentEquityGroup,
  getLanguageAbility,
  getPoolStream,
  getWorkRegion,
} from "@gc-digital-talent/i18n";

import {
  Classification,
  LanguageAbility,
  PoolStream,
  Skill,
  WorkRegion,
} from "~/api/generated";
import { NullSelection } from "~/types/searchRequest";
import { formatClassificationString } from "~/utils/poolUtils";
import SkillBrowser from "~/components/SkillBrowser/SkillBrowser";

import FilterBlock from "./FilterBlock";
import AdvancedFilters from "./AdvancedFilters";
import { getClassificationLabel } from "../utils";
import { classificationAriaLabels, classificationLabels } from "../labels";

interface FormFieldsProps {
  classifications: Classification[];
  skills: Skill[];
}

const FormFields = ({ classifications, skills }: FormFieldsProps) => {
  const intl = useIntl();

  const classificationOptions = classifications.map((classification) => ({
    value: formatClassificationString(classification),
    label: getClassificationLabel(classification, classificationLabels, intl),
    ariaLabel: getClassificationLabel(
      classification,
      classificationAriaLabels,
      intl,
    ),
  }));

  const streamOptions = enumToOptions(PoolStream)
    .map(({ value }) => ({
      value: value as PoolStream,
      label: intl.formatMessage(getPoolStream(value)),
    }))
    // Avoid showing the ATIP stream as an option, since we don't have pools with candidates yet.
    // TODO: remove this when ATIP pools are ready. See ticket https://github.com/GCTC-NTGC/gc-digital-talent/issues/7601
    .filter(({ value }) => value !== PoolStream.AccessInformationPrivacy);

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
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
        >
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
            label={intl.formatMessage({
              defaultMessage: "Stream",
              id: "qYWmzA",
              description: "Label for stream filter in search form.",
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
        <Field.Context data-h2-margin-top="base(x.25)">
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
        title={intl.formatMessage({
          defaultMessage: "Working language ability",
          id: "p72C40",
          description:
            "Heading for working language ability section of the search form.",
        })}
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
            "If you have more detailed work location requirement, let us know in the comment section of the submission form. You can select more than one region.",
          id: "sM+4cP",
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
          items={enumToOptionsWorkRegionSorted(WorkRegion).map(({ value }) => ({
            value,
            label: intl.formatMessage(getWorkRegion(value)),
          }))}
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
