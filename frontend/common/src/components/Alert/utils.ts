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
      "base(all, 0.25rem, solid, darker.tm-green) base:dark(all, 0.25rem, solid, lightest.tm-green)",
  },
  warning: {
    "data-h2-border":
      "base(all, 0.25rem, solid, darker.tm-yellow) base:dark(all, 0.25rem, solid, lightest.tm-yellow)",
  },
  info: {
    "data-h2-border":
      "base(all, 0.25rem, solid, darker.tm-blue) base:dark(all, 0.25rem, solid, lightest.tm-blue)",
  },
  error: {
    "data-h2-border":
      "base(all, 0.25rem, solid, darker.tm-red) base:dark(all, 0.25rem, solid, lightest.tm-red)",
  },
};

export const dismissStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.tm-green) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.tm-green)  base:focus-visible(black)",
  },
  warning: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.tm-yellow) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.tm-yellow)  base:focus-visible(black)",
  },
  info: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.tm-blue) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.tm-blue)  base:focus-visible(black)",
  },
  error: {
    "data-h2-background-color":
      "base(transparent) base:hover(lightest.tm-red) base:focus-visible(light.tm-yellow)",
    "data-h2-color":
      "base:(inherit) base:hover(darker.tm-red)  base:focus-visible(black)",
  },
};

export const separatorStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-background-color":
      "base(darker.tm-green) base:dark(lightest.tm-green)",
  },
  warning: {
    "data-h2-background-color":
      "base(darker.tm-yellow) base:dark(lightest.tm-yellow)",
  },
  info: {
    "data-h2-background-color":
      "base(darker.tm-blue) base:dark(lightest.tm-blue)",
  },
  error: {
    "data-h2-background-color":
      "base(darker.tm-red) base:dark(lightest.tm-red)",
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
    "data-h2-background-color": "base(lightest.tm-green)",
    "data-h2-color": "base(darker.tm-green)",
  },
  warning: {
    "data-h2-background-color": "base(lightest.tm-yellow)",
    "data-h2-color": "base(darker.tm-yellow)",
  },
  info: {
    "data-h2-background-color": "base(lightest.tm-blue)",
    "data-h2-color": "base(darker.tm-blue)",
  },
  error: {
    "data-h2-background-color": "base(lightest.tm-red)",
    "data-h2-color": "base(darker.tm-red)",
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
