import { useIntl } from "react-intl";

import { getLocale } from "@gc-digital-talent/i18n";
import { Chip, Chips, wrapQuotes } from "@gc-digital-talent/ui";

interface Props {
  filters: {
    key: string;
    label: string;
    onRemove: () => void;
  }[];
  wrapChipLabelsInQuotes?: boolean;
  enableNullMessage?: boolean;
}

const FilterChips = ({
  filters,
  wrapChipLabelsInQuotes = false,
  enableNullMessage = true,
}: Props) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  if (!filters.length) {
    return enableNullMessage ? (
      <div className="mt-1.5 text-sm text-gray-500 dark:text-gray-200">
        {intl.formatMessage({
          defaultMessage: "No filters selected",
          id: "sxFMPR",
          description: "null state for filter list",
        })}
      </div>
    ) : null;
  }

  return (
    <Chips className="mt-1.5">
      {filters
        .toSorted((f1, f2) => f1.label.localeCompare(f2.label))
        .map((f) => (
          <Chip key={f.key} onDismiss={f.onRemove}>
            {wrapChipLabelsInQuotes ? wrapQuotes(f.label, locale) : f.label}
          </Chip>
        ))}
    </Chips>
  );
};

export default FilterChips;
