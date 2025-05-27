import { ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

import Heading from "../../Heading";
import { CardColor } from "./types";
import CardFlatRegularLink, {
  CardFlatRegularLinkProps,
} from "./CardFlatRegularLink";
import CardFlatScrollToLink, {
  CardFlatScrollToLinkProps,
} from "./CardFlatScrollToLink";
import { hrefToString } from "../../../utils";

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

const cardFlat = tv({
  slots: {
    base: "flex flex-col border-l border-l-12 pl-6",
    heading: "my-0",
    content: "mt-3 grow",
    linkWrapper: "mt-6 flex flex-wrap items-center gap-2",
  },
  variants: {
    color: {
      primary: {
        base: "border-l-primary",
      },
      secondary: {
        base: "border-l-secondary",
      },
      success: {
        base: "border-l-success",
      },
      warning: {
        base: "border-l-warning",
      },
      error: {
        base: "border-l-error",
      },
      black: {
        base: "border-l-black dark:border-l-white",
      },
    },
  },
});

type CardFlatVariants = VariantProps<typeof cardFlat>;

// TO DO: Remove in #13562
const compatColourMap = new Map<CardFlatVariants["color"], CardColor>([
  ["primary", "secondary"],
  ["secondary", "primary"],
  ["success", "quinary"],
  ["warning", "quaternary"],
  ["error", "tertiary"],
  ["black", "black"],
]);

export interface CardFlatProps extends CardFlatVariants {
  title: ReactNode;
  children?: ReactNode;
  links?: (LinkItemRegular | LinkItemScrollTo)[];
}

const CardFlat = ({
  color = "primary",
  links,
  title,
  children,
}: CardFlatProps) => {
  const { base, heading, content, linkWrapper } = cardFlat({ color });

  return (
    <div className={base()}>
      <Heading level="h3" size="h6" className={heading()}>
        {title}
      </Heading>
      {children && <div className={content()}>{children}</div>}
      {links && links.length > 0 ? (
        <div className={linkWrapper()}>
          {links.map((link) => {
            if (isRegularLinkItem(link)) {
              return (
                <CardFlatRegularLink
                  key={String(link.naturalKey ?? hrefToString(link.href))}
                  color={compatColourMap.get(color) ?? "primary"}
                  {...link}
                />
              );
            }
            if (isScrollToLinkItem(link)) {
              return (
                <CardFlatScrollToLink
                  key={link.naturalKey ?? link.to}
                  color={compatColourMap.get(color) ?? "primary"}
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
