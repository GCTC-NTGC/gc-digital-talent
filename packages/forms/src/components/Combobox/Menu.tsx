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

import { formMessages, uiMessages } from "@gc-digital-talent/i18n";

import { useInputStylesDeprecated } from "../../hooks/useInputStyles";
import { HTMLSpanProps } from "./types";

type WrapperProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = (props: WrapperProps) => {
  const baseStyles = useInputStylesDeprecated();
  return (
    <div
      {...baseStyles}
      data-h2-background-color="base(foreground)"
      data-h2-border-color="base(gray) base:focus-visible(focus)"
      data-h2-shadow="base(l)"
      data-h2-location="base(100%, 0, auto, 0)"
      data-h2-margin-top="base(x.25)"
      data-h2-padding="base(x.25 0)"
      data-h2-position="base(absolute)"
      data-h2-radius="base(rounded)"
      data-h2-z-index="base(99)"
      {...props}
    />
  );
};

const Message = forwardRef<HTMLSpanElement, HTMLSpanProps>(
  (props, forwardedRef) => (
    <span
      ref={forwardedRef}
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-color="base(black.light) base:dark(gray.light)"
      data-h2-gap="base(0 x.25)"
      data-h2-padding="base(x.25, x.5)"
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
          data-h2-width="base(1rem)"
          data-h2-height="base(1rem)"
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

type ItemProps = HTMLLiProps & {
  active?: boolean;
  selected?: boolean;
};

const Item = forwardRef<HTMLLIElement, ItemProps>(
  ({ active, selected, children, ...rest }, forwardedRef) => (
    <li
      ref={forwardedRef}
      role="option"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(0 x.25)"
      data-h2-padding="base(x.25, x.5)"
      // Selected + Active
      {...(selected &&
        active && {
          "data-h2-color": "base(black)",
        })}
      {...(selected &&
        !active && {
          "data-h2-color": "base(primary.darker) base:dark(primary.lightest)",
        })}
      {...(selected && {
        "data-h2-font-weight": "base(700)",
      })}
      {...(active && {
        "data-h2-background-color": "base(focus)",
      })}
      {...omit(rest, "aria-selected")}
      aria-selected={selected ? "true" : "false"}
    >
      {selected && (
        <CheckIcon data-h2-height="base(1rem)" data-h2-width="base(1rem)" />
      )}
      <span>{children}</span>
    </li>
  ),
);

type ListProps = DetailedHTMLProps<
  HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

const List = forwardRef<HTMLUListElement, ListProps>((props, forwardedRef) => (
  <ul
    ref={forwardedRef}
    data-h2-list-style="base(none)"
    data-h2-max-height="base(20rem)"
    data-h2-margin="base(0)"
    data-h2-overflow="base(visible auto)"
    data-h2-padding="base(x.125 0)"
    {...props}
  />
));

interface EmptyProps {
  fetching?: boolean;
}

const Empty = ({ fetching }: EmptyProps) => {
  const intl = useIntl();

  return (
    <p
      data-h2-cursor="base(pointer)"
      data-h2-radius="base(input)"
      data-h2-padding="base(x.25, x.5)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(0, x.25)"
    >
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
