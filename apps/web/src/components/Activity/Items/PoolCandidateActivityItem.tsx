import type { ReactNode } from "react";
import UserMinusIcon from "@heroicons/react/16/solid/UserMinusIcon";
import UserPlusIcon from "@heroicons/react/16/solid/UserPlusIcon";
import { useIntl, type IntlShape } from "react-intl";

import type { ActivityProperties } from "@gc-digital-talent/graphql";
import { ActivityEvent, getFragment } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocale,
  type Locales,
} from "@gc-digital-talent/i18n";

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

function getDescriptionForSpecialApplicationCreated(
  intl: IntlShape,
  locale: Locales,
  propsObj?: ActivityProperties | null,
): string | null {
  if (propsObj && "attributes" in propsObj) {
    const atts = parseAttributes(propsObj.attributes);

    // compute values to use
    let targetUser = intl.formatMessage(commonMessages.notFound);
    if ("user_name" in atts && typeof atts.user_name === "string") {
      targetUser = atts.user_name;
    }
    let specialApplicationType = intl.formatMessage(commonMessages.notFound);
    if (
      "special_application_type_en" in atts &&
      typeof atts.special_application_type_en === "string" &&
      locale === "en"
    ) {
      specialApplicationType = atts.special_application_type_en;
    }
    if (
      "special_application_type_fr" in atts &&
      typeof atts.special_application_type_fr === "string" &&
      locale === "fr"
    ) {
      specialApplicationType = atts.special_application_type_fr;
    }
    let specialClosingDate = intl.formatMessage(commonMessages.notFound);
    if (
      "special_application_closing_date" in atts &&
      typeof atts.special_application_closing_date === "string"
    ) {
      specialClosingDate = atts.special_application_closing_date;
    }

    return intl.formatMessage(
      {
        defaultMessage:
          "A special application, {specialApplicationType}, closes on {specialApplicationClosing}, for <strong>{name}</strong>",
        id: "AvVMJK",
        description: "Event description when application is submitted",
      },
      {
        specialApplicationType: specialApplicationType,
        specialApplicationClosing: specialClosingDate,
        name: targetUser,
      },
    );
  }

  return null;
}

function getDescriptionForSpecialApplicationSubmitted(
  intl: IntlShape,
  locale: Locales,
  propsObj?: ActivityProperties | null,
): string | null {
  if (propsObj && "attributes" in propsObj) {
    const atts = parseAttributes(propsObj.attributes);

    // compute values to use
    let specialApplicationType = intl.formatMessage(commonMessages.notFound);
    if (
      "special_application_type_en" in atts &&
      typeof atts.special_application_type_en === "string" &&
      locale === "en"
    ) {
      specialApplicationType = atts.special_application_type_en;
    }
    if (
      "special_application_type_fr" in atts &&
      typeof atts.special_application_type_fr === "string" &&
      locale === "fr"
    ) {
      specialApplicationType = atts.special_application_type_fr;
    }

    return intl.formatMessage(
      {
        defaultMessage: "A special application, {specialApplicationType},",
        id: "y9IhRa",
        description: "Event description when application is submitted",
      },
      {
        specialApplicationType: specialApplicationType,
      },
    );
  }

  return null;
}

const PoolCandidateActivityItem = ({
  query,
  ...rest
}: PoolCandidateActivityItemProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
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
  } else if (item?.event === ActivityEvent.SpecialApplicationCreated) {
    description = getDescriptionForSpecialApplicationCreated(
      intl,
      locale,
      item?.properties,
    );
  } else if (item?.event === ActivityEvent.SpecialApplicationSubmitted) {
    description = getDescriptionForSpecialApplicationSubmitted(
      intl,
      locale,
      item?.properties,
    );
  }

  return (
    <BaseItem info={info} query={query} description={description} {...rest} />
  );
};

export default PoolCandidateActivityItem;
