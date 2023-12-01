import React from "react";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";

import {
  EmploymentDuration,
  OperationalRequirementV2,
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
import {
  LanguageAbility,
  WorkRegion,
  useUserFilterDataQuery,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";
import { getFullPoolTitleLabel } from "~/utils/poolUtils";

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

type UserFilterDialogProps = CommonFilterDialogProps<FormValues>;

const UserFilterDialog = ({
  onSubmit,
  defaultValues,
}: UserFilterDialogProps) => {
  const intl = useIntl();

  const [{ data, fetching }] = useUserFilterDataQuery({ context });

  const pools = unpackMaybes(data?.pools);
  const skills = unpackMaybes(data?.skills);
  const roles = unpackMaybes(data?.roles);

  return (
    <FilterDialog<FormValues> onSubmit={onSubmit} options={{ defaultValues }}>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      >
        <div data-h2-grid-column="l-tablet(span 2)">
          <Combobox
            id="pools"
            name="pools"
            {...{ fetching }}
            isMulti
            label={intl.formatMessage(adminMessages.pools)}
            options={pools.map((pool) => ({
              value: pool.id,
              label: getFullPoolTitleLabel(intl, pool),
            }))}
          />
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
            nullSelection={intl.formatMessage({
              defaultMessage: "Any language",
              id: "qp68Mh",
              description: "Option label for allowing any language",
            })}
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
              .filter(
                (role) =>
                  role?.name === ROLE_NAME.PlatformAdmin ||
                  role?.name === ROLE_NAME.PoolOperator ||
                  role?.name === ROLE_NAME.RequestResponder,
              )
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
            items={OperationalRequirementV2.map((value) => ({
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
