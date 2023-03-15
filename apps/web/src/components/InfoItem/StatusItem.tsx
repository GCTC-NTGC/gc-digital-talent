import * as React from "react";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { useIntl } from "react-intl";
import { commonMessages } from "@gc-digital-talent/i18n";
import { BaseInfoItem } from "./BaseInfoItem";

export type Status = "default" | "error" | "partial" | "success";

export interface StatusItemProps {
  title: string;
  subTitle?: string;
  status?: Status;
  titleHref?: string;
}

export const StatusItem = ({
  title,
  subTitle,
  status = "default",
  titleHref,
}: StatusItemProps) => {
  const intl = useIntl();
  switch (status) {
    case "error":
      return (
        <BaseInfoItem
          icon={ExclamationCircleIcon}
          iconColor="error"
          title={title}
          titleColor="error"
          subTitle={subTitle}
          subTitleColor="error"
          titleHref={titleHref}
          hiddenContextPrefix={intl.formatMessage(commonMessages.error)}
        />
      );
    case "partial":
      return (
        <BaseInfoItem
          icon={CheckCircleIcon}
          title={title}
          subTitle={subTitle}
          subTitleColor="default"
          titleHref={titleHref}
          hiddenContextPrefix={intl.formatMessage(commonMessages.partial)}
        />
      );
    case "success":
      return (
        <BaseInfoItem
          icon={CheckCircleIcon}
          title={title}
          subTitle={subTitle}
          subTitleColor="success"
          titleHref={titleHref}
          hiddenContextPrefix={intl.formatMessage(commonMessages.success)}
        />
      );
    default:
      return <BaseInfoItem title={title} titleHref={titleHref} />;
  }
};
