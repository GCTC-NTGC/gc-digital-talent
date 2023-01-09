import React from "react";
import { IntlShape } from "react-intl";
import {
  CheckCircleIcon,
  EyeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import { AlertType } from "./Alert";

export const styleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-border":
      "base(0.25rem solid tm-green.darker) base:dark(0.25rem solid tm-green.lightest)",
  },
  warning: {
    "data-h2-border":
      "base(0.25rem solid tm-yellow.darker) base:dark(0.25rem solid tm-yellow.lightest)",
  },
  info: {
    "data-h2-border":
      "base(0.25rem solid tm-blue.darker) base:dark(0.25rem solid tm-blue.lightest)",
  },
  error: {
    "data-h2-border":
      "base(0.25rem solid tm-red.darker) base:dark(0.25rem solid tm-red.lightest)",
  },
};

export const dismissStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color":
      "base(transparent) base:hover(tm-green.lightest) base:focus-visible(tm-yellow.light)",
    "data-h2-color":
      "base:(inherit) base:hover(tm-green.darker)  base:focus-visible(black)",
  },
  warning: {
    "data-h2-background-color":
      "base(transparent) base:hover(tm-yellow.lightest) base:focus-visible(tm-yellow.light)",
    "data-h2-color":
      "base:(inherit) base:hover(tm-yellow.darker)  base:focus-visible(black)",
  },
  info: {
    "data-h2-background-color":
      "base(transparent) base:hover(tm-blue.lightest) base:focus-visible(tm-yellow.light)",
    "data-h2-color":
      "base:(inherit) base:hover(tm-blue.darker)  base:focus-visible(black)",
  },
  error: {
    "data-h2-background-color":
      "base(transparent) base:hover(tm-red.lightest) base:focus-visible(tm-yellow.light)",
    "data-h2-color":
      "base:(inherit) base:hover(tm-red.darker)  base:focus-visible(black)",
  },
};

export const separatorStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color":
      "base(tm-green.darker) base:dark(tm-green.lightest)",
  },
  warning: {
    "data-h2-background-color":
      "base(tm-yellow.darker) base:dark(tm-yellow.lightest)",
  },
  info: {
    "data-h2-background-color":
      "base(tm-blue.darker) base:dark(tm-blue.lightest)",
  },
  error: {
    "data-h2-background-color":
      "base(tm-red.darker) base:dark(tm-red.lightest)",
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
    "data-h2-background-color": "base(tm-green.lightest)",
    "data-h2-color": "base(tm-green.darker)",
  },
  warning: {
    "data-h2-background-color": "base(tm-yellow.lightest)",
    "data-h2-color": "base(tm-yellow.darker)",
  },
  info: {
    "data-h2-background-color": "base(tm-blue.lightest)",
    "data-h2-color": "base(tm-blue.darker)",
  },
  error: {
    "data-h2-background-color": "base(tm-red.lightest)",
    "data-h2-color": "base(tm-red.darker)",
  },
};

export const getAlertLevelTitle = (type: AlertType, intl: IntlShape) => {
  const alertLevelTitles = new Map<AlertType, React.ReactNode>([
    [
      "success",
      intl.formatMessage({
        defaultMessage: "Success alert:",
        id: "Ss95s5",
        description: "Descriptor for a success alert",
      }),
    ],
    [
      "warning",
      intl.formatMessage({
        defaultMessage: "Warning alert:",
        id: "6iZHGg",
        description: "Descriptor for a warning alert",
      }),
    ],
    [
      "error",
      intl.formatMessage({
        defaultMessage: "Error alert:",
        id: "oSa0Aa",
        description: "Descriptor for an error alert",
      }),
    ],
    [
      "info",
      intl.formatMessage({
        defaultMessage: "Info alert:",
        id: "vGENdP",
        description: "Descriptor for an info alert",
      }),
    ],
  ]);

  return alertLevelTitles.get(type);
};
