import { ReactElement, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

import { IconType } from "../../types";
import Link, { LinkProps } from "../Link";
import { HeadingLevel } from "../Heading";

interface ItemProps {
  children?: ReactNode;
}

const Item = ({ children }: ItemProps) => {
  return (
    <div className="p-6 not-last:border-b not-last:border-b-gray-100 xs:px-9 dark:not-last:border-b-gray-500">
      {children}
    </div>
  );
};

const heading = tv({
  slots: {
    base: "my-0 grow-2 text-center text-2xl text-balance xs:text-left lg:text-3xl",
    icon: "hidden size-7 shrink-0 stroke-[1.6] xs:inline-block",
  },
  variants: {
    hasIcon: {
      true: { base: "xs:flex xs:items-start xs:gap-x-3" },
    },
  },
});

interface TaskCardHeadingProps {
  icon?: IconType;
  headingAs?: HeadingLevel;
  children?: ReactNode;
}

// a custom heading that is somewhat different from our standard heading component
const TaskCardHeading = ({
  icon,
  headingAs = "h3",
  children,
}: TaskCardHeadingProps) => {
  const Icon = icon;
  const CustomHeading = headingAs;
  const { base, icon: iconStyles } = heading({ hasIcon: !!icon });
  return (
    <CustomHeading className={base()}>
      {Icon ? <Icon className={iconStyles()} /> : null}
      <span>{children}</span>
    </CustomHeading>
  );
};

const root = tv({
  slots: {
    base: "rounded bg-white shadow-xl dark:bg-gray-600",
    header:
      "flex flex-col items-center gap-6 rounded-t border-b p-6 xs:flex-row xs:gap-12 xs:px-9",
  },
  variants: {
    headingColor: {
      primary: {
        header:
          "border-b-primary-700 bg-primary-100 text-primary-700 dark:border-b-primary-100 dark:bg-primary-700 dark:text-primary-100",
      },
      secondary: {
        header:
          "border-b-secondary-700 bg-secondary-100 text-secondary-700 dark:border-b-secondary-100 dark:bg-secondary-700 dark:text-secondary-100",
      },
      success: {
        header:
          "border-b-success-700 bg-success-100 text-success-700 dark:border-b-success-100 dark:bg-success-700 dark:text-success-100",
      },
      warning: {
        header:
          "border-b-warning-700 bg-warning-100 text-warning-700 dark:border-b-warning-100 dark:bg-warning-700 dark:text-warning-100",
      },
      error: {
        header:
          "border-b-error-700 bg-error-100 text-error-700 dark:border-b-error-100 dark:bg-error-700 dark:text-error-100",
      },
    },
  },
});

type RootVariants = VariantProps<typeof root>;

export interface RootProps extends RootVariants {
  icon?: IconType;
  title: ReactNode;
  link?: {
    label: string;
    href: LinkProps["href"];
  };
  headingAs?: HeadingLevel;
  children?: ReactElement<ItemProps> | ReactElement<ItemProps>[]; // Restricts children to only expected items;
}

const Root = ({
  icon,
  title,
  headingColor = "primary",
  link,
  headingAs,
  children,
}: RootProps) => {
  const { base, header } = root({ headingColor });
  return (
    <div className={base()}>
      <div className={header()}>
        <TaskCardHeading icon={icon} headingAs={headingAs}>
          {title}
        </TaskCardHeading>
        {link ? (
          <Link color={headingColor} href={link.href} className="text-nowrap">
            {link.label}
          </Link>
        ) : null}
      </div>
      {/* content */}
      <div>{children}</div>
    </div>
  );
};

const TaskCard = {
  Root,
  Item,
};

export default TaskCard;
