import { MessageDescriptor, useIntl } from "react-intl";
import { tv } from "tailwind-variants";
import { ReactNode } from "react";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  TIME_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { getLogger } from "@gc-digital-talent/logger";

import { getFullNameLabel } from "~/utils/nameUtils";

import { ActivityEventInfo, icon, normalizePropKeys } from "./utils";

const activityItem = tv({
  base: "flex flex-col justify-between gap-6 border-gray-200 py-6 not-first:border-t-2 sm:flex-row dark:border-gray-500",
});

export const BaseItem_Fragment = graphql(/** GraphQL */ `
  fragment BaseActivityItem on Activity {
    id
    causer {
      id
      firstName
      lastName
    }
    properties {
      old
      attributes
    }
    event
    createdAt
  }
`);

export interface CommonItemProps {
  query?: FragmentType<typeof BaseItem_Fragment>;
  className?: string;
  keyMap?: Map<string, MessageDescriptor>;
}

interface BaseItemProps extends CommonItemProps {
  info: ActivityEventInfo;
  // Pass in custom description
  // If nothing passed, it will use the properties
  description?: ReactNode;
}

const BaseItem = ({
  query,
  className,
  info,
  keyMap,
  description,
}: BaseItemProps) => {
  const intl = useIntl();
  const logger = getLogger();
  const item = getFragment(BaseItem_Fragment, query);

  if (!info) {
    return null;
  }

  const Icon = info.icon;
  let desc = description;
  if (!desc) {
    const properties = normalizePropKeys(
      intl,
      item?.properties,
      keyMap,
      logger,
    );

    desc =
      properties.length > 0
        ? properties.join(", ")
        : intl.formatMessage(commonMessages.notAvailable);
  }

  return (
    <li className={activityItem({ class: className })}>
      <div className="flex items-start gap-3">
        <div className={icon({ color: info.color })}>
          <Icon className="size-full" />
        </div>
        <span>
          {intl.formatMessage(info.message, {
            name: getFullNameLabel(
              item?.causer?.firstName,
              item?.causer?.lastName,
              intl,
            ),
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {desc}
        </span>
      </div>
      <div className="shrink-0 pl-8.5 text-gray-600 sm:pl-0 dark:text-gray-200">
        {item?.createdAt
          ? formatDate({
              date: parseDateTimeUtc(item.createdAt),
              formatString: TIME_FORMAT_LOCALIZED,
              intl,
            })
          : intl.formatMessage(commonMessages.notAvailable)}
      </div>
    </li>
  );
};

export default BaseItem;
