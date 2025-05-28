import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { MessageDescriptor } from "react-intl";
import { tv, VariantProps } from "tailwind-variants";

import { uiMessages } from "@gc-digital-talent/i18n";

import { IconType } from "../../types";

export const step = tv({
  slots: {
    link: "group/step relative block w-full pl-9! outline-none focus-visible:bg-transparent!",
    icon: "-top-0.5 left-1/2 size-7 rounded-full bg-gray-100 dark:bg-gray-600",
    tail: "top-0.5 bottom-auto left-1/2 h-[calc(100%+var(--spacing)*6)] w-0.75 bg-gray-100 dark:bg-gray-600",
    text: "ml-1.5 inline-block text-black dark:text-white",
  },
  variants: {
    state: {
      default: {
        text: "group-hover/step:text-secondary dark:group-hover/step:text-secondary-200",
      },
      active: {
        icon: "bg-secondary text-black iap:bg-primary iap:text-white",
        text: "font-bold group-hover/step:text-secondary dark:group-hover/step:text-secondary-200",
      },
      "active-error": {
        icon: "bg-error iap:bg-error",
        text: "font-bold group-hover/step:text-error dark:group-hover/step:text-error-300",
      },
      error: {
        icon: "bg-error iap:bg-error",
        text: "group-hover/step:text-error dark:group-hover/step:text-error-300",
      },
      completed: {
        icon: "bg-success",
        text: "group-hover/step:text-success-500 dark:group-hover/step:text-success-300",
      },
      disabled: {},
    },
  },
  compoundSlots: [
    {
      slots: ["icon", "tail"],
      class:
        "absolute -translate-x-1/2 transform group-focus-visible/step:bg-focus",
    },
    {
      slots: ["icon", "tail"],
      state: "completed",
      class: "bg-success text-black dark:bg-success-300",
    },
  ],
});

export type StepVariants = VariantProps<typeof step>;

export type StepState = StepVariants["state"];

export const getIconFromState = (state: StepState) => {
  const iconMap = new Map<StepState, IconType | undefined>([
    ["completed", CheckIcon],
    ["error", XMarkIcon],
  ]);

  return iconMap.get(state);
};

export const messageMap = new Map<
  Omit<StepState, "disabled">,
  MessageDescriptor
>([
  ["active", uiMessages.stepActive],
  ["active-error", uiMessages.stepActive],
  ["completed", uiMessages.stepCompleted],
  ["error", uiMessages.stepError],
]);
