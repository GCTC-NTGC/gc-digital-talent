import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import { OperationContext } from "urql";

import {
  Checkbox,
  Checklist,
  Combobox,
  HiddenInput,
  RadioGroup,
  Select,
  enumToOptions,
  enumToOptionsWorkRegionSorted,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  OperationalRequirementV2,
  getCandidateExpiryFilterStatus,
  getCandidateSuspendedFilterStatus,
  getEmploymentEquityGroup,
  getLanguageAbility,
  getLocalizedName,
  getOperationalRequirement,
  getPoolCandidateStatus,
  getPoolStream,
  getPublishingGroup,
  getWorkRegion,
  navigationMessages,
  poolCandidatePriorities,
} from "@gc-digital-talent/i18n";

import {
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  LanguageAbility,
  PoolCandidateStatus,
  PoolStream,
  PublishingGroup,
  WorkRegion,
  usePoolCandidateFilterDataQuery,
} from "~/api/generated";

import FilterDialog, {
  CommonFilterDialogProps,
} from "../FilterDialog/FilterDialog";
import adminMessages from "../../messages/adminMessages";
import { getFullPoolTitleLabel } from "../../utils/poolUtils";

export type FormValues = {
  languageAbility: string;
  classifications: string[];
  stream: string[];
  operationalRequirement: string[];
  workRegion: string[];
  equity: string[];
  poolCandidateStatus: string[];
  priorityWeight: string[];
  pools: string[];
  skills: string[];
  expiryStatus: string;
  suspendedStatus: string;
  publishingGroups: string[];
  govEmployee: string;
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

type PoolCandidateFilterDialogProps = CommonFilterDialogProps<FormValues> & {
  hidePoolFilter?: boolean;
};

const PoolCandidateFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
  hidePoolFilter,
}: PoolCandidateFilterDialogProps) => {
  const intl = useIntl();

  const [{ data, fetching }] = usePoolCandidateFilterDataQuery({ context });

  const classifications = unpackMaybes(data?.classifications);
  const pools = unpackMaybes(data?.pools);
  const skills = unpackMaybes(data?.skills);

  const equityOption = (value: string, message: MessageDescriptor) => ({
    value,
    label: intl.formatMessage(message),
  });

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      // Remove hidden pools filter from count
      {...(hidePoolFilter && {
        modifyFilterCount: -1,
      })}
      {...{ resetValues, onSubmit }}
    >
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) p-tablet(repeat(3, 1fr))"
      >
        {hidePoolFilter ? (
          <HiddenInput name="pools" />
        ) : (
          <div data-h2-grid-column="l-tablet(span 3)">
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
        )}

        <Checklist
          idPrefix="publishingGroups"
          name="publishingGroups"
          legend={intl.formatMessage(adminMessages.publishingGroups)}
          items={enumToOptions(PublishingGroup).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPublishingGroup(value)),
            ariaLabel: intl
              .formatMessage(getPublishingGroup(value))
              .replace(
                intl.locale === "en" ? "IT" : "TI",
                intl.locale === "en" ? "I T" : "T I",
              ),
          }))}
        />
        <Checklist
          idPrefix="equity"
          name="equity"
          legend={intl.formatMessage({
            defaultMessage: "Employment equity",
            id: "9e6Xph",
            description: "Label for the employment equity field",
          })}
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
          legend={intl.formatMessage({
            defaultMessage: "Category",
            id: "qrDCTV",
            description:
              "Title displayed for the Pool Candidates table Priority column.",
          })}
          items={Object.keys(poolCandidatePriorities).map((key) => ({
            value: Number(key),
            label: intl.formatMessage(
              poolCandidatePriorities[
                Number(key) as keyof typeof poolCandidatePriorities
              ],
            ),
          }))}
        />
        <Combobox
          id="classifications"
          name="classifications"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.classifications)}
          options={classifications.map(({ group, level }) => ({
            value: `${group}-${level}`,
            label: `${group}-0${level}`,
          }))}
        />
        <Combobox
          id="stream"
          name="stream"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={enumToOptions(PoolStream).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPoolStream(value)),
          }))}
        />
        <Combobox
          id="poolCandidateStatus"
          name="poolCandidateStatus"
          isMulti
          label={intl.formatMessage(adminMessages.status)}
          options={enumToOptions(PoolCandidateStatus).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPoolCandidateStatus(value)),
          }))}
        />
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
        <Checklist
          idPrefix="workRegion"
          name="workRegion"
          legend={intl.formatMessage(navigationMessages.workLocation)}
          items={enumToOptionsWorkRegionSorted(WorkRegion).map(({ value }) => ({
            value,
            label: intl.formatMessage(getWorkRegion(value)),
          }))}
        />
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1 0)"
        >
          <RadioGroup
            idPrefix="expiryStatus"
            name="expiryStatus"
            legend={intl.formatMessage({
              defaultMessage: "Expiry status",
              description: "Label for the expiry status field",
              id: "HDiUEc",
            })}
            items={enumToOptions(CandidateExpiryFilter).map(({ value }) => ({
              value,
              label: intl.formatMessage(getCandidateExpiryFilterStatus(value)),
            }))}
          />
          <RadioGroup
            idPrefix="suspendedStatus"
            name="suspendedStatus"
            legend={intl.formatMessage({
              defaultMessage: "Candidacy status",
              description: "Label for the candidacy status field",
              id: "NxrKpM",
            })}
            items={enumToOptions(CandidateSuspendedFilter).map(({ value }) => ({
              value,
              label: intl.formatMessage(
                getCandidateSuspendedFilterStatus(value),
              ),
            }))}
          />
        </div>
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
        <div data-h2-grid-column="l-tablet(span 2)">
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
        </div>
        <div data-h2-grid-column="l-tablet(span 3)">
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

export default PoolCandidateFilterDialog;
