import React from "react";
import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";

import { uiMessages } from "@gc-digital-talent/i18n";

import { AlertType } from "./types";
import { IconType } from "../../types";

export const styleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-border": "base(3px solid success.darker)",
  },
  warning: {
    "data-h2-border": "base(3px solid warning.darker)",
  },
  info: {
    "data-h2-border": "base(3px solid secondary.darker)",
  },
  error: {
    "data-h2-border": "base(3px solid error.darker)",
  },
};

export const dismissStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color":
      "base(transparent) base:hover(success.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(success.darker)  base:focus-visible(black)",
  },
  warning: {
    "data-h2-background-color":
      "base(transparent) base:hover(warning.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(warning.darker)  base:focus-visible(black)",
  },
  info: {
    "data-h2-background-color":
      "base(transparent) base:hover(secondary.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(secondary.darker)  base:focus-visible(black)",
  },
  error: {
    "data-h2-background-color":
      "base(transparent) base:hover(error.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(error.darker)  base:focus-visible(black)",
  },
};

export const iconMap: Record<AlertType, IconType> = {
  success: CheckCircleIcon,
  info: BellAlertIcon,
  warning: ExclamationCircleIcon,
  error: ExclamationTriangleIcon,
};

export const iconStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color": "base:all(success.lightest)",
    "data-h2-color": "base:all(success.darker)",
  },
  warning: {
    "data-h2-background-color": "base:all(warning.lightest)",
    "data-h2-color": "base:all(warning.darker)",
  },
  info: {
    "data-h2-background-color": "base:all(secondary.lightest)",
    "data-h2-color": "base:all(secondary.darker)",
  },
  error: {
    "data-h2-background-color": "base:all(error.lightest)",
    "data-h2-color": "base:all(error.darker)",
  },
};

export const getAlertLevelTitle = (type: AlertType, intl: IntlShape) => {
  const alertLevelTitles = new Map<AlertType, React.ReactNode>([
    ["success", intl.formatMessage(uiMessages.successAlert)],
    ["warning", intl.formatMessage(uiMessages.warningAlert)],
    ["error", intl.formatMessage(uiMessages.errorAlert)],
    ["info", intl.formatMessage(uiMessages.infoAlert)],
  ]);

  return alertLevelTitles.get(type);
};
