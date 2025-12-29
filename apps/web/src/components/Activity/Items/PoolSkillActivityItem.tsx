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

export type PoolSkillActivityItemProps = CommonItemProps;

function getDescription(
  locale: Locales,
  propsObj?: Maybe<ActivityProperties>,
): ReactNode {
  let desc: ReactNode;
  if (propsObj) {
    if ("attributes" in propsObj) {
      const atts = parseAttributes(propsObj.attributes);
      desc = getDeepAttribute(atts, "skill", locale);
    }

    if (!desc && "old" in propsObj) {
      const old = parseAttributes(propsObj.old);
      desc = getDeepAttribute(old, "skill", locale);
    }

    return desc;
  }

  return null;
}

const PoolSkillActivityItem = ({
  query,
  ...rest
}: PoolSkillActivityItemProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const item = getFragment(BaseItem_Fragment, query);
  const info = getEventInfo(item?.event);

  if (!info) {
    return null;
  }

  info.color = "primary";

  return (
    <BaseItem
      info={info}
      query={query}
      description={getDescription(locale, item?.properties)}
      {...rest}
    />
  );
};

export default PoolSkillActivityItem;
