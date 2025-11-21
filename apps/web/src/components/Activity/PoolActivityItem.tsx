import DocumentArrowUpIcon from "@heroicons/react/16/solid/DocumentArrowUpIcon";
import ExclamationTriangleIcon from "@heroicons/react/16/solid/ExclamationTriangleIcon";
import { isAfter } from "date-fns/isAfter";

import {
  ActivityProperties,
  getFragment,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import activityMessages from "~/messages/activityMessages";

import ActivityItem, {
  ActivityItem_Fragment,
  ActivityItemProps,
} from "./ActivityItem";
import { getEventInfo, parseAttributes } from "./utils";

function isPublishEvent(propsObj?: Maybe<ActivityProperties>): boolean {
  if (propsObj && "attributes" in propsObj && "old" in propsObj) {
    const atts = parseAttributes(propsObj.attributes);
    const old = parseAttributes(propsObj.old);
    if ("published_at" in atts && "published_at" in old) {
      return typeof atts.published_at === "string" && !old.published_at;
    }
  }

  return false;
}

function updatedAfterPublish(
  createdAt?: Maybe<Scalars["DateTime"]["output"]>,
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>,
): boolean {
  if (!publishedAt || !createdAt) return false;
  return isAfter(parseDateTimeUtc(createdAt), parseDateTimeUtc(publishedAt));
}

interface PoolActivityItemProps
  extends Omit<ActivityItemProps, "info" | "properties"> {
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
}

const PoolActivityItem = ({
  publishedAt,
  query,
  ...rest
}: PoolActivityItemProps) => {
  const item = getFragment(ActivityItem_Fragment, query);
  const isAfterPublish = updatedAfterPublish(item.createdAt, publishedAt);
  let info = getEventInfo(item.properties, item.event);

  if (!info) {
    return null;
  }

  if (isPublishEvent(item.properties)) {
    info = {
      ...info,
      icon: DocumentArrowUpIcon,
      color: "success",
    };
  }

  if (item.event === "updated" && isAfterPublish) {
    info = {
      ...info,
      message: activityMessages.updated,
      icon: ExclamationTriangleIcon,
      color: "warning",
    };
  }

  return <ActivityItem info={info} query={query} {...rest} />;
};

export default PoolActivityItem;
