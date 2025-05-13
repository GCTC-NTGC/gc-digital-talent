import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  ReactElement,
} from "react";

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

type GenericHTMLProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

interface ItemProps {
  title: ReactNode;
  Icon?: IconType;
  children: ReactNode;
  color?: Color;
  titleProps?: GenericHTMLProps;
  descriptionProps?: GenericHTMLProps;
}

const Item = ({
  title,
  Icon,
  children,
  titleProps,
  descriptionProps,
  color = "primary",
}: ItemProps) => {
  return (
    <>
      <dt
        data-h2-display="base(list-item)"
        data-h2-font-weight="base(700)"
        {...colorMap[color]}
        {...titleProps}
      >
        {Icon && (
          <Icon
            data-h2-display="base(inline-block)"
            data-h2-width="base(x.75)"
            data-h2-height="base(x.75)"
            data-h2-margin-right="base(x.5)"
            data-h2-vertical-align="base(sub)"
          />
        )}
        <span>{title}</span>
      </dt>
      <dd
        data-h2-display="base(block)"
        {...(Icon
          ? {
              "data-h2-margin": "base(0, 0, x.5, x1)",
            }
          : {
              "data-h2-margin": "base(0, 0, x.5, calc(x.75 + x.15))",
            })}
        {...descriptionProps}
      >
        {children}
      </dd>
    </>
  );
};

type ListItemElement = ReactElement<ItemProps>;

interface RootProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLDListElement>,
    HTMLDListElement
  > {
  children: ListItemElement | ListItemElement[];
}

const Root = ({ children, ...rest }: RootProps) => (
  <dl
    data-h2-margin="base(x1, 0)"
    data-h2-padding-left="base(x1)"
    data-h2-list-style-type="base(disc)"
    data-h2-list-style-position="base(inside)"
    {...rest}
  >
    {children}
  </dl>
);

export default {
  Root,
  Item,
};
