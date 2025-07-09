import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import {
  EmploymentDuration,
  commonMessages,
  getEmploymentDuration,
  getLocalizedName,
  navigationMessages,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";
import {
  Checkbox,
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
import PoolFilterInput from "~/components/PoolFilterInput/PoolFilterInput";

import ROLES_TO_HIDE_USERS_TABLE from "./constants";

export interface FormValues {
  pools: string[];
  languageAbility: string;
  operationalRequirement: string[];
  workRegion: string[];
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
      key
      name {
        en
        fr
      }
      category {
        value
      }
    }
    roles {
      id
      name
      displayName {
        en
        fr
      }
    }
    languageAbilities: localizedEnumStrings(enumName: "LanguageAbility") {
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
    workRegions: localizedEnumStrings(enumName: "WorkRegion") {
      value
      label {
        en
        fr
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

  const [{ data, fetching }] = useQuery({
    query: UserFilterData_Query,
    context,
  });

  const skills = unpackMaybes(data?.skills);
  const roles = unpackMaybes(data?.roles);

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ onSubmit, resetValues }}
    >
      <div className="grid gap-6 xs:grid-cols-2">
        <div className="xs:grid-cols-2">
          <PoolFilterInput />
        </div>
        <div className="flex flex-col gap-y-6">
          <Select
            id="languageAbility"
            name="languageAbility"
            enableNull
            nullSelection={intl.formatMessage(commonMessages.anyLanguage)}
            label={intl.formatMessage(commonMessages.workingLanguageAbility)}
            options={localizedEnumToOptions(data?.languageAbilities, intl)}
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
            idPrefix="roles"
            name="roles"
            legend={intl.formatMessage(adminMessages.rolesAndPermissions)}
            items={roles
              .filter((role) => !ROLES_TO_HIDE_USERS_TABLE.includes(role.name))
              .map((role) => ({
                value: role.id,
                label: getLocalizedName(role.displayName, intl),
              }))}
          />
          <div className="flex flex-wrap gap-3">
            <Checkbox
              id="profileComplete"
              name="profileComplete"
              value="true"
              label={intl.formatMessage({
                defaultMessage: "Profile complete",
                id: "h7IJnu",
                description: "Label for the profile complete field",
              })}
            />
            <Checkbox
              id="govEmployee"
              name="govEmployee"
              value="true"
              label={intl.formatMessage({
                defaultMessage: "Government employee",
                id: "bOA3EH",
                description: "Label for the government employee field",
              })}
            />
            <Checkbox
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
          <Checklist
            idPrefix="operationalRequirement"
            name="operationalRequirement"
            legend={intl.formatMessage(navigationMessages.workPreferences)}
            items={localizedEnumToOptions(data?.operationalRequirements, intl)}
          />
        </div>
        <div className="xs:col-span-2">
          <Combobox
            id="skills"
            name="skills"
            {...{ fetching }}
            isMulti
            label={intl.formatMessage(adminMessages.skills)}
            options={skills.map(({ id, name }) => ({
              value: id,
              label: getLocalizedName(name, intl),
            }))}
          />
        </div>
      </div>
    </FilterDialog>
  );
};

export default UserFilterDialog;
