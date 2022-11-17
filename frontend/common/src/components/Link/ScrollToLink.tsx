import React from "react";
import { useLocation } from "react-router-dom";

export interface ScrollToLinkProps
  extends Omit<React.HTMLProps<HTMLAnchorElement>, "href" | "onClick"> {
  to: string;
}

const ScrollToLink = ({ to, children, ...rest }: ScrollToLinkProps) => {
  const { pathname, search, hash } = useLocation();
  const [targetSection, setTargetSection] = React.useState<HTMLElement | null>(
    null,
  );

  const scrollToSection = React.useCallback(() => {
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [targetSection]);

  React.useEffect(() => {
    if (hash && hash === `#${to}`) {
      scrollToSection();
    }
  }, [pathname, hash, to, scrollToSection]);

  React.useEffect(() => {
    const section = document.getElementById(to);
    setTargetSection(section);
  }, [to]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.history.pushState({}, "", `${pathname}${search}#${to}`);
    scrollToSection();
  };

  return (
    <a href={`#${to}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export default ScrollToLink;
