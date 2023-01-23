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
      "base(0.25rem solid warning.darker) base:dark(0.25rem solid warning.lightest)",
  },
  info: {
    "data-h2-border":
      "base(0.25rem solid secondary.darker) base:dark(0.25rem solid secondary.lightest)",
  },
  error: {
    "data-h2-border":
      "base(0.25rem solid tertiary.darker) base:dark(0.25rem solid tertiary.lightest)",
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
      "base(transparent) base:hover(warning.lightest) base:focus-visible(warning.light)",
    "data-h2-color":
      "base:(inherit) base:hover(warning.darker)  base:focus-visible(black)",
  },
  info: {
    "data-h2-background-color":
      "base(transparent) base:hover(secondary.lightest) base:focus-visible(tm-yellow.light)",
    "data-h2-color":
      "base:(inherit) base:hover(secondary.darker)  base:focus-visible(black)",
  },
  error: {
    "data-h2-background-color":
      "base(transparent) base:hover(tertiary.lightest) base:focus-visible(tm-yellow.light)",
    "data-h2-color":
      "base:(inherit) base:hover(tertiary.darker)  base:focus-visible(black)",
  },
};

export const separatorStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color":
      "base(tm-green.darker) base:dark(tm-green.lightest)",
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
    "data-h2-background-color":
      "base(tertiary.darker) base:dark(tertiary.lightest)",
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
    "data-h2-background-color": "base(warning.lightest)",
    "data-h2-color": "base(warning.darker)",
  },
  info: {
    "data-h2-background-color": "base(secondary.lightest)",
    "data-h2-color": "base(secondary.darker)",
  },
  error: {
    "data-h2-background-color": "base(tertiary.lightest)",
    "data-h2-color": "base(tertiary.darker)",
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
