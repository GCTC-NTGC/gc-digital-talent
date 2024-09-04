import { Children, ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";

import { useSideMenuContext } from "./SideMenuProvider";

const commonStyles = {
  "data-h2-background-color": `
    base(transparent)
    base:focus-visible(focus)

    base:iap(secondary.light)
    base:iap:focus-visible(focus)
  `,
  "data-h2-outline": "base(none)",
  "data-h2-color": `
    base(white)

    base:selectors[.active](secondary.lighter)

    base:all:focus-visible(black)
    base:all:iap:focus-visible(black)
  `,
  "data-h2-width": "base(100%)",
  "data-h2-text-align": "base(left)",
  "data-h2-display": "base(block)",
  "data-h2-font-weight": "base:selectors[.active](700)",
};

interface SideMenuCategoryProps {
  title: string;
  children: ReactNode;
}

const SideMenuCategory = ({ title, children }: SideMenuCategoryProps) => {
  const ctx = useSideMenuContext();
  const shouldReduceMotion = useReducedMotion();
  const transitionConfig = { duration: shouldReduceMotion ? 0 : undefined };
  const subitemCount = Children.toArray(children).length;
  if (!subitemCount) return null; // hide empty categories
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-align-items="base(flex-start)"
      data-h2-gap="base(x0.5)"
      data-h2-align-self="base(stretch)"
    >
      <div
        {...commonStyles}
        data-h2-border-bottom="base:all(1px solid white)"
        data-h2-padding-bottom="base(x.15)"
        data-h2-height="base(x1)"
      >
        <m.span
          data-h2-display="base(flex)"
          transition={transitionConfig}
          animate={
            ctx?.open ? { opacity: 1, width: "auto" } : { opacity: 0, width: 0 }
          }
        >
          <span
            data-h2-white-space="base(nowrap)" // don't wrap while shrinking width to zero
            data-h2-font-weight="base(700)"
            data-h2-font-size="base(caption)"
            data-h2-color="base:all(white)"
          >
            {title}
          </span>
        </m.span>
      </div>

      {children}
    </div>
  );
};

export default SideMenuCategory;
