import {
  getFragment,
} from "@gc-digital-talent/graphql";

import BaseActivityItem, {
  BaseActivityItem_Fragment,
  BaseActivityItemProps,
} from "./BaseActivityItem";
import { getEventInfo } from "./utils";

export type PoolSkillItemProps = Omit<
  BaseActivityItemProps,
  "info" | "properties"
>

const PoolSkillItem = ({
  query,
  ...rest
}: PoolSkillItemProps) => {
  const item = getFragment(BaseActivityItem_Fragment, query);
  const info = getEventInfo(item.event);

  console.log(item);

  if (!info) {
    return null;
  }

  return <BaseActivityItem info={info} query={query} {...rest} />;
};

export default PoolSkillItem;
