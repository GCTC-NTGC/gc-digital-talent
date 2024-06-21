import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import {
  EmploymentDuration,
  OperationalRequirements,
  commonMessages,
  getEmploymentDuration,
  getLanguageAbility,
  getLocalizedName,
  getOperationalRequirement,
  getWorkRegion,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import {
  Checkbox,
  Checklist,
  Combobox,
  Select,
  enumToOptions,
  enumToOptionsWorkRegionSorted,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  LanguageAbility,
  WorkRegion,
  graphql,
} from "@gc-digital-talent/graphql";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";
import PoolFilterInput from "~/components/PoolFilterInput/PoolFilterInput";

import ROLES_TO_HIDE_USERS_TABLE from "./constants";

export type FormValues = {
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
};

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
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      >
        <div data-h2-grid-column="l-tablet(span 2)">
          <PoolFilterInput />
        </div>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
        >
          <Select
            id="languageAbility"
            name="languageAbility"
            enableNull
            nullSelection={intl.formatMessage(commonMessages.anyLanguage)}
            label={intl.formatMessage({
              defaultMessage: "Languages",
              id: "iUAe/2",
              description: "Label for language ability field",
            })}
            options={enumToOptions(LanguageAbility).map(({ value }) => ({
              value,
              label: intl.formatMessage(getLanguageAbility(value)),
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
            items={enumToOptionsWorkRegionSorted(WorkRegion).map(
              ({ value }) => ({
                value,
                label: intl.formatMessage(getWorkRegion(value)),
              }),
            )}
          />
        </div>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
        >
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
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(row)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-gap="base(x.5)"
          >
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
            items={OperationalRequirements.map((value) => ({
              value,
              label: intl.formatMessage(
                getOperationalRequirement(value, "short"),
              ),
            }))}
          />
        </div>
        <div data-h2-grid-column="l-tablet(span 2)">
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
