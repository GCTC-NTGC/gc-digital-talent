import DocumentArrowUpIcon from "@heroicons/react/16/solid/DocumentArrowUpIcon";
import ExclamationTriangleIcon from "@heroicons/react/16/solid/ExclamationTriangleIcon";
import { isAfter } from "date-fns/isAfter";
import { defineMessage, MessageDescriptor } from "react-intl";

import {
  ActivityProperties,
  getFragment,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import activityMessages from "~/messages/activityMessages";
import adminMessages from "~/messages/adminMessages";
import jobPosterTemplateMessages from "~/messages/jobPosterTemplateMessages";
import processMessages from "~/messages/processMessages";

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

const keyMap = new Map<string, MessageDescriptor>([
  ["name", commonMessages.name],
  ["user_id", adminMessages.user],
  ["operational_requirements", navigationMessages.workPreferences],
  ["key_tasks", jobPosterTemplateMessages.keyTasks],
  ["closing_date", processMessages.closingDate],
  ["your_impact", processMessages.yourImpact],
  ["advertisement_location", processMessages.location],
  ["security_clearance", processMessages.securityRequirement],
  ["advertisement_language", processMessages.languageRequirement],
  [
    "is_remote",
    defineMessage({
      defaultMessage: "Remote",
      id: "4vScqR",
      description: "Label for when a position is remote",
    }),
  ],
  ["process_number", processMessages.processNumber],
  ["publishing_group", processMessages.publishingGroup],
  [
    "published_at",
    defineMessage({
      defaultMessage: "publication of the advertisement",
      id: "Lp13b8",
      description: "Message for publishing a process in the activity log",
    }),
  ],
  ["what_to_expect", processMessages.whatToExpectApplication],
  ["special_note", processMessages.specialNote],
  ["opportunity_length", processMessages.employmentDuration],
  ["what_to_expect_admission", processMessages.whatToExpectAdmission],
  ["about_us", processMessages.aboutUs],
  ["classification_id", processMessages.classification],
  ["closing_reason", processMessages.closingReason],
  ["change_justification", processMessages.changeJustification],
  ["department_id", commonMessages.department],
  ["community_id", adminMessages.community],
  ["area_of_selection", processMessages.areaOfSelection],
  [
    "selection_limitations",
    defineMessage({
      defaultMessage: "Selection limitations",
      id: "CprAHM",
      description: "Label for candidate selection limitations",
    }),
  ],
  ["work_stream_id", processMessages.stream],
  ["contact_email", commonMessages.email],
]);

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
  let info = getEventInfo(item.event);

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

  return <ActivityItem info={info} query={query} keyMap={keyMap} {...rest} />;
};

export default PoolActivityItem;
