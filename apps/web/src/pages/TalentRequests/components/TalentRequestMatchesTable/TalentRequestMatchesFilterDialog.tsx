import { useIntl, type MessageDescriptor } from "react-intl";
import type { options } from "react-router";

import {
  WorkRegion,
  type FlexibleWorkLocation,
  type FragmentType,
  type LanguageAbility,
  type OperationalRequirement,
  type PriorityWeight,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  getEmploymentEquityGroup,
  narrowEnumType,
  navigationMessages,
  sortLocalizedEnumOptions,
} from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";
import {
  Checklist,
  Combobox,
  Select,
  SwitchInput,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import type { CommonFilterDialogProps } from "~/components/FilterDialog/FilterDialog";
import FilterDialog from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";
import PoolFilterInput from "~/components/PoolFilterInput/PoolFilterInput";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";

const TalentRequestMatchesFilterDialog_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestMatchesFilterDialog on Query {
    classifications {
      group
      level
      groupAndLevel
    }
    skills {
      id
      name {
        localized
      }
    }
    communities {
      id
      name {
        localized
      }
    }
    departments {
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
    languageAbilities: localizedEnumOptions(enumName: "LanguageAbility") {
      ... on LocalizedLanguageAbility {
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
    priorityWeights: localizedEnumOptions(enumName: "PriorityWeight") {
      ... on LocalizedPriorityWeight {
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
  }
`);

export interface FormValues {
  community?: string;
  classifications?: string[];
  streams?: string[];
  pools?: string[];
  languageAbility?: LanguageAbility;
  equity?: [];
  priorityWeight?: PriorityWeight[];
  operationalRequirements?: OperationalRequirement[];
  flexibleWorkLocations?: FlexibleWorkLocation[];
  workRegions?: WorkRegion[];
  govEmployee?: string;
  departments?: string[];
  skills?: string[];
}

export type TalentRequestMatchesFilterDialogProps =
  CommonFilterDialogProps<FormValues> & {
    query?: FragmentType<typeof TalentRequestMatchesFilterDialog_Fragment>;
  };

const TalentRequestMatchesFilterDialog = ({
  query,
  onSubmit,
  resetValues,
  initialValues,
}: TalentRequestMatchesFilterDialogProps) => {
  const intl = useIntl();
  const options = getFragment(TalentRequestMatchesFilterDialog_Fragment, query);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const equityOption = (value: string, message: MessageDescriptor) => ({
    value,
    label: intl.formatMessage(message),
  });

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ resetValues, onSubmit }}
    >
      <Heading level="h3" size="h5" className="mt-0 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Process filters",
          id: "+dlRCu",
          description:
            "Heading for filters associated with a candidates process",
        })}
      </Heading>

      <Select
        id="community"
        name="community"
        enableNull
        label={intl.formatMessage(adminMessages.community)}
        nullSelection={intl.formatMessage(commonMessages.selectACommunity)}
        options={unpackMaybes(options?.communities).map(({ id, name }) => ({
          value: id,
          label: name?.localized ?? notAvailable,
        }))}
      />
      <div className="my-6 grid gap-6 xs:grid-cols-2">
        <Combobox
          id="classifications"
          name="classifications"
          isMulti
          label={intl.formatMessage(adminMessages.classifications)}
          options={unpackMaybes(options?.classifications).map(
            ({ group, level, groupAndLevel }) => ({
              value: `${group}-${level}`,
              label: groupAndLevel,
            }),
          )}
        />
        <Combobox
          id="streams"
          name="streams"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={unpackMaybes(options?.workStreams).map((workStream) => ({
            value: workStream.id,
            label: workStream.name?.localized ?? notAvailable,
          }))}
        />
      </div>
      <PoolFilterInput />

      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Profile filters",
          id: "WqxVxb",
          description:
            "Heading for filters associated with a candidates profile",
        })}
      </Heading>

      <div className="grid gap-6 xs:grid-cols-3">
        <Select
          id="languageAbility"
          name="languageAbility"
          enableNull
          nullSelection={intl.formatMessage(commonMessages.anyLanguage)}
          label={intl.formatMessage(commonMessages.workingLanguageAbility)}
          options={narrowEnumType(
            unpackMaybes(options?.languageAbilities),
            "LanguageAbility",
          ).map((languageAbility) => ({
            value: languageAbility.value,
            label: languageAbility.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="equity"
          name="equity"
          legend={intl.formatMessage(commonMessages.employmentEquity)}
          items={[
            equityOption("isWoman", getEmploymentEquityGroup("woman")),
            equityOption(
              "hasDisability",
              getEmploymentEquityGroup("disability"),
            ),
            equityOption(
              "isIndigenous",
              getEmploymentEquityGroup("indigenous"),
            ),
            equityOption(
              "isVisibleMinority",
              getEmploymentEquityGroup("minority"),
            ),
          ]}
        />
        <Checklist
          idPrefix="priorityWeight"
          name="priorityWeight"
          legend={intl.formatMessage(adminMessages.category)}
          items={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.PRIORITY_WEIGHT,
            narrowEnumType(
              unpackMaybes(options?.priorityWeights),
              "PriorityWeight",
            ),
          ).map((priorityWeight) => ({
            value: priorityWeight.value,
            label: priorityWeight.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="operationalRequirement"
          name="operationalRequirement"
          legend={intl.formatMessage(navigationMessages.workPreferences)}
          items={narrowEnumType(
            unpackMaybes(options?.operationalRequirements),
            "OperationalRequirement",
          ).map((operationalRequirement) => ({
            value: operationalRequirement.value,
            label: operationalRequirement.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="flexibleWorkLocations"
          name="flexibleWorkLocations"
          legend={intl.formatMessage(navigationMessages.flexibleWorkLocations)}
          items={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.FLEXIBLE_WORK_LOCATION,
            narrowEnumType(
              unpackMaybes(options?.flexibleWorkLocations),
              "FlexibleWorkLocation",
            ),
          ).map((flexibleWorkLocation) => ({
            value: flexibleWorkLocation.value,
            label: flexibleWorkLocation.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="workRegion"
          name="workRegion"
          legend={intl.formatMessage(navigationMessages.workLocation)}
          items={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.WORK_REGION,
            narrowEnumType(unpackMaybes(options?.workRegions), "WorkRegion"),
          )
            /* remove 'Telework' enum from checklist of options */
            .filter((workRegion) => workRegion.value !== WorkRegion.Telework)
            .map((workRegion) => ({
              value: workRegion.value,
              label: workRegion.label?.localized ?? notAvailable,
            }))}
        />
        <div className="flex flex-col gap-6 xs:col-span-3">
          <SwitchInput
            id="govEmployee"
            name="govEmployee"
            color="secondary"
            value="true"
            label={intl.formatMessage(commonMessages.governmentEmployee)}
          />
          <Combobox
            id="departments"
            name="departments"
            isMulti
            label={intl.formatMessage(tableMessages.employeeDepartment)}
            options={unpackMaybes(options?.departments).map((dept) => ({
              value: dept.id,
              label:
                dept.name?.localized ??
                intl.formatMessage(commonMessages.notFound),
            }))}
          />
          <Combobox
            id="skills"
            name="skills"
            isMulti
            label={intl.formatMessage(adminMessages.skills)}
            options={unpackMaybes(options?.skills).map(({ id, name }) => ({
              value: id,
              label: name.localized ?? notAvailable,
            }))}
          />
        </div>
      </div>
    </FilterDialog>
  );
};

export default TalentRequestMatchesFilterDialog;
