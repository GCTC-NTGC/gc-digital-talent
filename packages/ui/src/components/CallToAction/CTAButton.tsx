import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import { BaseCTAProps, cta } from "./utils";

export interface CTAButtonProps
  extends BaseCTAProps,
    Omit<
      DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "color"
    > {}

const CTAButton = ({
  icon,
  color = "primary",
  block = false,
  className,
  children,
  ...rest
}: CTAButtonProps) => {
  const Icon = icon;
  const { base, icon: iconStyles, text } = cta({ color, block });
  return (
    <button className={base({ class: className })} {...rest}>
      <span className={iconStyles()}>
        <Icon className="h-auto w-5" />
      </span>
      <span className={text()}>{children}</span>
    </button>
  );
};

export default CTAButton;
