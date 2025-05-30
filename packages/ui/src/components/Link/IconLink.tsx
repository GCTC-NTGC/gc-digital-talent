import { BaseIconButtonLinkProps, iconBtn } from "../../utils/btnStyles";
import BaseLink, { BaseLinkProps } from "./BaseLink";

export interface IconLinkProps
  extends BaseIconButtonLinkProps,
    Omit<
      BaseLinkProps,
      "color" | "children" | "aria-label" | "external" | "newTab"
    > {}

const IconLink = ({
  color = "primary",
  size = "md",
  icon,
  label,
  className,
  ...rest
}: IconLinkProps) => {
  const Icon = icon;
  const { base, icon: iconStyles } = iconBtn({ color, size });
  return (
    <BaseLink
      aria-label={label}
      className={base({ class: className })}
      {...rest}
    >
      <Icon className={iconStyles()} />
    </BaseLink>
  );
};

export default IconLink;
