import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import {
  ENUM_SORT_ORDER,
  EmploymentDuration,
  TEmploymentDuration,
  commonMessages,
  getEmploymentDuration,
  narrowEnumType,
  navigationMessages,
  sortLocalizedEnumOptions,
} from "@gc-digital-talent/i18n";
import {
  Checklist,
  Combobox,
  Select,
  enumToOptions,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  FlexibleWorkLocation,
  graphql,
  LanguageAbility,
  OperationalRequirement,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";

export interface FormValues {
  communities: string[];
  workStreams: string[];
  mobilityInterest: string[];
  mobilityType: string[];
  languageAbility?: LanguageAbility;
  employmentDuration?: TEmploymentDuration;
  locationPreferences: WorkRegion[];
  operationalRequirements: OperationalRequirement[];
  flexibleWorkLocations: FlexibleWorkLocation[];
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
    languageAbilities: localizedEnumOptions(enumName: "LanguageAbility") {
      ... on LocalizedLanguageAbility {
        value
        label {
          localized
        }
      }
    }
    workRegions: localizedEnumOptions(enumName: "WorkRegion") {
      ... on LocalizedWorkRegion {
        value
        label {
          localized
        }
      }
    }
    operationalRequirements: localizedEnumOptions(
      enumName: "OperationalRequirement"
    ) {
      ... on LocalizedOperationalRequirement {
        value
        label {
          localized
        }
      }
    }
    flexibleWorkLocations: localizedEnumOptions(
      enumName: "FlexibleWorkLocation"
    ) {
      ... on LocalizedFlexibleWorkLocation {
        value
        label {
          localized
        }
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
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const [{ data, fetching }] = useQuery({
    query: CommunityTalentFilterData_Query,
    context,
  });

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ onSubmit, resetValues }}
    >
      <Heading level="h3" size="h5" className="mt-0 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Community filters",
          id: "TYdl+S",
          description: "Heading for filters associated with communities",
        })}
      </Heading>
      <div className="grid gap-6 xs:grid-cols-2">
        <Combobox
          id="communities"
          name="communities"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.communities)}
          options={unpackMaybes(data?.communities).map(({ id, name }) => ({
            value: id,
            label: name?.localized ?? notAvailable,
          }))}
        />
        <Combobox
          id="workStreams"
          name="workStreams"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.workStreams)}
          options={unpackMaybes(data?.workStreams).map((workStream) => ({
            value: workStream.id,
            label: workStream.name?.localized ?? notAvailable,
          }))}
        />
      </div>
      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Employee profile filters",
          id: "AXJKYq",
          description: "Heading for filters associated with employee profiles",
        })}
      </Heading>
      <div className="grid gap-6 xs:grid-cols-2">
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
      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Profile filters",
          id: "WqxVxb",
          description:
            "Heading for filters associated with a candidates profile",
        })}
      </Heading>
      <div className="grid gap-6 xs:grid-cols-2">
        <Select
          id="languageAbility"
          name="languageAbility"
          enableNull
          nullSelection={intl.formatMessage(commonMessages.anyLanguage)}
          label={intl.formatMessage(commonMessages.workingLanguageAbility)}
          options={narrowEnumType(
            unpackMaybes(data?.languageAbilities),
            "LanguageAbility",
          ).map((languageAbility) => ({
            value: languageAbility.value,
            label: languageAbility.label?.localized ?? notAvailable,
          }))}
        />
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
        <Checklist
          idPrefix="flexibleWorkLocations"
          name="flexibleWorkLocations"
          legend={intl.formatMessage(navigationMessages.flexibleWorkLocations)}
          items={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.FLEXIBLE_WORK_LOCATION,
            narrowEnumType(
              unpackMaybes(data?.flexibleWorkLocations),
              "FlexibleWorkLocation",
            ),
          ).map((flexibleWorkLocation) => ({
            value: flexibleWorkLocation.value,
            label: flexibleWorkLocation.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="locationPreferences"
          name="locationPreferences"
          legend={intl.formatMessage(navigationMessages.workLocation)}
          items={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.WORK_REGION,
            narrowEnumType(unpackMaybes(data?.workRegions), "WorkRegion"),
          )
            /* remove 'Telework' enum from checklist of options */
            .filter((workRegion) => workRegion.value !== WorkRegion.Telework)
            .map((workRegion) => ({
              value: workRegion.value,
              label: workRegion.label?.localized ?? notAvailable,
            }))}
        />
        <div className="xs:col-span-2">
          <Checklist
            idPrefix="operationalRequirements"
            name="operationalRequirements"
            legend={intl.formatMessage(navigationMessages.workPreferences)}
            items={narrowEnumType(
              unpackMaybes(data?.operationalRequirements),
              "OperationalRequirement",
            ).map((operationalRequirement) => ({
              value: operationalRequirement.value,
              label: operationalRequirement.label?.localized ?? notAvailable,
            }))}
          />
        </div>
        <div className="xs:col-span-2">
          <Combobox
            id="skills"
            name="skills"
            {...{ fetching }}
            isMulti
            label={intl.formatMessage(adminMessages.skills)}
            options={unpackMaybes(data?.skills).map(({ id, name }) => ({
              value: id,
              label: name.localized ?? notAvailable,
            }))}
          />
        </div>
      </div>
    </FilterDialog>
  );
};

export default CommunityTalentFilterDialog;
