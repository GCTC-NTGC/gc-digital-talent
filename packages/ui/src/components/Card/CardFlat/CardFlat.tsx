import { ReactNode } from "react";

import Heading from "../../Heading";
import { CardColor } from "./types";
import CardFlatRegularLink, {
  CardFlatRegularLinkProps,
} from "./CardFlatRegularLink";
import CardFlatScrollToLink, {
  CardFlatScrollToLinkProps,
} from "./CardFlatScrollToLink";

function isRegularLinkItem(
  item: LinkItemRegular | LinkItemScrollTo,
): item is LinkItemRegular {
  return "href" in item;
}

function isScrollToLinkItem(
  item: CardFlatRegularLinkProps | LinkItemScrollTo,
): item is LinkItemScrollTo {
  return "to" in item;
}

function assertUnreachable(_: never): never {
  throw new Error("Didn't expect to be reachable.");
}

type LinkItemRegular = Omit<CardFlatRegularLinkProps, "color"> & {
  [key: `data-${string}`]: unknown;
  // add a natural key since mocked files do not have unique hrefs
  naturalKey?: string;
};

type LinkItemScrollTo = Omit<CardFlatScrollToLinkProps, "color"> & {
  [key: `data-${string}`]: unknown;
  // add a natural key since mocked files do not have unique hrefs
  naturalKey?: string;
};

export interface CardFlatProps {
  color: CardColor;
  title: ReactNode;
  children?: ReactNode;
  links?: (LinkItemRegular | LinkItemScrollTo)[];
}

const colorMap: Record<CardColor, Record<string, string>> = {
  primary: {
    "data-h2-border-left":
      "base:all(x.5 solid primary.light) base:iap(x.5 solid primary)",
  },
  secondary: {
    "data-h2-border-left":
      "base(x.5 solid secondary) base:iap(x.5 solid secondary) base:iap:dark(x.5 solid secondary.light)",
  },
  tertiary: {
    "data-h2-border-left":
      "base(x.5 solid tertiary) base:iap(x.5 solid secondary) base:iap:dark(x.5 solid secondary.light)",
  },
  quaternary: {
    "data-h2-border-left":
      "base(x.5 solid quaternary) base:iap(x.5 solid secondary) base:iap:dark(x.5 solid secondary.light)",
  },
  quinary: {
    "data-h2-border-left":
      "base(x.5 solid quinary) base:iap(x.5 solid secondary) base:iap:dark(x.5 solid secondary.light)",
  },
  black: {
    "data-h2-border-left": "base(x.5 solid black)",
  },
  blackFixed: {
    "data-h2-border-left": "base:all(x.5 solid black)",
  },
};

const CardFlat = ({ color, links, title, children }: CardFlatProps) => {
  let fontColor = {
    "data-h2-color": "base(black)",
  };
  if (color === "blackFixed") {
    fontColor = {
      "data-h2-color": "base:all(black)",
    };
  }
  return (
    <div
      {...colorMap[color]}
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-padding="base(0, 0, 0, x1)"
    >
      <Heading
        level="h3"
        size="h2"
        data-h2-font-size="base(h6)"
        {...fontColor}
        data-h2-margin="base(0, 0, 0, 0)"
      >
        {title}
      </Heading>
      {children && (
        <div
          {...fontColor}
          data-h2-flex-grow="base(1)"
          data-h2-margin-top="base(x.5)"
        >
          {children}
        </div>
      )}
      {links && links.length > 0 ? (
        <div
          data-h2-margin-top="base(x1)"
          data-h2-align-items="base(center)"
          data-h2-display="base(flex)"
          data-h2-flex-wrap="base(wrap)"
          data-h2-gap="base(x.25)"
        >
          {links.map((link) => {
            if (isRegularLinkItem(link)) {
              return (
                <CardFlatRegularLink
                  key={String(link.naturalKey ?? link.href)}
                  color={color}
                  {...link}
                />
              );
            }
            if (isScrollToLinkItem(link)) {
              return (
                <CardFlatScrollToLink
                  key={link.naturalKey ?? link.to}
                  color={color}
                  {...link}
                />
              );
            }
            return assertUnreachable(link);
          })}
        </div>
      ) : null}
    </div>
  );
};

export default CardFlat;
