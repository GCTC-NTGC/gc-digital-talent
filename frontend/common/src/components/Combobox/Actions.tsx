import React from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import {
  XMarkIcon,
  ChevronDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { useIntl } from "react-intl";

import Separator from "../Separator";

const layoutStyles = {
  "data-h2-display": "base(flex)",
  "data-h2-align-items": "base(center)",
  "data-h2-flex-shrink": "base(0)",
  "data-h2-padding": "base(0, x.25)",
};

const buttonStyles = {
  "data-h2-background-color": "base(transparent) base:hover(dt-gray.lightest)",
  "data-h2-border":
    "base(2px solid transparent) base:focus-visible(2px solid tm-blue)",
  "data-h2-radius": "base(input)",
  "data-h2-cursor": "base(pointer)",
  "data-h2-outline": "base(none)",
};

const iconStyles = {
  "data-h2-height": "base(1em)",
  "data-h2-width": "base(1em)",
  "data-h2-color": "base(dt-gray)",
};

interface ActionsProps {
  showClear?: boolean;
  onClear: () => void;
  clearLabel: string;
  fetching: boolean;
}

const Actions = ({
  showClear,
  onClear,
  clearLabel,
  fetching,
}: ActionsProps) => {
  const intl = useIntl();
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-gap="base(0, x.1)"
      data-h2-position="base(absolute)"
      data-h2-location="base(x.25, x.25, x.25, auto)"
    >
      {fetching && (
        <span aria-live="polite" {...layoutStyles}>
          <span data-h2-visually-hidden="base(invisible)">
            {intl.formatMessage({
              defaultMessage: "Searching...",
              id: "4l+gBD",
              description: "Message to display when a search is being done.",
            })}
          </span>
          <ArrowPathIcon className="animate-spin" {...iconStyles} />
        </span>
      )}
      {showClear && (
        <button
          type="button"
          {...buttonStyles}
          {...layoutStyles}
          onClick={onClear}
          aria-label={clearLabel}
        >
          <XMarkIcon {...iconStyles} />
        </button>
      )}
      <Separator
        data-h2-background-color="base(dt-gray)"
        orientation="vertical"
        decorative
      />
      <ComboboxPrimitive.Button
        data-h2-background-color="base(transparent) base:hover(dt-gray.lightest)"
        data-h2-flex-shrink="base(0)"
        data-h2-padding="base(x.25)"
        data-h2-radius="base(input)"
        data-h2-cursor="base(pointer)"
      >
        <ChevronDownIcon {...iconStyles} />
      </ComboboxPrimitive.Button>
    </div>
  );
};

export default Actions;
