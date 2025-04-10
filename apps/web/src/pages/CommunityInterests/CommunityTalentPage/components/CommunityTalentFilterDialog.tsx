import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import {
  EmploymentDuration,
  commonMessages,
  getEmploymentDuration,
  navigationMessages,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";
import {
  Checklist,
  Combobox,
  Select,
  enumToOptions,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";
export interface FormValues {
  communities: string[];
  workStreams: string[];
  mobilityInterest: string[];
  mobilityType: string[];
  languageAbility: string;
  employmentDuration: string;
  workRegions: string[];
  operationalRequirements: string[];
  skills: string[];
}

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const CommunityTalentFilterData_Query = graphql(/* GraphQL */ `
  query CommunityFilterData {
    communities {
      id
      name {
        localized
      }
    }
    workStreams {
      id
      name {
        localized
      }
    }
    languageAbilities: localizedEnumStrings(enumName: "LanguageAbility") {
      value
      label {
        localized
      }
    }
    workRegions: localizedEnumStrings(enumName: "WorkRegion") {
      value
      label {
        en
        fr
      }
    }
    operationalRequirements: localizedEnumStrings(
      enumName: "OperationalRequirement"
    ) {
      value
      label {
        en
        fr
      }
    }
    skills {
      id
      key
      name {
        localized
      }
    }
  }
`);

type CommunityTalentFilterDialogProps = CommonFilterDialogProps<FormValues>;

const CommunityTalentFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: CommunityTalentFilterDialogProps) => {
  const intl = useIntl();

  const [{ data, fetching }] = useQuery({
    query: CommunityTalentFilterData_Query,
    context,
  });

  const communities = unpackMaybes(data?.communities);
  const workStreams = unpackMaybes(data?.workStreams);
  const languageAbilities = unpackMaybes(data?.languageAbilities);
  const skills = unpackMaybes(data?.skills);

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ onSubmit, resetValues }}
    >
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      >
        <div data-h2-grid-column="base(span 2) l-tablet(span 1)">
          <Combobox
            id="communities"
            name="communities"
            {...{ fetching }}
            isMulti
            label={intl.formatMessage(adminMessages.communities)}
            options={communities.map(({ id, name }) => ({
              value: id,
              label: name?.localized,
            }))}
          />
        </div>
        <div data-h2-grid-column="base(span 2) l-tablet(span 1)">
          <Combobox
            id="workStreams"
            name="workStreams"
            {...{ fetching }}
            isMulti
            label={intl.formatMessage(adminMessages.workStreams)}
            options={workStreams.map(({ id, name }) => ({
              value: id,
              label: name?.localized,
            }))}
          />
        </div>
        <div data-h2-grid-column="base(span 2) l-tablet(span 1)">
          <Checklist
            idPrefix="mobilityInterest"
            name="mobilityInterest"
            legend={intl.formatMessage({
              defaultMessage: "Mobility interest",
              id: "GVShpq",
              description:
                "Legend for mobility interest checklist in community talent filter dialog",
            })}
            items={[
              {
                label: intl.formatMessage({
                  defaultMessage: "Interested in jobs",
                  id: "1t7mzf",
                  description:
                    "Label for interested in jobs checkbox for mobility interest checklist",
                }),
                value: "jobInterest",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Interested in training",
                  id: "1Q4qv9",
                  description:
                    "Label for interested in training checkbox for mobility interest checklist",
                }),
                value: "trainingInterest",
              },
            ]}
          />
        </div>
        <div data-h2-grid-column="base(span 2) l-tablet(span 1)">
          <Checklist
            idPrefix="mobilityType"
            name="mobilityType"
            legend={intl.formatMessage({
              defaultMessage: "Mobility type",
              id: "Avr7yn",
              description:
                "Legend for mobility type checklist in community talent filter dialog",
            })}
            items={[
              {
                label: intl.formatMessage({
                  defaultMessage:
                    "Interested in Lateral movement (At-level mobility)",
                  id: "+CU+6M",
                  description:
                    "Label for interested in lateral movement checkbox for mobility type checklist",
                }),
                value: "lateralMoveInterest",
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Promotions and advancement",
                  id: "h0mWc3",
                  description:
                    "Label for interested in promotional movement checkbox for mobility type checklist",
                }),
                value: "promotionMoveInterest",
              },
            ]}
          />
        </div>
        <div data-h2-grid-column="base(span 2) l-tablet(span 1)">
          <Select
            id="languageAbility"
            name="languageAbility"
            enableNull
            nullSelection={intl.formatMessage(commonMessages.anyLanguage)}
            label={intl.formatMessage(commonMessages.workingLanguageAbility)}
            options={languageAbilities.map(({ value, label }) => ({
              value,
              label: label.localized,
            }))}
          />
        </div>
        <div data-h2-grid-column="base(span 2) l-tablet(span 1)">
          <Select
            id="employmentDuration"
            name="employmentDuration"
            enableNull
            nullSelection={intl.formatMessage({
              defaultMessage: "Any duration",
              id: "Swq+OD",
              description: "Option label for allowing any employment duration",
            })}
            label={intl.formatMessage({
              defaultMessage: "Duration preferences",
              id: "2ingb6",
              description: "Label for the employment duration field",
            })}
            options={enumToOptions(EmploymentDuration).map(({ value }) => ({
              value,
              label: intl.formatMessage(getEmploymentDuration(value, "short")),
            }))}
          />
        </div>
        <div data-h2-grid-column="base(span 2) l-tablet(span 1)">
          <Checklist
            idPrefix="workRegions"
            name="workRegions"
            legend={intl.formatMessage(navigationMessages.workLocation)}
            items={localizedEnumToOptions(
              sortWorkRegion(data?.workRegions),
              intl,
            )}
          />
        </div>
        <div data-h2-grid-column="base(span 2) l-tablet(span 1)">
          <Checklist
            idPrefix="operationalRequirements"
            name="operationalRequirements"
            legend={intl.formatMessage(navigationMessages.workPreferences)}
            items={localizedEnumToOptions(data?.operationalRequirements, intl)}
          />
        </div>
        <div data-h2-grid-column="base(span 2)">
          <Combobox
            id="skills"
            name="skills"
            {...{ fetching }}
            isMulti
            label={intl.formatMessage(adminMessages.skills)}
            options={skills.map(({ id, name }) => ({
              value: id,
              label: name?.localized,
            }))}
          />
        </div>
      </div>
    </FilterDialog>
  );
};

export default CommunityTalentFilterDialog;
