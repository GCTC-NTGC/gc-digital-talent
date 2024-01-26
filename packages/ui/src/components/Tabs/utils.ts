export const commonTabStyles = {
  root: {
    "data-h2-max-width": "base(100%)",
  },
  list: {
    "data-h2-list-style": "base(none)",
    "data-h2-display": "base(flex)",
    "data-h2-max-width": "base(100%)",
    "data-h2-gap": "base(x.25)",
    "data-h2-width": "base(100%)",
    "data-h2-padding": "base(0 x1)",
    "data-h2-z-index": "base(2)",
    "data-h2-overflow-y": "base(visible)",
    "data-h2-overflow-x": "base(auto)",
    "data-h2-overscroll-behavior-x": "base(contain)",
    "data-h2-scroll-snap-align": "base(start)",
    "data-h2-scroll-snap-type": "base(x mandatory)",
    "data-h2-scrollbar-width": "base:hover(none)",
  },
  trigger: {
    "data-h2-background-color": "base(background)",
    "data-h2-border": "base:all(thin solid background.darker)",
    "data-h2-display": "base(inline-flex)",
    "data-h2-border-bottom-color":
      "base:all:selectors[[data-state='active']](transparent)",
    "data-h2-font-weight": "base:selectors[[data-state='active']](700)",
    "data-h2-text-decoration":
      "base:selectors[[data-state='inactive']](underline) base:selectors[[data-state='active'] > a](none)",
    "data-h2-border-top-color": `
      base:selectors[[data-state='active'] > span](primary)
      base:dark:selectors[[data-state='active'] > span](primary.light)

      base:selectors[[data-state='active'] > a](primary)
      base:dark:selectors[[data-state='active'] > a](primary.light)

      base:focus-visible:children[span](focus)
      base:children[a:focus-visible](focus)
    `,
    "data-h2-color": `
      base(black)
      base:children[a:focus-visible](black)
      base:focus-visible:children[span](black)
      base:selectors[[data-state='active']](primary.darker)
    `,
    "data-h2-margin-top": "base(x.25) base:hover(0)",
    "data-h2-outline": "base(none) base:children[a](none)",
    "data-h2-padding": "base(0)",
    "data-h2-position": "base(relative)",
    "data-h2-radius": "base(rounded rounded 0 0)",
    "data-h2-z-index": "base(1)",
  },
  triggerInner: {
    "data-h2-border-top": "base:all(x.25 solid background.darker)",
    "data-h2-display": "base(block)",
    "data-h2-radius": "base(s s 0 0)",
    "data-h2-padding": "base(x.5 x.75)",
  },
  contentDivide: {
    "data-h2-border-top": "base:all(thin solid background.darker)",
    "data-h2-color": "base(black)",
    "data-h2-margin-top": "base(-1px)",
    "data-h2-max-width": "base(100%)",
    "data-h2-outline": "base(none)",
  },
};

/**
 * Scroll to the list item when it is in view.
 *
 * This allows us to have the currently focused item appear
 * in the list when it has been focused for keyboard-only users.
 *
 * @param event
 */
export const handleTabFocus: React.FocusEventHandler<HTMLElement> = (event) => {
  let target: HTMLElement = event.currentTarget;
  const list = target.closest(".Tabs__List");
  // Target could be in list.
  // If so, we need to use the parent list item to calculate offset
  if (list?.nodeName === "UL" && target?.parentElement?.nodeName === "LI") {
    target = target.parentElement;
  }
  const currentScroll = list?.scrollLeft ?? 0;
  const totalWidth = list?.scrollWidth ?? 0;

  const offset = target.offsetLeft;
  const scrollTo = offset + currentScroll - totalWidth / 2;

  list?.scrollTo({ left: scrollTo });
};
