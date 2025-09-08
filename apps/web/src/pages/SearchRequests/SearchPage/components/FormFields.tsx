import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  CheckboxOption,
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
  sortFlexibleWorkLocations,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";
import {
  Classification,
  FlexibleWorkLocation,
  Skill,
  WorkRegion,
  WorkStream,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { NullSelection } from "~/types/searchRequest";
import { formatClassificationString } from "~/utils/poolUtils";
import SkillBrowser from "~/components/SkillBrowser/SkillBrowser";
import processMessages from "~/messages/processMessages";
import messages from "~/messages/profileMessages";
import talentRequestMessages from "~/messages/talentRequestMessages";

import FilterBlock from "./FilterBlock";
import AdvancedFilters from "./AdvancedFilters";
import { getClassificationAriaLabel, getClassificationLabel } from "../utils";

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
    flexibleWorkLocations: localizedEnumStrings(
      enumName: "FlexibleWorkLocation"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

interface FormFieldsProps {
  classifications: Pick<
    Classification,
    "group" | "level" | "name" | "displayName"
  >[];
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
    label: getClassificationLabel(classification, intl),
    ariaLabel: getClassificationAriaLabel(classification),
  }));

  const workStreamOptions = workStreams.map((workStream) => ({
    value: workStream.id,
    label: getLocalizedName(workStream.name, intl),
  }));

  const languageAbilityOptions = localizedEnumToOptions(
    data?.languageAbilities,
    intl,
  );

  // do not render Telework as a region option
  const sortedWorkRegions = sortWorkRegion(
    unpackMaybes(data?.workRegions),
  ).filter((region) => region.value !== (WorkRegion.Telework as string));
  const workRegionOptions = localizedEnumToOptions(sortedWorkRegions, intl);

  // ONSITE option not rendered as an option on the search page, it is automatically appended in applicantFilterToQueryArgs()
  const flexibleWorkLocationsSortedFiltered = sortFlexibleWorkLocations(
    unpackMaybes(data?.flexibleWorkLocations),
  ).filter((loc) => loc.value !== (FlexibleWorkLocation.Onsite as string));
  const flexibleWorkLocationOptions: CheckboxOption[] = localizedEnumToOptions(
    flexibleWorkLocationsSortedFiltered,
    intl,
  ).map((loc) => {
    if (loc.value === (FlexibleWorkLocation.Remote as string)) {
      return {
        value: loc.value,
        label: loc.label,
        contentBelow: intl.formatMessage({
          defaultMessage:
            "Employee works 100% remotely, with no requirements to be on-site.",
          id: "j+GOVX",
          description: "Checklist option explanatory note",
        }),
      };
    }
    if (loc.value === (FlexibleWorkLocation.Hybrid as string)) {
      return {
        value: loc.value,
        label: loc.label,
        contentBelow: intl.formatMessage({
          defaultMessage:
            "Employee works for a minimum of 3 days per week on-site, with the rest being remote.",
          id: "1yMApi",
          description: "Checklist option explanatory note",
        }),
      };
    }
    return {
      value: loc.value,
      label: loc.label,
    };
  });

  return (
    <>
      <FilterBlock
        id="classificationsFilter"
        title={intl.formatMessage(talentRequestMessages.classification)}
        text={intl.formatMessage({
          defaultMessage:
            "Select the classification and work stream of the position you aim to fill. We'll show you how many candidates match your selection.",
          id: "ZWUMrM",
          description:
            "Message describing the classification filter of the search form.",
        })}
      >
        <div className="flex flex-col gap-y-6">
          <Select
            id="classifications"
            label={intl.formatMessage(talentRequestMessages.classification)}
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
              defaultMessage: "Select a work stream",
              id: "Jtc63M",
              description: "Placeholder for work stream filter in search form.",
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
            "Help us match you to the best candidates by telling us about the skills you need.",
          id: "LDsiHk",
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
            "Select the working language of the position you’re hiring for. We'll compare this to the one chosen by candidates in their applications. Candidates who selected bilingual may not have Government of Canada second language evaluation results.",
          id: "BSfL03",
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
            "You can request candidates from employment equity groups to address current and future representation gaps in the workforce. Categories reflect employment equity groups defined under and collected following the Public Service Employment Act.",
          id: "bhLaJ0",
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
              "<strong>Note:</strong> Results will include any candidate that matches <strong>1 or more</strong> of the selected employment equity groups",
            id: "FPMibV",
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
      {/* update apps/playwright/tests/search-workflows.spec.ts when changing the below, or else */}
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
        {/* update apps/playwright/tests/search-workflows.spec.ts when changing the above, or else */}
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
            defaultMessage: "On-site office",
            id: "59TDoK",
            description:
              "Legend for location preferences filter on search form.",
          })}
          items={workRegionOptions}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </FilterBlock>
      <FilterBlock
        id="flexibleWorkLocationOptionsFilter"
        text={intl.formatMessage({
          defaultMessage:
            "Select the flexible work location options available for this position.",
          id: "bMM+wm",
          description:
            "Message describing the flexible work locations filter in the search form.",
        })}
      >
        <Checklist
          idPrefix="flexibleWorkLocations"
          id="flexibleWorkLocations"
          name="flexibleWorkLocations"
          legend={intl.formatMessage(messages.flexibleWorkLocationOptions)}
          items={flexibleWorkLocationOptions}
        />
      </FilterBlock>
      <AdvancedFilters />
    </>
  );
};

export default FormFields;
