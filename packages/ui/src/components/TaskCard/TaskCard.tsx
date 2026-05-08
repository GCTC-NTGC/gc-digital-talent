import type { ReactElement, ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";

import type { IconType } from "../../types";
import type { LinkProps } from "../Link";
import Link from "../Link";
import type { HeadingLevel } from "../Heading";
import type { ButtonProps } from "../Button";
import type { BaseButtonLinkProps } from "../../utils/btnStyles";
import Button from "../Button";

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
    base: "my-0 grow-2 text-center text-2xl/[1.1] text-balance xs:text-left lg:text-3xl/[1.1]",
    icon: "hidden size-6 shrink-0 stroke-[1.6] xs:inline-block",
  },
  variants: {
    hasIcon: {
      true: { base: "xs:flex xs:items-center xs:gap-x-3" },
    },
  },
});

interface TaskCardHeadingProps {
  icon?: IconType;
  headingAs?: HeadingLevel;
  children?: ReactNode;
  locked?: boolean;
}

// a custom heading that is somewhat different from our standard heading component
const TaskCardHeading = ({
  icon,
  headingAs = "h3",
  locked,
  children,
}: TaskCardHeadingProps) => {
  let Icon = icon;
  if (icon && locked) {
    Icon = LockClosedIcon;
  }
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
    base: "rounded-md bg-white shadow-xl dark:bg-gray-600",
    header:
      "flex flex-col items-center gap-6 rounded-t-md border-b p-6 xs:flex-row xs:gap-12 xs:px-9",
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
    locked: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      locked: true,
      headingColor: ["primary", "secondary", "success", "warning", "error"],
      class: {
        header:
          "border-b-gray-100 bg-gray-100 text-gray-700 dark:border-b-gray-100 dark:bg-gray-700 dark:text-gray-100",
      },
    },
  ],
});

type RootVariants = VariantProps<typeof root>;

interface LinkAction {
  href: LinkProps["href"];
  onClick?: never;
}

interface ButtonAction {
  onClick: ButtonProps["onClick"];
  href?: never;
}

type TaskCardAction = LinkAction | ButtonAction;

interface TaskCardActionProps extends BaseButtonLinkProps {
  action: TaskCardAction;
  children: ReactNode;
}

const TaskCardAction = ({ action, ...rest }: TaskCardActionProps) => {
  if ("onClick" in action) {
    return (
      <Button onClick={action.onClick} type="button" {...rest} mode="inline" />
    );
  }

  if ("href" in action) {
    return <Link href={action.href} {...rest} mode="inline" />;
  }

  return null;
};

type RootAction = TaskCardAction & {
  label: ReactNode;
};

export interface RootProps extends RootVariants {
  icon?: IconType;
  title: ReactNode;
  action?: RootAction;
  headingAs?: HeadingLevel;
  children?: ReactElement<ItemProps> | ReactElement<ItemProps>[]; // Restricts children to only expected items;
}

const Root = ({
  icon,
  title,
  headingColor = "primary",
  locked = false,
  action,
  headingAs,
  children,
}: RootProps) => {
  const { base, header } = root({ headingColor, locked });
  return (
    <div className={base()}>
      <div className={header()}>
        <TaskCardHeading {...{ icon, headingAs, locked }}>
          {title}
        </TaskCardHeading>
        {action ? (
          <TaskCardAction
            action={action}
            color={locked ? "black" : headingColor}
          >
            {action.label}
          </TaskCardAction>
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
