import { IntlShape, MessageDescriptor } from "react-intl";
import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import MinusIcon from "@heroicons/react/16/solid/MinusIcon";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import TrashIcon from "@heroicons/react/16/solid/TrashIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/16/solid/ClipboardDocumentCheckIcon";
import UserPlusIcon from "@heroicons/react/16/solid/UserPlusIcon";
import UserMinusIcon from "@heroicons/react/16/solid/UserMinusIcon";
import BriefcaseIcon from "@heroicons/react/16/solid/BriefcaseIcon";
import DocumentArrowUpIcon from "@heroicons/react/16/solid/DocumentArrowUpIcon";
import { tv, VariantProps } from "tailwind-variants";
import { isValid } from "date-fns/isValid";
import { format } from "date-fns/format";

import {
  ActivityEvent,
  ActivityProperties,
  Maybe,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Logger } from "@gc-digital-talent/logger";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import activityMessages from "~/messages/activityMessages";
import adminMessages from "~/messages/adminMessages";

export const icon = tv({
  base: "mt-0.5 flex size-5.5 shrink-0 items-center rounded-full bg-primary-500 p-1 text-white",
  variants: {
    color: {
      primary: "bg-primary-500",
      secondary: "bg-secondary-500",
      success: "bg-success-500",
      warning: "bg-warning-500",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export type IconVariants = VariantProps<typeof icon>;

export interface ActivityEventInfo {
  message: MessageDescriptor;
  icon: IconType;
  color: IconVariants["color"];
}

const eventInfoMap = new Map<ActivityEvent, ActivityEventInfo>([
  [
    ActivityEvent.Created,
    {
      message: activityMessages.created,
      icon: PlusIcon,
      color: "primary",
    },
  ],
  [
    ActivityEvent.Updated,
    {
      message: activityMessages.updated,
      icon: ArrowPathIcon,
      color: "primary",
    },
  ],
  [
    ActivityEvent.Deleted,
    {
      message: activityMessages.deleted,
      icon: TrashIcon,
      color: "primary",
    },
  ],
  [
    ActivityEvent.Submitted,
    {
      message: activityMessages.submitted,
      icon: ClipboardDocumentCheckIcon,
      color: "secondary",
    },
  ],
  [
    ActivityEvent.Qualified,
    {
      message: activityMessages.qualified,
      icon: UserPlusIcon,
      color: "secondary",
    },
  ],
  [
    ActivityEvent.Disqualified,
    {
      message: activityMessages.disqualified,
      icon: UserMinusIcon,
      color: "secondary",
    },
  ],
  [
    ActivityEvent.Placed,
    {
      message: activityMessages.placed,
      icon: BriefcaseIcon,
      color: "secondary",
    },
  ],
  [
    ActivityEvent.Removed,
    {
      message: activityMessages.removed,
      icon: MinusIcon,
      color: "secondary",
    },
  ],
  [
    ActivityEvent.Added,
    {
      message: activityMessages.added,
      icon: PlusIcon,
      color: "secondary",
    },
  ],
  [
    ActivityEvent.Reinstated,
    {
      message: activityMessages.reinstated,
      icon: UserPlusIcon,
      color: "secondary",
    },
  ],
  [
    ActivityEvent.Reverted,
    {
      message: activityMessages.reverted,
      icon: ArrowPathIcon,
      color: "secondary",
    },
  ],
  [
    ActivityEvent.Published,
    {
      message: activityMessages.published,
      icon: DocumentArrowUpIcon,
      color: "success",
    },
  ],
]);

export function getEventInfo(
  event?: Maybe<ActivityEvent>,
): ActivityEventInfo | undefined {
  let eventType = ActivityEvent.Updated;
  if (event) {
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

export function getDeepAttribute(
  obj: unknown,
  ...path: string[]
): string | null {
  let curr: unknown = obj;
  for (const p of path) {
    if (isRecord(curr) && p in curr) {
      curr = curr[p];
    } else {
      return null;
    }
  }
  return typeof curr === "string" ? curr : null;
}

const commonKeyMap = new Map<string, MessageDescriptor>([
  ["id", adminMessages.id],
  ["created_at", commonMessages.created],
  ["archived_at", commonMessages.archived],
  ["updated_at", commonMessages.updated],
  ["deleted_at", commonMessages.deleted],
]);

export function normalizePropKeys(
  intl: IntlShape,
  propsObj?: Maybe<ActivityProperties>,
  keyMap?: Map<string, MessageDescriptor>,
  logger?: Logger,
): string[] {
  if (!propsObj?.attributes) {
    return [];
  }
  // Should be safe to parse and cast after validating
  const attributes = parseAttributes(propsObj.attributes);
  const localizedKeyMap = commonKeyMap;
  if (keyMap) {
    for (const [key, value] of keyMap) {
      if (!localizedKeyMap.has(key)) {
        localizedKeyMap.set(key, value);
      }
    }
  }

  let modified: string[] = [];
  Object.keys(attributes).forEach((k) => {
    let localizedKey: string = k;
    const localizedKeyMessage = localizedKeyMap.get(k);
    if (localizedKeyMessage) {
      localizedKey = intl.formatMessage(localizedKeyMessage);
    } else {
      logger?.warning(`Activity log attribute ${k} has no matching label.`);
    }

    if (k.endsWith("_id") && !localizedKeyMessage) {
      modified = [...modified, stripSuffix(k)];
      return;
    }

    // Handle localized strings
    const val = attributes[k];
    if (val && typeof val === "object" && ("fr" in val || "en" in val)) {
      if ("fr" in val) {
        modified = [
          ...modified,
          `${localizedKey} ${intl.formatMessage(commonMessages.frenchLabel)}`,
        ];
      }

      if ("en" in val) {
        modified = [
          ...modified,
          `${localizedKey} ${intl.formatMessage(commonMessages.englishLabel)}`,
        ];
      }

      return;
    }

    // Updated at always appears so seems useless to show it
    // Created should always be identical to log time so also useless
    if (k !== "updated_at" && k !== "created_at") {
      modified = [...modified, localizedKey];
    }
  });

  if (modified.length <= 0) {
    modified = [
      intl.formatMessage({
        defaultMessage: "Saved without changes",
        id: "z/qlLb",
        description:
          "Message for when an activity log event had no changes tracked",
      }),
    ];
  }

  return modified;
}

export function formatActivityDayGroup(day: string, intl: IntlShape): string {
  return formatDate({
    date: parseDateTimeUtc(day),
    formatString: DATE_FORMAT_LOCALIZED,
    intl,
  });
}

interface GroupedByDay<T> {
  day: string;
  activities: T[];
}

export function groupByDay<T, K extends keyof T>(
  items: T[],
  key?: K,
): GroupedByDay<T>[] {
  const groups = new Map<string, T[]>();
  const dateKey = (key ?? "createdAt") as keyof T;

  for (const item of items) {
    const rawDate = item[dateKey];
    if (typeof rawDate !== "string") continue;

    const date = parseDateTimeUtc(rawDate);
    if (!isValid(date)) continue;

    const day = format(date, "yyyy-MM-dd");

    if (!groups.has(day)) {
      groups.set(day, []);
    }

    groups.get(day)?.push(item);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([day, activities]) => ({ day, activities }));
}
