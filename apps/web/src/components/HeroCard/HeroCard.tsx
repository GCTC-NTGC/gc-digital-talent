import { Link as RouterLink } from "react-router";
import ChevronDoubleRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon";
import { ReactNode } from "react";

type Color = "primary" | "secondary" | "tertiary" | "quaternary" | "quinary";

const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color":
      "base:all(primary.light) base:dark:iap(primary)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  secondary: {
    "data-h2-background-color":
      "base(secondary) base:dark:iap(secondary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  tertiary: {
    "data-h2-background-color": "base:all(tertiary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quaternary: {
    "data-h2-background-color":
      "base:all(quaternary.light) base:dark:iap(quaternary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quinary: {
    "data-h2-background-color": "base(quinary) base:dark:iap(quinary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
};

interface HeroCardProps {
  color: Color;
  title: string;
  href: string;
  children?: ReactNode;
  asNav?: boolean;
}

const HeroCard = ({ color, title, href, children, asNav }: HeroCardProps) => {
  const Wrapper = asNav ? "nav" : "div";
  return (
    <Wrapper
      data-h2-background-color="base(foreground)"
      data-h2-radius="base(s)"
      data-h2-shadow="base(m)"
      data-h2-flex-grow="base(1)"
      aria-label={title}
    >
      <div
        data-h2-display="base(block)"
        data-h2-font-size="base(h6, 1)"
        data-h2-font-weight="base(700)"
        data-h2-padding="base(x1)"
        data-h2-radius="base(s, s, 0px, 0px)"
        {...{ ...colorMap[color] }}
      >
        {/* The styles on the regular Link component don't allow for text with a right-aligned SVG */}
        <RouterLink
          to={href}
          data-h2-transform="base:hover:children[svg](translate(20%, 0))"
          data-h2-transition="base:children[svg](transform .2s ease)"
          data-h2-color="base:all(black) base:all:hover(black)"
          data-h2-text-decoration="base(underline)"
          data-h2-width="base(100%)"
        >
          <span
            data-h2-align-items="base(center)"
            data-h2-display="base(flex)"
            data-h2-width="base(100%)"
            data-h2-justify-content="base(space-between)"
          >
            <span>{title}</span>
            <ChevronDoubleRightIcon
              data-h2-height="base(x1)"
              data-h2-width="base(x1)"
            />
          </span>
        </RouterLink>
      </div>
      <ul data-h2-padding="base(x1)" data-h2-list-style="base(none)">
        {children}
      </ul>
    </Wrapper>
  );
};

export default HeroCard;
