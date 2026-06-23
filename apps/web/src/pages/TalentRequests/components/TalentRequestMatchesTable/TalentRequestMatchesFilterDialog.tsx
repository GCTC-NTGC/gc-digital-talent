import { useIntl, type MessageDescriptor } from "react-intl";
import type { SubmitHandler } from "react-hook-form";

import {
  WorkRegion,
  type EmployeeVerification,
  type FlexibleWorkLocation,
  type FragmentType,
  type LanguageAbility,
  type OperationalRequirement,
  type PriorityWeight,
  type TalentRequestUserSkillMatchFragment,
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
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import type { CommonFilterDialogProps } from "~/components/FilterDialog/FilterDialog";
import FilterDialog from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";
import PoolFilterInput from "~/components/PoolFilterInput/PoolFilterInput";
import usePoolFilterOptions from "~/components/PoolFilterInput/usePoolFilterOptions";
import tableMessages from "~/components/PoolCandidatesTable/tableMessages";

import { TalentRequestUserSkillMatch_Fragment } from "../skillMatchFragment";

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

      ...TalentRequestUserSkillMatch
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
    employeeVerifications: localizedEnumOptions(enumName: "EmployeeVerification") {
      ... on LocalizedEmployeeVerification {
        value
        label {
          localized
        }
      }
    }
  }
`);

export interface FormValues {
  classifications?: string[];
  streams?: string[];
  pools?: string[];
  languageAbility?: LanguageAbility;
  equity?: string[];
  priorityWeight?: PriorityWeight[];
  operationalRequirements?: OperationalRequirement[];
  flexibleWorkLocations?: FlexibleWorkLocation[];
  workRegions?: WorkRegion[];
  govEmployee?: EmployeeVerification[];
  departments?: string[];
  skills?: string[];
}

export type TalentRequestMatchesFilterDialogProps = Omit<
  CommonFilterDialogProps<FormValues>,
  "onSubmit"
> & {
  query?: FragmentType<typeof TalentRequestMatchesFilterDialog_Fragment>;
  onSubmit: (
    values: FormValues,
    skills: TalentRequestUserSkillMatchFragment[],
  ) => void;
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
  // Pre-warm cache with the same variables PoolFilterInput uses on mount so
  // options are available synchronously when the dialog opens.
  usePoolFilterOptions({ generalSearch: undefined }, initialValues?.pools);

  const equityOption = (value: string, message: MessageDescriptor) => ({
    value,
    label: intl.formatMessage(message),
  });

  const handleSubmit: SubmitHandler<FormValues> = (values) => {
    const requestedSkills = unpackMaybes(options?.skills).filter(({ id }) =>
      values.skills?.includes(id),
    );
    onSubmit?.(
      values,
      getFragment(TalentRequestUserSkillMatch_Fragment, requestedSkills),
    );
  };

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ resetValues, onSubmit: handleSubmit }}
    >
      <Heading level="h3" size="h5" className="mt-0 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Process filters",
          id: "+dlRCu",
          description:
            "Heading for filters associated with a candidates process",
        })}
      </Heading>
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
      <PoolFilterInput includeIds={initialValues?.pools} />

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
          idPrefix="operationalRequirements"
          name="operationalRequirements"
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
          idPrefix="workRegions"
          name="workRegions"
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
          <Checklist
            idPrefix="govEmployee"
            name="govEmployee"
            legend={intl.formatMessage(commonMessages.governmentEmployee)}
            items={narrowEnumType(
              unpackMaybes(options?.employeeVerifications),
              "EmployeeVerification",
            ).map((opt) => ({
              value: opt.value,
              label: opt.label?.localized ?? notAvailable,
            }))}
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
