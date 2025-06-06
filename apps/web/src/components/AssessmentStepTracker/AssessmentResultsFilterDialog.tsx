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
      modifyFilterCount={-3}
    >
      <div className="grid gap-6 xs:grid-cols-2 sm:grid-cols-3">
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
        <div className="sm:col-span-2">
          <Combobox
            id="operationalRequirements"
            name="operationalRequirements"
            isMulti
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
          label={intl.formatMessage(commonMessages.workingLanguageAbility)}
          options={localizedEnumToOptions(data?.languageAbilities, intl)}
        />
        <div className="sm:col-span-2">
          <Combobox
            id="equity"
            name="equity"
            label={intl.formatMessage(commonMessages.employmentEquity)}
            isMulti
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
        </div>
        <div className="self-center">
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
      </div>
    </FilterDialog>
  );
};

export default AssessmentResultsFilterDialog;
