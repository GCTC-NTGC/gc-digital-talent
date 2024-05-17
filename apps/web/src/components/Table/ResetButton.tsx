import { useIntl } from "react-intl";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { HTMLProps } from "react";

const ResetButton = (props: Omit<HTMLProps<HTMLButtonElement>, "children">) => {
  const intl = useIntl();
  return (
    <button
      data-h2-background-color="base(transparent) base:hover(gray.lightest) base:focus-visible(focus)"
      data-h2-color="base(gray) base:hover(black) base:focus-visible(black)"
      className="flex shrink-0 cursor-pointer items-center rounded p-1.5  outline-none"
      aria-label={intl.formatMessage({
        defaultMessage: "Reset search",
        id: "Yh/4po",
        description: "Button text to reset search field on tables",
      })}
      {...props}
      type="button"
    >
      <XMarkIcon className="h-4 w-4" />
    </button>
  );
};

export default ResetButton;
