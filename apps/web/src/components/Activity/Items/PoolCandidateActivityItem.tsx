import type { ReactNode } from "react";
import UserMinusIcon from "@heroicons/react/16/solid/UserMinusIcon";
import UserPlusIcon from "@heroicons/react/16/solid/UserPlusIcon";
import { useIntl } from "react-intl";

import type { ActivityProperties } from "@gc-digital-talent/graphql";
import { ActivityEvent, getFragment } from "@gc-digital-talent/graphql";

import type { CommonItemProps } from "./BaseActivityItem";
import BaseItem, { BaseItem_Fragment } from "./BaseActivityItem";
import { getEventInfo, parseAttributes } from "./utils";

type PoolCandidateActivityItemProps = CommonItemProps;

function getDescription(propsObj?: ActivityProperties | null): ReactNode {
  if (propsObj && "attributes" in propsObj) {
    const atts = parseAttributes(propsObj.attributes);
    if ("user_name" in atts && typeof atts.user_name === "string") {
      return <strong>{atts.user_name}</strong>;
    }
  }

  return null;
}

const PoolCandidateActivityItem = ({
  query,
  ...rest
}: PoolCandidateActivityItemProps) => {
  const intl = useIntl();
  const item = getFragment(BaseItem_Fragment, query);
  const info = getEventInfo(item?.event);

  if (!info) {
    return null;
  }

  let description = getDescription(item?.properties);
  if (item?.event === ActivityEvent.Added) {
    info.icon = UserPlusIcon;
  } else if (item?.event === ActivityEvent.Removed) {
    info.icon = UserMinusIcon;
  } else if (item?.event === ActivityEvent.Submitted) {
    description = intl.formatMessage({
      defaultMessage: "A new application",
      id: "5HSzQ4",
      description: "Event description when application is submitted",
    });
  }

  return (
    <BaseItem info={info} query={query} description={description} {...rest} />
  );
};

export default PoolCandidateActivityItem;
