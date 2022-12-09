import React from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Separator from "../Separator";

const buttonStyles = {
  "data-h2-background-color": "base(transparent) base:hover(dt-gray.lightest)",
  "data-h2-border":
    "base(all, 2px, solid, transparent) base:focus-visible(all, 2px, solid, tm-blue)",
  "data-h2-display": "base(flex)",
  "data-h2-align-items": "base(center)",
  "data-h2-flex-shrink": "base(0)",
  "data-h2-padding": "base(0, x.25)",
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
}

const Actions = ({ showClear, onClear, clearLabel }: ActionsProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-gap="base(x.1, 0)"
    data-h2-position="base(absolute)"
    data-h2-offset="base(x.25, x.25, x.25, auto)"
  >
    {showClear && (
      <button
        type="button"
        {...buttonStyles}
        onClick={onClear}
        aria-label={clearLabel}
      >
        <XMarkIcon {...iconStyles} />
      </button>
    )}
    <Separator
      data-h2-background-color="base(lightest.dt-gray)"
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

export default Actions;
