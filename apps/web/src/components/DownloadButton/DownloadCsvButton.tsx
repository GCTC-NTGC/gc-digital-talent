import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";

import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";

import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";
import { CsvType } from "../PoolCandidatesTable/types";

interface DownloadCsvButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClick: (
    option: { label: string; value: CsvType },
    withROD?: boolean,
  ) => void;
  buttonText: string;
  options: { label: string; value: CsvType }[];
  description: string;
}

const DownloadCsvButton = ({
  inTable,
  isDownloading,
  onClick,
  disabled,
  buttonText,
  options,
}: DownloadCsvButtonProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          disabled={disabled}
          utilityIcon={ChevronDownIcon}
          {...(isDownloading && {
            icon: SpinnerIcon,
          })}
          {...(inTable
            ? {
                ...actionButtonStyles,
                "data-h2-font-weight": "base(400)",
                "data-h2-margin-top": "base(-2px)",
              }
            : {
                color: "secondary",
              })}
        >
          {buttonText}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        {options.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            disabled={disabled}
            onSelect={() => onClick(option, false)}
          >
            {option.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DownloadCsvButton;
