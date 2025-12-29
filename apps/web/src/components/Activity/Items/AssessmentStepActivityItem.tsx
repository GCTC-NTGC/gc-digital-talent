import { ReactNode } from "react";
import { useIntl } from "react-intl";

import {
  ActivityProperties,
  getFragment,
  Maybe,
} from "@gc-digital-talent/graphql";
import { getLocale, Locales } from "@gc-digital-talent/i18n";

import BaseItem, {
  BaseItem_Fragment,
  CommonItemProps,
} from "./BaseActivityItem";
import { getDeepAttribute, getEventInfo, parseAttributes } from "./utils";

export type AssessmentStepActivityItemProps = CommonItemProps;

function getDescription(
  locale: Locales,
  propsObj?: Maybe<ActivityProperties>,
): ReactNode {
  let desc: ReactNode;
  if (propsObj) {
    if ("attributes" in propsObj) {
      const atts = parseAttributes(propsObj.attributes);
      desc = getDeepAttribute(atts, "name", locale);
    }

    if (!desc && "old" in propsObj) {
      const old = parseAttributes(propsObj.old);
      desc = getDeepAttribute(old, "name", locale);
    }

    return desc;
  }

  return null;
}

const AssessmentStepActivityItem = ({
  query,
  ...rest
}: AssessmentStepActivityItemProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const item = getFragment(BaseItem_Fragment, query);
  const info = getEventInfo(item?.event);

  if (!info) {
    return null;
  }

  return (
    <BaseItem
      info={info}
      query={query}
      description={getDescription(locale, item?.properties)}
      {...rest}
    />
  );
};

export default AssessmentStepActivityItem;
