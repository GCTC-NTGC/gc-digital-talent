import { useIntl } from "react-intl";

import { Chip, Chips } from "@gc-digital-talent/ui";

interface Props {
  filters: {
    key: string;
    label: string;
    onRemove: () => void;
  }[];
}

const FilterChips = ({ filters }: Props) => {
  const intl = useIntl();

  if (!filters.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-200">
        {intl.formatMessage({
          defaultMessage: "No filters selected",
          id: "sxFMPR",
          description: "null state for filter list",
        })}
      </div>
    );
  }

  return (
    <Chips>
      {filters
        .toSorted((f1, f2) => f1.label.localeCompare(f2.label))
        .map((f) => (
          <Chip key={f.key} onDismiss={f.onRemove}>
            {f.label}
          </Chip>
        ))}
    </Chips>
  );
};

export default FilterChips;
