import { useLocation, Link, LinkProps, Location } from "react-router";
import { useState, useEffect, MouseEvent, KeyboardEvent } from "react";

import { BaseButtonLinkProps, btn } from "../../utils/btnStyles";

type ClickEvent =
  | MouseEvent<HTMLAnchorElement | undefined>
  | KeyboardEvent<HTMLAnchorElement | undefined>;

export type ScrollLinkClickFunc = (
  e: ClickEvent,
  section: HTMLElement | null,
) => void;

const scrollToSection = (section: HTMLElement | null) => {
  if (section) {
    setTimeout(() => {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 10);
  }
};

export interface ScrollToLinkProps
  extends BaseButtonLinkProps,
    Omit<LinkProps, "to" | "color"> {
  to: string;
  onScrollTo?: ScrollLinkClickFunc;
  disabled?: boolean;
}

const ScrollToLink = ({
  to,
  onScrollTo,
  children,
  color = "black",
  mode = "text",
  block = false,
  size = "md",
  icon,
  utilityIcon,
  disabled = false,
  className,
  ...rest
}: ScrollToLinkProps) => {
  const { pathname, hash, search, state } = useLocation() as Location<unknown>;
  const [targetSection, setTargetSection] = useState<HTMLElement | null>(null);
  const Icon = icon;
  const UtilityIcon = utilityIcon;
  const { base, leadingIcon, trailingIcon, label } = btn({
    color,
    block,
    mode,
    size,
    disabled,
  });

  useEffect(() => {
    if (hash && hash === `#${to}`) {
      scrollToSection(targetSection);
    }
  }, [pathname, hash, to, targetSection]);

  useEffect(() => {
    const section = document.getElementById(to.toString());
    setTargetSection(section);
  }, [to]);

  const handleClick = (e: ClickEvent) => {
    scrollToSection(targetSection);
    if (onScrollTo) {
      onScrollTo(e, targetSection);
    }
  };

  return (
    <Link
      to={{
        pathname,
        search,
        hash: to,
      }}
      state={state}
      replace
      preventScrollReset={false}
      className={base({ class: className })}
      {...rest}
      onClick={handleClick}
    >
      {Icon && <Icon className={leadingIcon()} />}
      <span className={label()}>{children}</span>
      {UtilityIcon && <UtilityIcon className={trailingIcon()} />}
    </Link>
  );
};

export default ScrollToLink;
