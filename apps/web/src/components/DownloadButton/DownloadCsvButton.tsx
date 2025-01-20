import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useIntl } from "react-intl";
import { Button, DropdownMenu } from "@gc-digital-talent/ui";
import { actionButtonStyles } from "~/components/Table/ResponsiveTable/RowSelection";
import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";
import { familiesAccessor } from "~/pages/Skills/components/tableHelpers";

interface DownloadCsvButtonProps {
  inTable?: boolean;
  disabled?: boolean;
  isDownloading?: boolean;
  onClick: (
    option: { label: string; value: string },
    withROD?: boolean,
  ) => void;
  buttonText: string;
  options: { label: string; value: string }[];
  description: string;
}

const DownloadCsvButton = ({
  inTable,
  isDownloading,
  onClick,
  disabled,
  buttonText,
  options,
  description,
}: DownloadCsvButtonProps) => {
  const intl = useIntl();

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
          {intl.formatMessage({
            defaultMessage: buttonText,
            id: "downloadButton",
            description: description,
          })}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" collisionPadding={2}>
        {options.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            disabled={disabled}
            onSelect={() => onClick(option,false)}
          >
            {intl.formatMessage({
              defaultMessage: option.label,
              id: option.value,
              description: option.label,
            })}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DownloadCsvButton;
