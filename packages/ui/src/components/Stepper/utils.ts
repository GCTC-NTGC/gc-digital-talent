import { CheckIcon, FlagIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { MessageDescriptor } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import { IconType, StepState } from "./types";

export const getIconFromState = (state: StepState, defaultIcon: IconType) => {
  const iconMap = new Map<StepState, IconType>([
    ["active", MapPinIcon],
    ["completed", CheckIcon],
    ["disabled", defaultIcon],
    ["error", FlagIcon],
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
        base:children[.Step__Icon](primary.light)
        base:admin:children[.Step__Icon](primary)
        base:iap:children[.Step__Icon](secondary)
        base:children[.Step__Tail](gray.light)
        base:focus-visible:children[.Step__Icon](focus)
      `,
      "data-h2-color": `
        base(black) base:hover:children[.Step__Text](primary)
        base:children[.Step__Icon](black)
        base:admin:children[.Step__Icon](white)
        base:iap:children[.Step__Icon](white)
        base:focus-visible:children[.Step__Icon](black)
      `,
      "data-h2-font-weight": "base(700)",
      "data-h2-text-decoration": "base(none) base:focus-visible(underline)",
    },
  ],

  [
    "completed",
    {
      "data-h2-background-color": `
        base:children[.Step__Flair](success.light)
        base:focus-visible:children[.Step__Flair](focus)
      `,
      "data-h2-color": `
        base(black)
        base:hover:children[.Step__Text](success)
      `,
      "data-h2-text-decoration": "base(underline) base:focus-visible(none)",
    },
  ],
  [
    "disabled",
    {
      "data-h2-background-color": `
        base:children[.Step__Flair](gray.light)
        base:focus-visible:children[.Step__Flair](focus)
      `,
      "data-h2-color": `
        base(black)
        base:hover:children[.Step__Text](primary)
      `,
      "data-h2-text-decoration": "base(none) base:focus-visible(underline)",
    },
  ],
  [
    "error",
    {
      "data-h2-background-color": `
        base:children[.Step__Flair](error.light)
        base:focus-visible:children[.Step__Flair](focus)
      `,
      "data-h2-color": `
        base(black)
        base:hover:children[.Step__Text](error)
      `,
      "data-h2-text-decoration": "base(underline) base:focus-visible(none)",
    },
  ],
]);
