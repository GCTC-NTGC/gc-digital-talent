import { motion } from "motion/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";

import { Separator as SeparatorPrimitive } from "@gc-digital-talent/ui";

import { HTMLSpanProps } from "./types";

const layoutStyles = {
  "data-h2-display": "base(flex)",
  "data-h2-align-items": "base(center)",
  "data-h2-flex-shrink": "base(0)",
  "data-h2-padding": "base(0, x.25)",
};

const iconStyles = {
  "data-h2-height": "base(1rem)",
  "data-h2-width": "base(1rem)",
  "data-h2-color": "base(black.light)",
};

const buttonStyles = {
  "data-h2-background-color": "base(transparent) base:hover(gray.lightest)",
  "data-h2-border":
    "base(2px solid transparent) base:focus-visible(2px solid secondary)",
  "data-h2-display": "base(flex)",
  "data-h2-align-items": "base(center)",
  "data-h2-radius": "base(input)",
  "data-h2-cursor": "base(pointer)",
  "data-h2-outline": "base(none)",
};

type DivHTMLProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "ref"
>;

const Wrapper = forwardRef<HTMLDivElement, DivHTMLProps>(
  (props, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-h2-display="base(flex)"
      data-h2-flex-grow="base(1)"
      data-h2-width="base(100%)"
      data-h2-position="base(relative)"
      data-h2-margin="base(0, 0, x.125, 0)"
      {...props}
    />
  ),
);

const Actions = forwardRef<HTMLDivElement, DivHTMLProps>(
  (props, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-h2-display="base(flex)"
      data-h2-gap="base(0, x.1)"
      data-h2-position="base(absolute)"
      data-h2-location="base(x.25, x.25, x.25, auto)"
      {...props}
    />
  ),
);

const Search = forwardRef<HTMLDivElement, HTMLSpanProps>(
  (props, forwardedRef) => (
    <span
      ref={forwardedRef}
      data-h2-display="base(flex)"
      data-h2-position="base(absolute)"
      data-h2-location="base(x.25, auto, x.25, x.25)"
      {...props}
    >
      <span aria-hidden="true" {...layoutStyles}>
        <MagnifyingGlassIcon {...iconStyles} />
      </span>
    </span>
  ),
);

type HTMLButtonProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "ref"
>;

const Clear = forwardRef<HTMLButtonElement, HTMLButtonProps>(
  (props, forwardedRef) => (
    <button
      type="button"
      ref={forwardedRef}
      {...buttonStyles}
      {...layoutStyles}
      {...props}
    >
      <XMarkIcon {...iconStyles} />
    </button>
  ),
);

type ToggleProps = Omit<HTMLButtonProps, "children"> & {
  isOpen?: boolean;
};

const transition = {
  type: "tween",
  duration: 0.1,
};

const iconVariants = {
  open: {
    rotate: 180,
    transition,
  },
  closed: {
    rotate: 0,
    transition,
  },
};

const AnimatedToggleIcon = motion.create(ChevronDownIcon);

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ isOpen, ...rest }, forwardedRef) => (
    <button
      type="button"
      ref={forwardedRef}
      {...buttonStyles}
      {...layoutStyles}
      {...rest}
    >
      <AnimatedToggleIcon
        animate={isOpen ? "open" : "closed"}
        variants={iconVariants}
        {...iconStyles}
      />
    </button>
  ),
);

const Separator = () => (
  <span data-h2-padding="base(x.25 0)">
    <SeparatorPrimitive orientation="vertical" space="none" decorative />
  </span>
);

export default {
  Wrapper,
  Actions,
  Clear,
  Toggle,
  Separator,
  Search,
};
