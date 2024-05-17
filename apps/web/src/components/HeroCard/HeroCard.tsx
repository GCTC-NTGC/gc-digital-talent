import { Link as RouterLink } from "react-router-dom";
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
      className="flex-grow rounded shadow-md"
      aria-label={title}
    >
      <div
        className="block rounded-t p-6 font-bold"
        data-h2-font-size="base(h6, 1)"
        {...{ ...colorMap[color] }}
      >
        {/* The styles on the regular Link component don't allow for text with a right-aligned SVG */}
        <RouterLink
          to={href}
          className="group/link w-full underline"
          data-h2-color="base:all(black) base:all:hover(black)"
        >
          <span className="flex w-full items-center justify-between">
            <span>{title}</span>
            <ChevronDoubleRightIcon className="h-6 w-6 transition-transform duration-200 ease-in-out group-hover/link:translate-x-[20%]" />
          </span>
        </RouterLink>
      </div>
      <ul className="p-6">{children}</ul>
    </Wrapper>
  );
};

export default HeroCard;
