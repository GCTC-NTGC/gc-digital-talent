import React from "react";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import useCommonInputStyles from "../../hooks/useCommonInputStyles";

type WrapperProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = (props: WrapperProps) => {
  const baseStyles = useCommonInputStyles();
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

type HTMLLiProps = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

type ItemProps = HTMLLiProps & {
  active?: boolean;
  selected?: boolean;
};

const Item = React.forwardRef<HTMLLIElement, ItemProps>(
  ({ active, selected, children, ...rest }, forwardedRef) => (
    <li
      ref={forwardedRef}
      data-h2-display="base(flex)"
      data-h2-gap="base(0 x.25)"
      data-h2-padding="base(x.25, x.125)"
      // Selected + Active
      {...(selected &&
        active && {
          "data-h2-color": "base(black)",
        })}
      {...(selected &&
        !active && {
          "data-h2-color": "base(primary.darker)",
        })}
      {...(selected && {
        "data-h2-font-weight": "base(700)",
      })}
      {...(active && {
        "data-h2-background-color": "base(focus)",
      })}
      {...rest}
    >
      {selected && <CheckIcon />}
      <span>{children}</span>
    </li>
  ),
);

type ListProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

const List = React.forwardRef<HTMLUListElement, ListProps>(
  (props, forwardedRef) => (
    <ul
      ref={forwardedRef}
      data-h2-list-style="base(none)"
      data-h2-max-height="base(20rem)"
      data-h2-margin="base(0)"
      data-h2-overflow="base(visible scroll)"
      data-h2-padding="base(x.125 0)"
      {...props}
    />
  ),
);

export default {
  Wrapper,
  List,
  Item,
};
