import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { Maybe } from "@gc-digital-talent/graphql";

const boolCheck = tv({
  slots: {
    base: "flex items-start gap-1.5",
    icon: "mt-1 size-4.5 shrink-0",
  },
  variants: {
    checked: {
      true: { icon: "text-success dark:text-success-200" },
      false: { icon: "text-gray-300 dark:text-gray" },
    },
  },
});

type DivProps = React.ComponentPropsWithoutRef<"div">;

interface BoolCheckIconProps extends DivProps {
  value?: Maybe<boolean>;
  trueLabel?: string;
  falseLabel?: string;
  children: ReactNode;
}

const BoolCheckIcon = ({
  value,
  trueLabel,
  falseLabel,
  children,
  className,
  ...rest
}: BoolCheckIconProps) => {
  const Icon = value ? CheckCircleIcon : XCircleIcon;
  const { base, icon } = boolCheck({ checked: value ?? false });

  return (
    <div className={base({ class: className })} {...rest}>
      <Icon className={icon()} aria-label={value ? trueLabel : falseLabel} />
      <span>{children}</span>
    </div>
  );
};

export default BoolCheckIcon;
