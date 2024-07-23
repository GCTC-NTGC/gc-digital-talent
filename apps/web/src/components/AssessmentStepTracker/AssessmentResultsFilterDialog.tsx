import { MessageDescriptor, useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Checkbox,
  Combobox,
  localizedEnumToOptions,
  Select,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  getEmploymentEquityGroup,
  getLocalizedName,
  navigationMessages,
  sortPriorityWeight,
} from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";

import { FormValues } from "./types";

const AssessmentResultsFilterOptions_Query = graphql(/* GraphQL */ `
  query AssessmentResultsFilterOptions {
    skills {
      id
      name {
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
    priorityWeights: localizedEnumStrings(enumName: "PriorityWeight") {
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
    languageAbilities: localizedEnumStrings(enumName: "LanguageAbility") {
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
  }
`);

type AssessmentResultsFilterDialogProps = CommonFilterDialogProps<FormValues>;

const AssessmentResultsFilterDialog = ({
  initialValues,
  resetValues,
  onSubmit,
}: AssessmentResultsFilterDialogProps) => {
  const intl = useIntl();
  const [{ data, fetching: optionsFetching }] = useQuery({
    query: AssessmentResultsFilterOptions_Query,
  });

  const skills = unpackMaybes(data?.skills);

  const equityOption = (value: string, message: MessageDescriptor) => ({
    value,
    label: intl.formatMessage(message),
  });
  return (
    <FilterDialog<FormValues>
      {...{ onSubmit, resetValues }}
      options={{ defaultValues: initialValues }}
    >
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) l-tablet(repeat(3, 1fr))"
      >
        <Combobox
          id="workRegion"
          name="workRegion"
          isMulti
          fetching={optionsFetching}
          label={intl.formatMessage(navigationMessages.workLocation)}
          options={localizedEnumToOptions(data?.workRegions, intl)}
        />
        <Combobox
          id="priorityWeight"
          name="priorityWeight"
          isMulti
          fetching={optionsFetching}
          label={intl.formatMessage(adminMessages.category)}
          options={localizedEnumToOptions(
            sortPriorityWeight(data?.priorityWeights),
            intl,
          )}
        />
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
        <div data-h2-grid-column="l-tablet(span 2)">
          <Select
            id="operationalRequirement"
            name="operationalRequirement"
            enableNull
            nullSelection={intl.formatMessage(formMessages.defaultPlaceholder)}
            label={intl.formatMessage(navigationMessages.workPreferences)}
            options={localizedEnumToOptions(
              data?.operationalRequirements,
              intl,
            )}
          />
        </div>
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
          options={localizedEnumToOptions(data?.languageAbilities, intl)}
        />
        <Select
          id="equity"
          name="equity"
          enableNull
          nullSelection=""
          label={intl.formatMessage(commonMessages.employmentEquity)}
          options={[
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
        <div
          data-h2-grid-column="l-tablet(span 2)"
          data-h2-align-self="base(center)"
        >
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
        </div>
        {/* <div
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
        </div> */}
      </div>
    </FilterDialog>
  );
};

export default AssessmentResultsFilterDialog;
