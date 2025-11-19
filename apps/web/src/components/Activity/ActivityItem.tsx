import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import { getFullNameLabel } from "~/utils/nameUtils";

import { getEventInfo, icon, JSONRecord, normalizePropKeys } from "./utils";

const activityItem = tv({
  base: "flex flex-col justify-between gap-6 py-6 sm:flex-row",
  variants: {
    border: {
      true: "border-t-2 border-gray-200 dark:border-gray-500",
      false: "",
    },
  },
});

const ActivityItem_Fragment = graphql(/** GraphQL */ `
  fragment ActivityItem on Activity {
    id
    causer {
      id
      firstName
      lastName
    }
    properties
    event
    createdAt
  }
`);

interface ActivityItemProps {
  query: FragmentType<typeof ActivityItem_Fragment>;
  className?: string;
  border?: boolean;
}

const ActivityItem = ({ query, className, border }: ActivityItemProps) => {
  const intl = useIntl();
  const item = getFragment(ActivityItem_Fragment, query);
  const propsObj = JSON.parse(String(item.properties)) as JSONRecord;
  const info = getEventInfo(propsObj, item.event);
  const properties = normalizePropKeys(propsObj, intl);

  if (!info) {
    return null;
  }

  const Icon = info.icon;

  return (
    <div className={activityItem({ class: className, border })}>
      <div className="flex items-start gap-3">
        <div className={icon({ color: info.color })}>
          <Icon className="size-full" />
        </div>
        <span>
          {intl.formatMessage(info.message, {
            name: getFullNameLabel(
              item.causer?.firstName,
              item.causer?.lastName,
              intl,
            ),
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {properties.join(", ")}
        </span>
      </div>
      <div className="shrink-0 pl-8.5 text-gray-600 sm:pl-0 dark:text-gray-200">
        {item.createdAt
          ? formatDate({
              date: parseDateTimeUtc(item.createdAt),
              formatString: "PPP • p",
              intl,
            })
          : intl.formatMessage(commonMessages.notAvailable)}
      </div>
    </div>
  );
};

export default ActivityItem;
