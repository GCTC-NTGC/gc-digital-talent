import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import {
  Checklist,
  Input,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  sortPoolPublishedRange,
  type MaybeLocalizedEnums,
} from "@gc-digital-talent/i18n";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import FilterDialog from "./FilterDialog";

interface FormValues {
  advertisementTimings: string[];
  processNumber: string | null;
}

interface Props {
  poolPublishedRangeEnums: MaybeLocalizedEnums;
  children: ReactNode;
}

const AdvancedFiltersDialog = ({
  poolPublishedRangeEnums,
  children,
}: Props) => {
  const intl = useIntl();
  const { getFilterValue, getFilterValues, setFilters } =
    useBrowseJobsSearchParams();

  const advertisementTimingOptions = localizedEnumToOptions(
    sortPoolPublishedRange(poolPublishedRangeEnums),
    intl,
  );

  return (
    <FilterDialog<FormValues>
      title={intl.formatMessage({
        defaultMessage: "Advanced filters",
        id: "+D4k6z",
        description: "Title for advanced filters dialog",
      })}
      subtitle={intl.formatMessage({
        defaultMessage:
          "Filter jobs by equity groups, employment conditions and more.",
        id: "BH2C9x",
        description: "Subtitle for advanced filters dialog",
      })}
      trigger={children}
      getFormValues={() => ({
        advertisementTimings: getFilterValues("advertisementTiming"),
        processNumber: getFilterValue("processNumber"),
      })}
      onSave={(formValues) =>
        setFilters({
          advertisementTiming: formValues.advertisementTimings,
          processNumber: formValues.processNumber,
        })
      }
      onClear={() =>
        setFilters({ advertisementTiming: null, processNumber: null })
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
