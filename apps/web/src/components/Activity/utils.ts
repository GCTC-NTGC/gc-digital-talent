import { IntlShape, MessageDescriptor } from "react-intl";
import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import TrashIcon from "@heroicons/react/16/solid/TrashIcon";
import { tv, VariantProps } from "tailwind-variants";

import { ActivityProperties, Maybe } from "@gc-digital-talent/graphql";
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

type ActivityEventType = "created" | "updated" | "deleted";

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
  event?: Maybe<string>,
): ActivityEventInfo | undefined {
  let eventType: ActivityEventType = "updated";
  if (isEventType(event)) {
    eventType = event;
  }

  return eventInfoMap.get(eventType);
}

function stripSuffix(str: string, len = 3): string {
  return str.slice(0, -len);
}

export type JSONRecord = Record<string, unknown>;

function isRecord(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

export function parseAttributes(attr: unknown): JSONRecord {
  if (isRecord(attr)) {
    return attr;
  }
  if (typeof attr === "string" && attr.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(attr) as JSONRecord;
      return isRecord(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

export function normalizePropKeys(
  intl: IntlShape,
  propsObj?: Maybe<ActivityProperties>,
): string[] {
  if (!propsObj?.attributes) {
    return [];
  }
  // Should be safe to parse and cast after validating
  const attributes = parseAttributes(propsObj.attributes);

  let modified: string[] = [];
  Object.keys(attributes).forEach((k) => {
    if (k.endsWith("_id")) {
      modified = [...modified, stripSuffix(k)];
      return;
    }

    // Handle localized strings
    const val = attributes[k];
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
