import React from "react";
import { useLocation, Link, LinkProps } from "react-router-dom";

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

interface ScrollToLinkProps extends Omit<LinkProps, "to"> {
  to: string;
}

const ScrollToLink = ({ to, children, ...rest }: ScrollToLinkProps) => {
  const { pathname, hash } = useLocation();
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

  const handleClick = () => {
    scrollToSection(targetSection);
  };

  return (
    <Link
      to={{ hash: to }}
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
