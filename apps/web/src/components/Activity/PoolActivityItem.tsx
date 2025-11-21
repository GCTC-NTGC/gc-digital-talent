import DocumentArrowUpIcon from "@heroicons/react/16/solid/DocumentArrowUpIcon";
import ExclamationTriangleIcon from "@heroicons/react/16/solid/ExclamationTriangleIcon";
import { isAfter } from "date-fns/isAfter";

import { getFragment, Maybe, Scalars } from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import activityMessages from "~/messages/activityMessages";

import ActivityItem, {
  ActivityItem_Fragment,
  ActivityItemProps,
} from "./ActivityItem";
import { getEventInfo, JSONRecord } from "./utils";

function isPublishEvent(propsObj: JSONRecord): boolean {
  if ("attributes" in propsObj && "old" in propsObj) {
    if (
      "published_at" in propsObj.attributes &&
      "published_at" in propsObj.old
    ) {
      return (
        typeof propsObj.attributes.published_at === "string" &&
        !propsObj.old.published_at
      );
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
  const propsObj = JSON.parse(String(item.properties)) as JSONRecord;
  const isAfterPublish = updatedAfterPublish(item.createdAt, publishedAt);
  let info = getEventInfo(propsObj, item.event);

  if (!info) {
    return null;
  }

  if (isPublishEvent(propsObj)) {
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

  return (
    <ActivityItem info={info} query={query} properties={propsObj} {...rest} />
  );
};

export default PoolActivityItem;
