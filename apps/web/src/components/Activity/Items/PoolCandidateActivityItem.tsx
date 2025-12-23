import { ReactNode } from "react";

import { ActivityProperties, getFragment, Maybe } from "@gc-digital-talent/graphql";

import BaseItem, {
  BaseItem_Fragment,
  CommonItemProps
} from "./BaseActivityItem";
import { getEventInfo, parseAttributes } from "./utils";

export type PoolCandidateActivityItemProps = CommonItemProps;

function getDescription(propsObj?: Maybe<ActivityProperties>): ReactNode {
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
  const item = getFragment(BaseItem_Fragment, query);
  const info = getEventInfo(item?.event);

  if (!info) {
    return null;
  }

  return <BaseItem info={info} query={query} description={getDescription(item?.properties)} {...rest} />;
};

export default PoolCandidateActivityItem;
