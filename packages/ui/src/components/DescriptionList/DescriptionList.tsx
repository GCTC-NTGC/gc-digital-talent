import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  ReactElement,
} from "react";
import { tv, VariantProps } from "tailwind-variants";
import { extend } from "lodash";

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

const item = tv({
  slots: {
    term: "list-item font-bold",
    icon: "mr-3 inline-block size-5 align-sub",
    description: "mb-3 ml-6 block",
  },
  variants: {
    color: {
      primary: {
        term: "text-primary-600 dark:text-primary-200",
      },
      secondary: {
        term: "text-secondary-600 dark:text-secondary-300",
      },
      success: {
        term: "text-success-600 dark:text-success-200",
      },
      warning: {
        term: "text-warning-600 dark:text-warning-200",
      },
      error: {
        term: "text-error-600 dark:text-error-200",
      },
    },
  },
});

type ItemVariants = VariantProps<typeof item>;

type GenericHTMLProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

interface ItemProps extends Omit<ItemVariants, "hasIcon"> {
  title: ReactNode;
  icon?: IconType;
  children: ReactNode;
  titleProps?: GenericHTMLProps;
  descriptionProps?: GenericHTMLProps;
}

const Item = ({
  title,
  icon,
  children,
  titleProps,
  descriptionProps,
  color = "primary",
}: ItemProps) => {
  const { term, icon: iconStyles, description } = item({ color });
  const Icon = icon;

  return (
    <>
      <dt {...titleProps} className={term({ class: titleProps?.className })}>
        {Icon && <Icon className={iconStyles()} />}
        <span>{title}</span>
      </dt>
      <dd
        {...descriptionProps}
        className={description({ class: descriptionProps?.className })}
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
  <dl className="my-6 list-inside list-disc pl-6" {...rest}>
    {children}
  </dl>
);

export default {
  Root,
  Item,
};
