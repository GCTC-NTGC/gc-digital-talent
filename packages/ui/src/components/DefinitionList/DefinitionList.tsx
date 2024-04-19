import React from "react";

import { IconType } from "../../types";

type Color = "primary" | "secondary" | "tertiary" | "quaternary" | "quinary";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-color": "base(primary.darker) base:children[svg](primary.darker)",
  },
  secondary: {
    "data-h2-color":
      "base(secondary.darker) base:children[svg](secondary.darker)",
  },
  tertiary: {
    "data-h2-color":
      "base(tertiary.darker) base:children[svg](tertiary.darker)",
  },
  quaternary: {
    "data-h2-color":
      "base(quaternary.darker) base:children[svg](quaternary.darker)",
  },
  quinary: {
    "data-h2-color": "base(quinary.darker) base:children[svg](quinary.darker)",
  },
};

type GenericHTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

interface ItemProps {
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
        className="flex"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0, x.5)"
        data-h2-font-weight="base(700)"
        {...colorMap[color]}
        {...titleProps}
      >
        {Icon && (
          <Icon data-h2-width="base(x.75)" data-h2-height="base(x.75)" />
        )}
        <span>{title}</span>
      </dt>
      <dd
        data-h2-display="base(block)"
        {...(Icon
          ? {
              "data-h2-margin": "base(0, 0, x.5, calc(x.75 + x.5))",
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

type ListItemElement = React.ReactElement<ItemProps>;

interface RootProps
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
