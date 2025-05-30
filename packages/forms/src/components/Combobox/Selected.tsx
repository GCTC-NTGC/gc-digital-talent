import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";

import { useInputStylesDeprecated } from "../../hooks/useInputStyles";

type HTMLDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = (props: HTMLDivProps) => {
  const baseStyles = useInputStylesDeprecated();
  return (
    <div
      {...baseStyles}
      data-h2-background-color="base(foreground)"
      data-h2-border-color="base(gray) base:focus-visible(focus)"
      data-h2-border-top-color="base(transparent)"
      data-h2-radius="base(0 0 rounded rounded)"
      data-h2-margin-top="base(-x.375)"
      {...props}
    />
  );
};

const Items = (props: HTMLDivProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.125)"
    data-h2-margin-top="base(x.5)"
    {...props}
  />
);

type ItemProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
  "ref"
>;

const Item = forwardRef<HTMLSpanElement, ItemProps>(
  ({ children, ...rest }, forwardedRef) => (
    <span
      ref={forwardedRef}
      data-h2-align-items="base(center)"
      data-h2-background-color="base(primary.lightest) base:hover(primary.light) base:focus-visible(focus)"
      data-h2-color="base(primary.darker) base:hover(primary.darkest) base:focus-visible(black)"
      data-h2-cursor="base(pointer)"
      data-h2-display="base(flex)"
      data-h2-font-size="base(caption)"
      data-h2-max-width="base(100%)"
      data-h2-padding="base(x.125 x.25)"
      data-h2-outline="base(none)"
      data-h2-radius="base(s)"
      data-h2-text-decoration="base(underline) base:hover(none)"
      {...rest}
    >
      <span data-h2-flex-grow="base(1)" data-h2-width="base(100%)">
        {children}
      </span>
      <XMarkIcon
        data-h2-height="base(1rem)"
        data-h2-width="base(1rem)"
        data-h2-flex-shrink="base(0)"
        data-h2-vertical-align="base(top)"
      />
    </span>
  ),
);

export default {
  Wrapper,
  Items,
  Item,
};
