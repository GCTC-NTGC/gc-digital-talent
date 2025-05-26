import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import { ReactNode } from "react";

import { uiMessages } from "@gc-digital-talent/i18n";

import { IconType } from "../../types";
import { AlertType } from "./types";

export const iconMap: Record<AlertType, IconType> = {
  success: CheckCircleIcon,
  info: BellAlertIcon,
  warning: ExclamationCircleIcon,
  error: ExclamationTriangleIcon,
};

export const getAlertLevelTitle = (type: AlertType, intl: IntlShape) => {
  const alertLevelTitles = new Map<AlertType, ReactNode>([
    ["success", intl.formatMessage(uiMessages.successAlert)],
    ["warning", intl.formatMessage(uiMessages.warningAlert)],
    ["error", intl.formatMessage(uiMessages.errorAlert)],
    ["info", intl.formatMessage(uiMessages.infoAlert)],
  ]);

  return alertLevelTitles.get(type);
};
