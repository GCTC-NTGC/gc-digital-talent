import React from "react";
import {
  CheckCircleIcon,
  EyeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import { AlertType } from "./Alert";

export const styleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-border": "base(all, 0.25rem, solid, dark.tm-green)",
  },
  warning: {
    "data-h2-border": "base(all, 0.25rem, solid, dark.tm-yellow)",
  },
  info: {
    "data-h2-border": "base(all, 0.25rem, solid, dark.tm-blue)",
  },
  error: {
    "data-h2-border": "base(all, 0.25rem, solid, dark.tm-red)",
  },
};

export const dismissStyleMap: Record<AlertType, Record<string, string>> = {
  success: {
    "data-h2-border":
      "base(all, x.10, solid, transparent) base:focus-visible(all, x.10, solid, dark.tm-green)",
  },
  warning: {
    "data-h2-border":
      "base(all, x.10, solid, transparent) base:focus-visible(all, x.10, solid, dark.tm-yellow)",
  },
  info: {
    "data-h2-border":
      "base(all, x.10, solid, transparent) base:focus-visible(all, x.10, solid, dark.tm-blue)",
  },
  error: {
    "data-h2-border":
      "base(all, x.10, solid, transparent) base:focus-visible(all, x.10, solid, dark.tm-red)",
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
    "data-h2-background-color": "base(light.tm-green)",
    "data-h2-color": "base(dark.tm-green)",
  },
  warning: {
    "data-h2-background-color": "base(light.tm-yellow)",
    "data-h2-color": "base(dark.tm-yellow)",
  },
  info: {
    "data-h2-background-color": "base(light.tm-blue)",
    "data-h2-color": "base(dark.tm-blue)",
  },
  error: {
    "data-h2-background-color": "base(light.tm-red)",
    "data-h2-color": "base(dark.tm-red)",
  },
};
