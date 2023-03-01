import { Link } from "@gc-digital-talent/ui";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import * as React from "react";

export type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "quinary";

export const colorMap: Record<Color, Record<string, string>> = {
  primary: {
    "data-h2-background-color":
      "base:all(primary.light) base:dark:iap(primary)",
    "data-h2-color":
      "base:all(black) base:all:admin(white) base:all:iap(white)",
  },
  secondary: {
    "data-h2-background-color":
      "base(secondary) base:dark:admin(secondary.lighter) base:dark:iap(secondary.light)",
    "data-h2-color":
      "base:all(black) base:all:admin(white) base:all:iap(white)",
  },
  tertiary: {
    "data-h2-background-color": "base(tertiary) base:dark:iap(tertiary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quaternary: {
    "data-h2-background-color":
      "base(quaternary) base:dark:iap(quaternary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
  quinary: {
    "data-h2-background-color": "base(quinary) base:dark:iap(quinary.light)",
    "data-h2-color": "base:all(black) base:all:iap(white)",
  },
};

export interface HeroCardProps {
  color: Color;
  title: string;
  href: string;
  children?: React.ReactNode;
  ariaRole?: React.AriaRole;
}

export const HeroCard = ({
  color,
  title,
  href,
  children,
  ariaRole,
}: HeroCardProps) => {
  return (
    <div
      data-h2-background-color="base(white)"
      data-h2-radius="base(s)"
      data-h2-shadow="base(s)"
      data-h2-flex-grow="base(1)"
      role={ariaRole}
    >
      <div
        className="card-link__header"
        data-h2-display="base(block)"
        data-h2-font-size="base(h6, 1) desktop(h5, 1)"
        data-h2-font-weight="base(700)"
        data-h2-padding="base(x1)"
        data-h2-radius="base(s, s, 0px, 0px)"
        {...{ ...colorMap[color] }}
      >
        <div data-h2-display="base(flex)">
          <Link href={href}>{title}</Link>
          <div data-h2-flex-grow="base(1)" />
          <Link href={href}>
            <ChevronDoubleRightIcon
              style={{
                width: "1em",
                height: "1em",
              }}
            />
          </Link>
        </div>
      </div>
      <div data-h2-padding="base(x1)">{children}</div>
    </div>
  );
};

export default HeroCard;
