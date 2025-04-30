import { MessageDescriptor, useIntl } from "react-intl";

import {
  Checkbox,
  Checklist,
  Combobox,
  HiddenInput,
  RadioGroup,
  Select,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getEmploymentEquityGroup,
  getLocalizedName,
  navigationMessages,
  sortPriorityWeight,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";

import adminMessages from "~/messages/adminMessages";

import FilterDialog, {
  CommonFilterDialogProps,
} from "../FilterDialog/FilterDialog";
import { FormValues } from "./types";
import PoolFilterInput from "../PoolFilterInput/PoolFilterInput";

const PoolCandidateFilterDialog_Query = graphql(/* GraphQL */ `
  fragment PoolCandidateFilterDialog on Query {
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
    communities {
      id
      name {
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
    publishingGroups: localizedEnumStrings(enumName: "PublishingGroup") {
      value
      label {
        en
        fr
      }
    }
    priorityWeights: localizedEnumStrings(enumName: "PriorityWeight") {
      value
      label {
        en
        fr
      }
    }
    statuses: localizedEnumStrings(enumName: "PoolCandidateStatus") {
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
    expiryFilters: localizedEnumStrings(enumName: "CandidateExpiryFilter") {
      value
      label {
        en
        fr
      }
    }
    suspendedFilters: localizedEnumStrings(
      enumName: "CandidateSuspendedFilter"
    ) {
      value
      label {
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
    workStreams {
      id
      name {
        localized
      }
    }
  }
`);

type PoolCandidateFilterDialogProps = CommonFilterDialogProps<FormValues> & {
  hidePoolFilter?: boolean;
  query?: FragmentType<typeof PoolCandidateFilterDialog_Query>;
};

const PoolCandidateFilterDialog = ({
  query,
  onSubmit,
  resetValues,
  initialValues,
  hidePoolFilter,
}: PoolCandidateFilterDialogProps) => {
  const intl = useIntl();
  const data = getFragment(PoolCandidateFilterDialog_Query, query);

  const classifications = unpackMaybes(data?.classifications);
  const skills = unpackMaybes(data?.skills);
  const communities = unpackMaybes(data?.communities);
  const workStreams = unpackMaybes(data?.workStreams);

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
          items={localizedEnumToOptions(data?.publishingGroups, intl)}
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
          items={localizedEnumToOptions(
            sortPriorityWeight(data?.priorityWeights),
            intl,
          )}
        />
        <Combobox
          id="classifications"
          name="classifications"
          isMulti
          label={intl.formatMessage(adminMessages.classifications)}
          options={classifications.map(({ group, level }) => ({
            value: `${group}-${level}`,
            label: `${group}-${level < 10 ? "0" : ""}${level}`,
          }))}
        />
        <Combobox
          id="stream"
          name="stream"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={workStreams.map((workStream) => ({
            value: workStream.id,
            label: workStream.name?.localized ?? "",
          }))}
        />
        <Combobox
          id="poolCandidateStatus"
          name="poolCandidateStatus"
          isMulti
          label={intl.formatMessage(commonMessages.status)}
          options={localizedEnumToOptions(data?.statuses, intl)}
        />
        <Checklist
          idPrefix="operationalRequirement"
          name="operationalRequirement"
          legend={intl.formatMessage(navigationMessages.workPreferences)}
          items={localizedEnumToOptions(data?.operationalRequirements, intl)}
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
            items={localizedEnumToOptions(data?.expiryFilters, intl)}
          />
          <RadioGroup
            idPrefix="suspendedStatus"
            name="suspendedStatus"
            legend={intl.formatMessage({
              defaultMessage: "Candidacy status",
              description: "Label for the candidacy status field",
              id: "NxrKpM",
            })}
            items={localizedEnumToOptions(data?.suspendedFilters, intl)}
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
            label={intl.formatMessage(commonMessages.workingLanguageAbility)}
            options={localizedEnumToOptions(data?.languageAbilities, intl)}
          />
        </div>
        <div data-h2-grid-column="l-tablet(span 2)">
          <Select
            id="community"
            name="community"
            enableNull
            label={intl.formatMessage(adminMessages.community)}
            nullSelection={intl.formatMessage(commonMessages.selectACommunity)}
            options={communities.map(({ id, name }) => ({
              value: id,
              label: getLocalizedName(name, intl),
            }))}
          />
        </div>
        <div data-h2-grid-column="l-tablet(span 3)">
          <Combobox
            id="skills"
            name="skills"
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
