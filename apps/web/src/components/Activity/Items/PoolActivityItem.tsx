import ExclamationTriangleIcon from "@heroicons/react/16/solid/ExclamationTriangleIcon";
import { isAfter } from "date-fns/isAfter";
import { defineMessage, MessageDescriptor, useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  ActivityEvent,
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

import BaseItem, {
  BaseItem_Fragment,
  CommonItemProps,
} from "./BaseActivityItem";
import { getEventInfo } from "./utils";

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

export interface PoolActivityItemProps extends CommonItemProps {
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
}

const PoolActivityItem = ({
  publishedAt,
  query,
  ...rest
}: PoolActivityItemProps) => {
  const intl = useIntl();
  const item = getFragment(BaseItem_Fragment, query);
  const isAfterPublish = updatedAfterPublish(item?.createdAt, publishedAt);
  let info = getEventInfo(item?.event);

  if (!info) {
    return null;
  }

  let description: ReactNode | undefined;
  if (item?.event === ActivityEvent.Published) {
    description = intl.formatMessage(processMessages.process);
  }

  if (item?.event === ActivityEvent.Updated && isAfterPublish) {
    info = {
      ...info,
      message: activityMessages.updated,
      icon: ExclamationTriangleIcon,
      color: "warning",
    };
  }

  return (
    <BaseItem
      info={info}
      query={query}
      keyMap={keyMap}
      description={description}
      {...rest}
    />
  );
};

export default PoolActivityItem;
