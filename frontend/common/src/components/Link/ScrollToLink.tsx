import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type ScrollLinkClickFunc = (
  e: React.MouseEvent<HTMLAnchorElement>,
  section: HTMLElement | null,
) => void;

export interface ScrollToLinkProps
  extends Omit<React.HTMLProps<HTMLAnchorElement>, "href" | "onClick"> {
  to: string;
  children?: React.ReactNode;
  onClick?: ScrollLinkClickFunc;
}

const ScrollToLink = ({
  to,
  children,
  onClick,
  ...rest
}: ScrollToLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hash, pathname } = location;
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
    navigate({ ...location, hash: to });
    scrollToSection();
    if (onClick) {
      onClick(e, targetSection);
    }
  };

  return (
    <a href={`#${to}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export default ScrollToLink;
