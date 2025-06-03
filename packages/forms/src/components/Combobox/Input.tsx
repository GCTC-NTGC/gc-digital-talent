import { motion } from "motion/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";
import { tv } from "tailwind-variants";

import { Separator as SeparatorPrimitive } from "@gc-digital-talent/ui";

import { HTMLSpanProps } from "./types";

const layout = tv({
  base: "flex shrink-0 items-center px-1.5",
});

const btn = tv({
  extend: layout,
  base: "cursor-pointer rounded border-2 border-transparent bg-transparent outline-none hover:bg-gray-100 focus-visible:border-primary dark:hover:bg-gray-700",
});

const icon = tv({
  base: "size-4 text-gray",
});

type DivHTMLProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "ref"
>;

const Wrapper = forwardRef<HTMLDivElement, DivHTMLProps>(
  (props, forwardedRef) => (
    <div
      ref={forwardedRef}
      className="relative mb-0.5 flex w-full grow"
      {...props}
    />
  ),
);

const Actions = forwardRef<HTMLDivElement, DivHTMLProps>(
  (props, forwardedRef) => (
    <div
      ref={forwardedRef}
      className="absolute inset-1 left-auto flex gap-x-0.5"
      {...props}
    />
  ),
);

const Search = forwardRef<HTMLDivElement, HTMLSpanProps>(
  (props, forwardedRef) => (
    <span
      ref={forwardedRef}
      className="absolute inset-1 right-auto flex"
      {...props}
    >
      <span aria-hidden="true" className={layout()}>
        <MagnifyingGlassIcon className={icon()} />
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
    <button type="button" ref={forwardedRef} className={btn()} {...props}>
      <XMarkIcon className={icon()} />
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
    <button type="button" ref={forwardedRef} className={btn()} {...rest}>
      <AnimatedToggleIcon
        animate={isOpen ? "open" : "closed"}
        variants={iconVariants}
        className={icon()}
      />
    </button>
  ),
);

const Separator = () => (
  <span className="py-1.5">
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
