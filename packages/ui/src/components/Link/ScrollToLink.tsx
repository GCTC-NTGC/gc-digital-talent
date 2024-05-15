import * as React from "react";
import { useLocation, Link, LinkProps } from "react-router-dom";

import ButtonLinkContent from "../ButtonLinkContent/ButtonLinkContent";
import { ButtonLinkProps } from "../../types";
import getButtonStyles from "../../utils/button/getButtonStyles";

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

export type ScrollToLinkProps = Omit<LinkProps, "to"> &
  ButtonLinkProps & {
    to: string;
    onScrollTo?: ScrollLinkClickFunc;
    external?: boolean;
    newTab?: boolean;
    disabled?: boolean;
  };

const ScrollToLink = ({
  to,
  onScrollTo,
  children,
  color = "black",
  mode = "text",
  block = false,
  fontSize = "body",
  icon,
  utilityIcon,
  disabled = false,
  newTab = false,
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

  const content = (
    <ButtonLinkContent
      mode={mode}
      icon={icon}
      utilityIcon={utilityIcon}
      newTab={newTab}
      fontSize={fontSize}
    >
      {children}
    </ButtonLinkContent>
  );

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
      {...getButtonStyles({ mode, color, block, disabled })}
      {...rest}
      onClick={handleClick}
    >
      {content}
    </Link>
  );
};

export default ScrollToLink;
