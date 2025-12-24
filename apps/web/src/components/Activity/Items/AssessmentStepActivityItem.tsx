import {
  getFragment,
} from "@gc-digital-talent/graphql";

import BaseItem, {
  BaseItem_Fragment,
  CommonItemProps,
} from "./BaseActivityItem";
import { getEventInfo } from "./utils";

export type AssessmentStepActivityItemProps = CommonItemProps;

const AssessmentStepActivityItem = ({
  query,
  ...rest
}: AssessmentStepActivityItemProps) => {
  const item = getFragment(BaseItem_Fragment, query);
  const info = getEventInfo(item?.event);

  if (!info) {
    return null;
  }

  return <BaseItem info={info} query={query} {...rest} />;
};

export default AssessmentStepActivityItem;
