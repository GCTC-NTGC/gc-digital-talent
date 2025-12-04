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

const scrollToSection = (
  section: HTMLElement | null,
  offsetEl?: HTMLElement | null,
) => {
  if (section) {
    if (offsetEl) {
      setTimeout(() => {
        window.scrollTo({
          behavior: "smooth",
          top:
            section.getBoundingClientRect().top -
            document.body.getBoundingClientRect().top -
            // NOTE: 16 adds a bit of a gap so text doesn't touch element
            (offsetEl.getBoundingClientRect().height + 16),
        });
      }, 10);
    } else {
      setTimeout(() => {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 10);
    }
  }
};

export interface ScrollToLinkProps
  extends BaseButtonLinkProps, Omit<LinkProps, "to" | "color"> {
  to: string;
  onScrollTo?: ScrollLinkClickFunc;
  disabled?: boolean;
  offsetId?: string;
}

const ScrollToLink = ({
  to,
  onScrollTo,
  children,
  color = "black",
  mode = "text",
  block = false,
  size = "md",
  offsetId = "main-nav",
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
  const offsetEl = document.getElementById(offsetId);

  useEffect(() => {
    if (hash && hash === `#${to}`) {
      scrollToSection(targetSection, offsetEl);
    }
  }, [pathname, hash, to, targetSection, offsetEl]);

  useEffect(() => {
    const section = document.getElementById(to.toString());
    setTargetSection(section);
  }, [to]);

  const handleClick = (e: ClickEvent) => {
    scrollToSection(targetSection, offsetEl);
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
