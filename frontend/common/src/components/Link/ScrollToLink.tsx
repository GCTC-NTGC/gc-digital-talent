import React from "react";
import { useLocation, useNavigate, Link, LinkProps } from "react-router-dom";

const scrollToSection = (section: HTMLElement | null) => {
  console.log(section);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const ScrollToLink = ({ to, children, ...rest }: LinkProps) => {
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // e.stopPropagation();
    scrollToSection(targetSection);
  };

  return (
    <Link to={`#${to}`} onClick={handleClick} preventScrollReset {...rest}>
      {children}
    </Link>
  );
};

export default ScrollToLink;
