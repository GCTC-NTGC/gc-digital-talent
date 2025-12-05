import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import { ReactNode, useId } from "react";
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

interface BothLabelsRequiredProps extends DivProps {
  value?: Maybe<boolean>;
  trueLabel: string;
  falseLabel: string;
  children: ReactNode;
}

interface NoLabelsAllowedProps extends DivProps {
  value?: Maybe<boolean>;
  trueLabel?: undefined;
  falseLabel?: undefined;
  children: ReactNode;
}

type BoolCheckIconProps = BothLabelsRequiredProps | NoLabelsAllowedProps;

const BoolCheckIcon = ({
  value,
  trueLabel,
  falseLabel,
  children,
  className,
  ...rest
}: BoolCheckIconProps) => {
  const id = useId();
  const Icon = value ? CheckCircleIcon : XCircleIcon;
  const { base, icon } = boolCheck({ checked: value ?? false });
  const hasLabels = trueLabel && falseLabel;

  return (
    <div className={base({ class: className })} {...rest}>
      {hasLabels && (
        <span hidden id={id}>
          {value ? trueLabel : falseLabel}
        </span>
      )}
      <Icon
        className={icon()}
        role="img"
        {...(hasLabels && {
          "aria-hidden": "false",
          "aria-labelledby": id,
        })}
      />
      <span>{children}</span>
    </div>
  );
};

export default BoolCheckIcon;
