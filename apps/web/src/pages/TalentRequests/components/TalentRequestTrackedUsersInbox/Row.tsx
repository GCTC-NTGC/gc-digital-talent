import type { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

import { CheckButton } from "@gc-digital-talent/forms";

const row = tv({
  base: "flex items-start gap-x-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700",
});

interface RowRootProps extends Omit<ComponentPropsWithRef<"li">, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const RowRoot = ({
  checked,
  onChange,
  label,
  children,
  className,
  ...rest
}: RowRootProps) => (
  <li className={row({ class: className })} {...rest}>
    <CheckButton
      checked={checked}
      onToggle={() => onChange(!checked)}
      label={label}
    />
    <div className="min-w-0 flex-1">{children}</div>
  </li>
);

const title = tv({ base: "font-bold" });

const Title = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={title({ class: className })} {...rest} />
);

const meta = tv({ base: "mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm" });

const Meta = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={meta({ class: className })} {...rest} />
);

export default { Root: RowRoot, Title, Meta };
