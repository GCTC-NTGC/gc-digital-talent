import { IntlShape } from "react-intl";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import { ReactNode } from "react";

import { uiMessages } from "@gc-digital-talent/i18n";

import { IconType } from "../../types";
import { AlertType } from "./types";

export const styleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-border":
      "base(3px solid success.darker) base:dark(3px solid success.lightest)",
  },
  warning: {
    "data-h2-border":
      "base(3px solid warning.darker) base:dark(3px solid warning.lightest)",
  },
  info: {
    "data-h2-border":
      "base(3px solid secondary.darker) base:dark(3px solid secondary.lightest)",
  },
  error: {
    "data-h2-border":
      "base(3px solid error.darker) base:dark(3px solid error.lightest)",
  },
};

export const dismissStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color":
      "base(transparent) base:hover(success.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(success.darker)  base:all:focus-visible(black)",
  },
  warning: {
    "data-h2-background-color":
      "base(transparent) base:hover(warning.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(warning.darker)  base:all:focus-visible(black)",
  },
  info: {
    "data-h2-background-color":
      "base(transparent) base:hover(secondary.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(secondary.darker)  base:all:focus-visible(black)",
  },
  error: {
    "data-h2-background-color":
      "base(transparent) base:hover(error.lightest) base:focus-visible(focus.light)",
    "data-h2-color":
      "base:(inherit) base:hover(error.darker)  base:all:focus-visible(black)",
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
    "data-h2-border-color":
      "base:selectors[::after](transparent transparent transparent rgba(var(--h2-color-success-lightest-locked), 1))",
  },
  warning: {
    "data-h2-background-color": "base:all(warning.lightest)",
    "data-h2-color": "base:all(warning.darker)",
    "data-h2-border-color":
      "base:selectors[::after](transparent transparent transparent rgba(var(--h2-color-warning-lightest-locked), 1))",
  },
  info: {
    "data-h2-background-color": "base:all(secondary.lightest)",
    "data-h2-color": "base:all(secondary.darker)",
    "data-h2-border-color":
      "base:selectors[::after](transparent transparent transparent rgba(var(--h2-color-secondary-lightest-locked), 1))",
  },
  error: {
    "data-h2-background-color": "base:all(error.lightest)",
    "data-h2-color": "base:all(error.darker)",
    "data-h2-border-color":
      "base:selectors[::after](transparent transparent transparent rgba(var(--h2-color-error-lightest-locked), 1))",
  },
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
