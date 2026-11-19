import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import {
  Checklist,
  Input,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { ENUM_SORT_ORDER, narrowEnumType } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import FilterDialog from "./FilterDialog";

const AdvancedFiltersDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment AdvancedFiltersDialogOptions on Query {
    poolPublishedRangeEnums: localizedEnumOptions(
      enumName: "PoolPublishedRange"
    ) {
      ... on LocalizedPoolPublishedRange {
        value
        label {
          localized
        }
      }
    }
  }
`);

interface FormValues {
  advertisementTimings: string[];
  processNumber: string | null;
}

interface Props {
  optionsQuery: FragmentType<typeof AdvancedFiltersDialogOptions_Fragment>;
  children: ReactNode;
}

const AdvancedFiltersDialog = ({ optionsQuery, children }: Props) => {
  const intl = useIntl();
  const { poolPublishedRangeEnums } = getFragment(
    AdvancedFiltersDialogOptions_Fragment,
    optionsQuery,
  );
  const { getFilterValue, getFilterValues, setFilters } =
    useBrowseJobsSearchParams();

  const advertisementTimingOptions = localizedEnumToOptions(
    narrowEnumType(unpackMaybes(poolPublishedRangeEnums), "PoolPublishedRange"),
    intl,
    ENUM_SORT_ORDER.POOL_PUBLISHED_RANGE,
  );

  return (
    <FilterDialog<FormValues>
      title={intl.formatMessage({
        defaultMessage: "Advanced filters",
        id: "eozWFc",
        description: "Title for the additional filters",
      })}
      subtitle={intl.formatMessage({
        defaultMessage:
          "Filter jobs by equity groups, employment conditions and more.",
        id: "BH2C9x",
        description: "Subtitle for advanced filters dialog",
      })}
      trigger={children}
      getFormValues={() => ({
        advertisementTimings: getFilterValues("advertisementTimings"),
        processNumber: getFilterValue("processNumber"),
      })}
      onSave={(formValues) =>
        setFilters({
          advertisementTimings: formValues.advertisementTimings,
          processNumber: formValues.processNumber,
        })
      }
      onClear={() =>
        setFilters({ advertisementTimings: null, processNumber: null })
      }
    >
      <Checklist
        idPrefix={"advertisementTimings"}
        legend={intl.formatMessage({
          defaultMessage: "Timing of advertisement",
          id: "3f0YY3",
          description: "Title for a timing of advertisement checklist",
        })}
        items={advertisementTimingOptions}
        name={"advertisementTimings"}
      />
      <Input
        type="text"
        id="processNumber"
        label={intl.formatMessage({
          defaultMessage: "Reference or selection process number",
          id: "m8vrqy",
          description: "Label for a process number input",
        })}
        name="processNumber"
      />
    </FilterDialog>
  );
};

export default AdvancedFiltersDialog;
