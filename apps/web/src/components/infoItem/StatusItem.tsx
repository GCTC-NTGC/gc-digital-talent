import * as React from "react";

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
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
        />
      );
    default:
      return <BaseInfoItem title={title} titleHref={titleHref} />;
  }
};
