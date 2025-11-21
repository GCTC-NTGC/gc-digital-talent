import { IntlShape, MessageDescriptor } from "react-intl";
import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import TrashIcon from "@heroicons/react/16/solid/TrashIcon";
import { tv, VariantProps } from "tailwind-variants";

import { Maybe } from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import activityMessages from "~/messages/activityMessages";

export const icon = tv({
  base: "mt-0.5 flex size-5.5 shrink-0 items-center rounded-full bg-primary-500 p-1 text-white",
  variants: {
    color: {
      primary: "bg-primary-500",
      success: "bg-success-500",
      warning: "bg-warning-500",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export type IconVariants = VariantProps<typeof icon>;

type ActivityPropertiesKey = "attributes" | "old";

export type JSONRecord = Record<ActivityPropertiesKey, Record<string, unknown>>;

type ActivityEventType = "created" | "updated" | "added" | "deleted";

export interface ActivityEventInfo {
  message: MessageDescriptor;
  icon: IconType;
  color: IconVariants["color"];
}

function isEventType(value?: Maybe<string>): value is ActivityEventType {
  return value === "created" || value === "updated";
}

const eventInfoMap = new Map<ActivityEventType, ActivityEventInfo>([
  [
    "created",
    {
      message: activityMessages.created,
      icon: PlusIcon,
      color: "primary",
    },
  ],
  [
    "added",
    {
      message: activityMessages.added,
      icon: PlusIcon,
      color: "primary",
    },
  ],
  [
    "updated",
    {
      message: activityMessages.updated,
      icon: ArrowPathIcon,
      color: "primary",
    },
  ],
  [
    "deleted",
    {
      message: activityMessages.deleted,
      icon: TrashIcon,
      color: "primary",
    },
  ],
]);

export function getEventInfo(
  propsObj: JSONRecord,
  event?: Maybe<string>,
): ActivityEventInfo | undefined {
  let eventType: ActivityEventType = "updated";
  if (isEventType(event)) {
    eventType = event;
  }

  if (!("old" in propsObj)) {
    eventType = "added";
  }

  return eventInfoMap.get(eventType);
}

function stripSuffix(str: string, len = 3): string {
  return str.slice(0, -len);
}

export function normalizePropKeys(
  propsObj: JSONRecord,
  intl: IntlShape,
): string[] {
  // Attempt to guard against malformed JSON
  if (!("attributes" in propsObj) || typeof propsObj.attributes !== "object") {
    return [];
  }

  let modified: string[] = [];
  Object.keys(propsObj.attributes).forEach((k) => {
    if (k.endsWith("_id")) {
      modified = [...modified, stripSuffix(k)];
      return;
    }

    // Handle localized strings
    const val = propsObj.attributes[k];
    if (val && typeof val === "object" && ("fr" in val || "en" in val)) {
      if ("fr" in val) {
        modified = [
          ...modified,
          `${k} ${intl.formatMessage(commonMessages.frenchLabel)}`,
        ];
      }

      if ("en" in val) {
        modified = [
          ...modified,
          `${k} ${intl.formatMessage(commonMessages.englishLabel)}`,
        ];
      }

      return;
    }

    // Updated at always appears so seems useless to show it
    if (k !== "updated_at") {
      modified = [...modified, k];
    }
  });

  return modified;
}
