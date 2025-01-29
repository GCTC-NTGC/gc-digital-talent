import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import { ReactNode } from "react";

import { Maybe } from "@gc-digital-talent/graphql";

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
  ...rest
}: BoolCheckIconProps) => {
  const Icon = value ? CheckCircleIcon : XCircleIcon;

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-gap="base(x.25)"
      {...rest}
    >
      <Icon
        data-h2-width="base(x.75)"
        data-h2-height="base(x.75)"
        {...(value
          ? {
              "aria-label": trueLabel,
              "data-h2-color": "base(success) base:dark(success.lighter)",
            }
          : {
              "aria-label": falseLabel,
              "data-h2-color": "base(black.lighter) base:dark(white.5)",
            })}
      />
      <span>{children}</span>
    </div>
  );
};

export default BoolCheckIcon;
