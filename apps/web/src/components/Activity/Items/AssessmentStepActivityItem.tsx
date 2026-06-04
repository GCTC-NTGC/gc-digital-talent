import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import type { ActivityProperties } from "@gc-digital-talent/graphql";
import { getFragment } from "@gc-digital-talent/graphql";
import type { Locales } from "@gc-digital-talent/i18n";
import { getLocale } from "@gc-digital-talent/i18n";

import type { CommonItemProps } from "./BaseActivityItem";
import BaseItem, { BaseItem_Fragment } from "./BaseActivityItem";
import { getDeepAttribute, getEventInfo, parseAttributes } from "./utils";

type AssessmentStepActivityItemProps = CommonItemProps;

function getDescription(
  locale: Locales,
  propsObj?: ActivityProperties | null,
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
