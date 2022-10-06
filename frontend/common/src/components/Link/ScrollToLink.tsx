import React from "react";
import { navigate } from "../../helpers/router";

export interface ScrollToLinkProps
  extends Omit<React.HTMLProps<HTMLAnchorElement>, "href" | "onClick"> {
  to: string;
}

const ScrollToLink = ({ to, children, ...rest }: ScrollToLinkProps) => {
  const [targetSection, setTargetSection] = React.useState<HTMLElement | null>(
    null,
  );

  React.useEffect(() => {
    const section = document.getElementById(to);
    setTargetSection(section);
  }, [to]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (targetSection) {
      e.preventDefault();
      navigate(`#${to}`);
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <a href={`#${to}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export default ScrollToLink;
