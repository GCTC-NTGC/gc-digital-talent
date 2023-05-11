import React from "react";
import { useLocation, Link, LinkProps } from "react-router-dom";

type ClickEvent =
  | React.MouseEvent<HTMLAnchorElement | undefined>
  | React.KeyboardEvent<HTMLAnchorElement | undefined>;

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

export interface ScrollToLinkProps extends Omit<LinkProps, "to"> {
  to: string;
  onScrollTo?: ScrollLinkClickFunc;
}

const ScrollToLink = ({
  to,
  onScrollTo,
  children,
  ...rest
}: ScrollToLinkProps) => {
  const { pathname, hash, search, state } = useLocation();
  const [targetSection, setTargetSection] = React.useState<HTMLElement | null>(
    null,
  );

  React.useEffect(() => {
    if (hash && hash === `#${to}`) {
      scrollToSection(targetSection);
    }
  }, [pathname, hash, to, targetSection]);

  React.useEffect(() => {
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
      {...rest}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default ScrollToLink;
