import { FocusEventHandler } from "react";
import { tv } from "tailwind-variants";

export const root = tv({
  base: "max-w-full",
});

export const list = tv({
  base: "Tabs__List overflow-x-container z-2 flex w-full max-w-full snap-x snap-mandatory snap-start list-none gap-1.5 overflow-x-auto overflow-y-visible px-6",
});

export const trigger = tv({
  base: "group/tabTrigger relative z-[1] mt-1.5 inline-flex rounded-t border border-gray bg-gray-100 outline-none hover:mt-0 data-[state=active]:border-b-transparent data-[state=active]:font-bold data-[state=inactive]:underline dark:bg-gray-700",
});

export const inner = tv({
  base: "block rounded-t border-t-6 border-t-gray px-4.5 py-3 outline-none group-data-[state=active]/tabTrigger:border-t-secondary-500 group-data-[state=active]/tabTrigger:text-secondary-600 dark:group-data-[state=active]/tabTrigger:text-secondary-200 iap:group-data-[state=active]/tabTrigger:border-t-primary-500 iap:group-data-[state=active]/tabTrigger:text-primary-500 iap:dark:group-data-[state=active]/tabTrigger:border-t-primary-200 dark:iap:group-data-[state=active]/tabTrigger:text-primary-200",
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
  const el = target.closest(".Tabs__List");
  // Target could be in list.
  // If so, we need to use the parent list item to calculate offset
  if (el?.nodeName === "UL" && target?.parentElement?.nodeName === "LI") {
    target = target.parentElement;
  }
  const currentScroll = el?.scrollLeft ?? 0;
  const totalWidth = el?.scrollWidth ?? 0;

  const offset = target.offsetLeft;
  const scrollTo = offset + currentScroll - totalWidth / 2;

  el?.scrollTo({ left: scrollTo });
};
