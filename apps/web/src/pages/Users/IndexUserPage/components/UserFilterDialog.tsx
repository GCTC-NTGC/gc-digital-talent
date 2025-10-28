import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import {
  EmploymentDuration,
  commonMessages,
  getEmploymentDuration,
  narrowEnumType,
  navigationMessages,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";
import {
  Checkbox,
  Checklist,
  Combobox,
  Select,
  SwitchInput,
  enumToOptions,
  localizedEnumToOptions,
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
import PoolFilterInput from "~/components/PoolFilterInput/PoolFilterInput";

import ROLES_TO_HIDE_USERS_TABLE from "./constants";

export interface FormValues {
  pools: string[];
  languageAbility?: LanguageAbility;
  operationalRequirement: OperationalRequirement[];
  workRegion: WorkRegion[];
  flexibleWorkLocations: FlexibleWorkLocation[];
  employmentDuration: string;
  skills: string[];
  profileComplete: string;
  govEmployee: string;
  roles: string[];
  trashed: string;
}

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const UserFilterData_Query = graphql(/* GraphQL */ `
  query UserFilterData {
    skills {
      id
      name {
        localized
      }
    }
    roles {
      id
      name
      displayName {
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

type UserFilterDialogProps = CommonFilterDialogProps<FormValues>;

const UserFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: UserFilterDialogProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const [{ data, fetching }] = useQuery({
    query: UserFilterData_Query,
    context,
  });

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ onSubmit, resetValues }}
    >
      <Heading level="h3" size="h5" className="mt-0 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Process filters",
          id: "+dlRCu",
          description:
            "Heading for filters associated with a candidates process",
        })}
      </Heading>
      <PoolFilterInput />
      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Profile filters",
          id: "WqxVxb",
          description:
            "Heading for filters associated with a candidates profile",
        })}
      </Heading>

      <div className="mb-6 grid gap-6 xs:grid-cols-2">
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
          idPrefix="workRegion"
          name="workRegion"
          legend={intl.formatMessage(navigationMessages.workLocation)}
          items={localizedEnumToOptions(
            sortWorkRegion(data?.workRegions),
            intl,
          )}
        />
      </div>

      <div className="flex flex-col gap-y-6">
        <Checklist
          idPrefix="operationalRequirement"
          name="operationalRequirement"
          legend={intl.formatMessage(navigationMessages.workPreferences)}
          items={narrowEnumType(
            unpackMaybes(data?.operationalRequirements),
            "OperationalRequirement",
          ).map((operationalRequirement) => ({
            value: operationalRequirement.value,
            label: operationalRequirement.label?.localized ?? notAvailable,
          }))}
        />
        <Checkbox
          id="govEmployee"
          name="govEmployee"
          value="true"
          label={intl.formatMessage(commonMessages.governmentEmployee)}
        />
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

      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage(commonMessages.advancedFilters)}
      </Heading>

      <div className="grid gap-6 xs:grid-cols-2">
        <Checklist
          idPrefix="roles"
          name="roles"
          legend={intl.formatMessage(adminMessages.rolesAndPermissions)}
          items={unpackMaybes(data?.roles)
            .filter((role) => !ROLES_TO_HIDE_USERS_TABLE.includes(role.name))
            .map((role) => ({
              value: role.id,
              label: role.displayName?.localized ?? notAvailable,
            }))}
        />
        <div className="flex flex-col gap-y-6">
          <SwitchInput
            id="profileComplete"
            name="profileComplete"
            value="true"
            label={intl.formatMessage({
              defaultMessage: "Profile complete",
              id: "h7IJnu",
              description: "Label for the profile complete field",
            })}
          />
          <SwitchInput
            id="trashed"
            name="trashed"
            value="true"
            label={intl.formatMessage({
              defaultMessage: "Deleted",
              id: "CzK1qY",
              description: "Label for the trashed field",
            })}
          />
        </div>
      </div>
    </FilterDialog>
  );
};

export default UserFilterDialog;
