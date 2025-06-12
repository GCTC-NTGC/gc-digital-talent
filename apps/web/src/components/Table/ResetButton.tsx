import { useIntl } from "react-intl";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { HTMLProps } from "react";

const ResetButton = (props: Omit<HTMLProps<HTMLButtonElement>, "children">) => {
  const intl = useIntl();
  return (
    <button
      className="flex shrink-0 cursor-pointer items-center rounded bg-transparent p-1.5 text-gray outline-none hover:bg-gray-100 hover:text-black focus-visible:bg-focus focus-visible:text-black dark:bg-gray-700 dark:hover:text-white"
      aria-label={intl.formatMessage({
        defaultMessage: "Reset search",
        id: "Yh/4po",
        description: "Button text to reset search field on tables",
      })}
      {...props}
      type="button"
    >
      <XMarkIcon className="size-4" />
    </button>
  );
};

export default ResetButton;
