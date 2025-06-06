import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import { motion, useReducedMotion } from "motion/react";
import omit from "lodash/omit";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  forwardRef,
  LiHTMLAttributes,
} from "react";
import { tv, VariantProps } from "tailwind-variants";

import { formMessages, uiMessages } from "@gc-digital-talent/i18n";

import { HTMLSpanProps } from "./types";
import { inputStyles } from "../../styles";

const wrapper = tv({
  extend: inputStyles,
  base: "absolute inset-x-0 top-full bottom-auto z-[99] mt-1.5 px-0 shadow-lg",
  variants: {
    isOpen: {
      true: "",
      false: "sr-only",
    },
  },
});

type WrapperVariants = VariantProps<typeof wrapper>;

interface WrapperProps
  extends WrapperVariants,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Wrapper = ({ className, isOpen, ...rest }: WrapperProps) => {
  return <div className={wrapper({ isOpen, class: className })} {...rest} />;
};

const Message = forwardRef<HTMLSpanElement, HTMLSpanProps>(
  (props, forwardedRef) => (
    <span
      ref={forwardedRef}
      className="flex items-center gap-x-1.5 px-3 py-1.5 text-gray-600 dark:text-gray-100"
      {...props}
    />
  ),
);

type AvailableProps = HTMLSpanProps & {
  count: number;
  total: number;
};

const Available = ({ count, total, ...rest }: AvailableProps) => {
  const intl = useIntl();

  return (
    <Message {...rest}>
      <span>
        {count > 0 && count !== total
          ? intl.formatMessage(formMessages.subsetAvailableCombobox, {
              total,
              count,
            })
          : intl.formatMessage(formMessages.allAvailableCombobox, {
              total,
            })}
      </span>
    </Message>
  );
};

const AnimatedFetchingIcon = motion.create(ArrowPathIcon);

const Fetching = forwardRef<HTMLSpanElement, HTMLSpanProps>(
  (props, forwardedRef) => {
    const intl = useIntl();
    const shouldReduceMotion = useReducedMotion();
    return (
      <Message ref={forwardedRef} {...props}>
        <AnimatedFetchingIcon
          className="size-4"
          {...(!shouldReduceMotion && {
            animate: {
              rotate: [0, 360],
            },
            transition: {
              ease: "linear",
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0,
            },
          })}
        />
        <span>{intl.formatMessage(uiMessages.loadingResults)}</span>
      </Message>
    );
  },
);

type HTMLLiProps = DetailedHTMLProps<
  LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

const item = tv({
  base: "flex items-center gap-x-1.5 px-3 py-1.5",
  variants: {
    selected: { true: "font-bold", false: "" },
    active: { true: "bg-focus text-black", false: "" },
  },
  compoundVariants: [
    {
      selected: true,
      active: false,
      class: "text-secondary-600 dark:text-secondary-200",
    },
  ],
});

type ItemProps = HTMLLiProps & {
  active?: boolean;
  selected?: boolean;
};

const Item = forwardRef<HTMLLIElement, ItemProps>(
  ({ active, selected, children, ...rest }, forwardedRef) => (
    <li
      ref={forwardedRef}
      role="option"
      className={item({ active, selected })}
      {...omit(rest, "aria-selected")}
      aria-selected={selected ? "true" : "false"}
    >
      {selected && <CheckIcon className="size-4" />}
      <span>{children}</span>
    </li>
  ),
);

const list = tv({
  base: "m-0 max-h-80 list-none overflow-x-visible overflow-y-auto rounded py-0.5",
  variants: {
    isOpen: {
      true: "",
      false: "hidden",
    },
  },
});

type ListVariants = VariantProps<typeof list>;

interface ListProps
  extends ListVariants,
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {}

const List = forwardRef<HTMLUListElement, ListProps>(
  ({ className, isOpen, ...rest }, forwardedRef) => (
    <ul
      ref={forwardedRef}
      className={list({ isOpen, class: className })}
      {...rest}
    />
  ),
);

interface EmptyProps {
  fetching?: boolean;
}

const Empty = ({ fetching }: EmptyProps) => {
  const intl = useIntl();

  return (
    <p className="flex cursor-pointer items-center gap-x-3 rounded px-3 py-1.5">
      {fetching ? (
        <Fetching />
      ) : (
        intl.formatMessage(formMessages.noResultsCombobox)
      )}
    </p>
  );
};

export default {
  Wrapper,
  List,
  Item,
  Empty,
  Available,
};
