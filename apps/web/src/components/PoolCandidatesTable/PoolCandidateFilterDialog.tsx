import { MessageDescriptor, useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

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
import {
  graphql,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
  LanguageAbility,
  PoolCandidateStatus,
  PoolStream,
  PublishingGroup,
  WorkRegion,
  PriorityWeight,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  OperationalRequirements,
  commonMessages,
  getCandidateExpiryFilterStatus,
  getCandidateSuspendedFilterStatus,
  getEmploymentEquityGroup,
  getLanguageAbility,
  getLocalizedName,
  getOperationalRequirement,
  getPoolCandidatePriorities,
  getPoolCandidateStatus,
  getPoolStream,
  getPublishingGroup,
  getWorkRegion,
  navigationMessages,
} from "@gc-digital-talent/i18n";

import adminMessages from "~/messages/adminMessages";

import FilterDialog, {
  CommonFilterDialogProps,
} from "../FilterDialog/FilterDialog";
import { FormValues } from "./types";
import PoolFilterInput from "../PoolFilterInput/PoolFilterInput";

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const PoolCandidateFilterDialog_Query = graphql(/* GraphQL */ `
  query PoolCandidateFilterDialog_Query {
    classifications {
      group
      level
    }
    skills {
      id
      name {
        en
        fr
      }
    }
  }
`);

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

  const [{ data, fetching }] = useQuery({
    query: PoolCandidateFilterDialog_Query,
    context,
  });

  const classifications = unpackMaybes(data?.classifications);
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
            <PoolFilterInput />
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
          items={enumToOptions(PriorityWeight).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPoolCandidatePriorities(value)),
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
          label={intl.formatMessage(commonMessages.status)}
          options={enumToOptions(PoolCandidateStatus).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPoolCandidateStatus(value)),
          }))}
        />
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
