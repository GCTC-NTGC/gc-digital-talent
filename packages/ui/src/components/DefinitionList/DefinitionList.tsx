import React from "react";

import { IconType } from "../../types";

export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-color": "base(primary.dark) base:children[svg](primary.dark)",
  },
  secondary: {
    "data-h2-color":
      "base(secondary.darker) base:children[svg](secondary.darker)",
  },
  tertiary: {
    "data-h2-color": "base(tertiary.dark) base:children[svg](tertiary.dark)",
  },
  quaternary: {
    "data-h2-color":
      "base(quaternary.darker) base:children[svg](quaternary.darker)",
  },
  quinary: {
    "data-h2-color": "base(quinary.dark) base:children[svg](quinary.dark)",
  },
};

type GenericHTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

export interface ItemProps {
  title: React.ReactNode;
  Icon?: IconType;
  children: React.ReactNode;
  color?: Color;
  titleProps?: GenericHTMLProps;
  definitionProps?: GenericHTMLProps;
}

const Item = ({
  title,
  Icon,
  children,
  titleProps,
  definitionProps,
  color = "primary",
}: ItemProps) => {
  return (
    <>
      <dt
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0, x.25)"
        data-h2-font-weight="base(700)"
        data-h2-font-size="base(1.2rem)"
        data-h2-line-height="base(1)"
        {...colorMap[color]}
        {...titleProps}
      >
        {Icon && <Icon data-h2-width="base(1em)" data-h2-height="base(1em)" />}
        <span>{title}</span>
      </dt>
      <dd
        {...(Icon
          ? {
              "data-h2-margin": "base(0, 0, x.5, calc(1.2rem + x.25))",
            }
          : {
              "data-h2-margin": "base(0, 0, x.5, 0)",
            })}
        {...definitionProps}
      >
        {children}
      </dd>
    </>
  );
};

export type ListItemElement = React.ReactElement<ItemProps>;

export interface RootProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDListElement>,
    HTMLDListElement
  > {
  children: ListItemElement | Array<ListItemElement>;
}

const Root = ({ children, ...rest }: RootProps) => (
  <dl data-h2-margin="base(x1, 0)" {...rest}>
    {children}
  </dl>
);

export default {
  Root,
  Item,
};
