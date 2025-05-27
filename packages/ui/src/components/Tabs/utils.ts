import { FocusEventHandler } from "react";
import { tv } from "tailwind-variants";

export const root = tv({
  base: "max-w-full",
});

export const list = tv({
  base: "Tabs__List overflow-x-container z-2 flex w-full max-w-full snap-x snap-mandatory snap-start list-none gap-1.5 overflow-x-auto overflow-y-visible px-6",
});

export const trigger = tv({
  base: "group/tabTrigger relative z-[1] mt-1.5 inline-flex rounded-t border border-gray bg-compat-background outline-none hover:mt-0 data-[state=active]:border-b-transparent data-[state=active]:font-bold data-[state=inactive]:underline",
});

export const inner = tv({
  base: "block rounded-t border-t-6 border-t-gray px-4.5 py-3 outline-none group-data-[state=active]/tabTrigger:border-t-secondary dark:group-data-[state=active]/tabTrigger:border-t-secondary-300",
});

export const divide = tv({
  base: "-mt-px max-w-full border-t border-t-gray outline-none",
});

/**
 * Scroll to the list item when it is in view.
 *
 * This allows us to have the currently focused item appear
 * in the list when it has been focused for keyboard-only users.
 *
 * @param event
 */
export const handleTabFocus: FocusEventHandler<HTMLElement> = (event) => {
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
