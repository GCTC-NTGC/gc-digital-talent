import * as React from "react";
import { useIntl } from "react-intl";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";

const ResetButton = (
  props: Omit<React.HTMLProps<HTMLButtonElement>, "children">,
) => {
  const intl = useIntl();
  return (
    <button
      data-h2-background-color="base(transparent) base:hover(gray.lightest) base:focus-visible(focus)"
      data-h2-color="base(gray) base:hover(black) base:focus-visible(black)"
      data-h2-radius="base(input)"
      data-h2-cursor="base(pointer)"
      data-h2-outline="base(none)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-flex-shrink="base(0)"
      data-h2-padding="base(x.25)"
      aria-label={intl.formatMessage({
        defaultMessage: "Reset search",
        id: "Yh/4po",
        description: "Button text to reset search field on tables",
      })}
      {...props}
      type="button"
    >
      <XMarkIcon data-h2-height="base(1rem)" data-h2-width="base(1rem)" />
    </button>
  );
};

export default ResetButton;
