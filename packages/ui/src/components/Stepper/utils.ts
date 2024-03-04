import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import { MessageDescriptor } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import { IconType } from "../../types";
import { StepState } from "./types";

export const getIconFromState = (state: StepState, defaultIcon?: IconType) => {
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
  ["completed", uiMessages.stepCompleted],
  ["error", uiMessages.stepError],
]);

export const linkStyleMap = new Map<StepState, Record<string, string>>([
  [
    "active",
    {
      "data-h2-background-color": `
        base:all:children[.Step__Icon](primary.light)
        base:iap:children[.Step__Icon](primary)
        base:all:children[.Step__Tail](gray.light)
        base:all:focus-visible:children[.Step__Icon](focus)
      `,
      "data-h2-color": `
        base(black)
        base:hover:children[.Step__Text](primary)
        base:dark:hover:children[.Step__Text](primary.lighter)
        base:all:children[.Step__Icon](black)
        base:iap:all:children[.Step__Icon](white)
        base:all:focus-visible:children[.Step__Icon](black)
      `,
      "data-h2-font-weight": "base(700)",
      "data-h2-text-decoration": "base(none) base:focus-visible(underline)",
    },
  ],

  [
    "completed",
    {
      "data-h2-background-color": `
        base:all:children[.Step__Flair](success.light)
        base:all:focus-visible:children[.Step__Flair](focus)
      `,
      "data-h2-color": `
        base(black)
        base:all:children[.Step__Flair](black)
        base:hover:children[.Step__Text](success)
        base:dark:hover:children[.Step__Text](success.lighter)
      `,
      "data-h2-text-decoration": "base(underline) base:focus-visible(none)",
    },
  ],
  [
    "disabled",
    {
      "data-h2-background-color": `
        base:all:children[.Step__Flair](gray.light)
        base:all:focus-visible:children[.Step__Flair](focus)
        base:all:children[.Step__Tail](gray.light)
      `,
      "data-h2-color": `
        base(black)
        base:all:children[.Step__Flair](black)
      `,
      "data-h2-text-decoration": "base(none) base:focus-visible(underline)",
    },
  ],
  [
    "default",
    {
      "data-h2-background-color": `
        base:all:children[.Step__Flair](gray.light)
        base:all:focus-visible:children[.Step__Flair](focus)
        base:all:children[.Step__Tail](gray.light)
      `,
      "data-h2-color": `
        base(black)
        base:all:children[.Step__Flair](black)
        base:hover:children[.Step__Text](primary)
        base:dark:hover:children[.Step__Text](primary.lighter)
      `,
      "data-h2-text-decoration": "base(none) base:focus-visible(underline)",
    },
  ],
  [
    "error",
    {
      "data-h2-background-color": `
        base:all:children[.Step__Flair](error.light)
        base:all:focus-visible:children[.Step__Flair](focus)
        base:all:children[.Step__Tail](gray.light)
      `,
      "data-h2-color": `
        base(black)
        base:all:children[.Step__Flair](black)
        base:hover:children[.Step__Text](error)
        base:dark:hover:children[.Step__Text](error.lighter)
      `,
      "data-h2-text-decoration": "base(underline) base:focus-visible(none)",
    },
  ],
]);
