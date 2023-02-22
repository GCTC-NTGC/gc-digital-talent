import React from "react";
import { IntlShape } from "react-intl";
import {
  CheckCircleIcon,
  EyeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import { uiMessages } from "@gc-digital-talent/i18n";

import { AlertType } from "./types";

export const styleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-border":
      "base(0.25rem solid success.darker) base:dark(0.25rem solid success.lightest)",
  },
  warning: {
    "data-h2-border":
      "base(0.25rem solid warning.darker) base:dark(0.25rem solid warning.lightest)",
  },
  info: {
    "data-h2-border":
      "base(0.25rem solid secondary.darker) base:dark(0.25rem solid secondary.lightest)",
  },
  error: {
    "data-h2-border":
      "base(0.25rem solid error.darker) base:dark(0.25rem solid error.lightest)",
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

export const separatorStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color":
      "base(success.darker) base:dark(success.lightest)",
  },
  warning: {
    "data-h2-background-color":
      "base(warning.darker) base:dark(warning.lightest)",
  },
  info: {
    "data-h2-background-color":
      "base(secondary.darker) base:dark(secondary.lightest)",
  },
  error: {
    "data-h2-background-color": "base(error.darker) base:dark(error.lightest)",
  },
};

export const iconMap: Record<
  AlertType,
  React.FC<React.SVGAttributes<SVGSVGElement>>
> = {
  success: CheckCircleIcon,
  info: EyeIcon,
  warning: ExclamationCircleIcon,
  error: ExclamationTriangleIcon,
};

export const iconStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color": "base(success.lightest)",
    "data-h2-color": "base(success.darker)",
  },
  warning: {
    "data-h2-background-color": "base(warning.lightest)",
    "data-h2-color": "base(warning.darker)",
  },
  info: {
    "data-h2-background-color": "base(secondary.lightest)",
    "data-h2-color": "base(secondary.darker)",
  },
  error: {
    "data-h2-background-color": "base(error.lightest)",
    "data-h2-color": "base(error.darker)",
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
