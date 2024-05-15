import * as React from "react";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import BellAlertIcon from "@heroicons/react/24/outline/BellAlertIcon";
import ExclamationCircleIcon from "@heroicons/react/24/outline/ExclamationCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import { toast as toastify, ToastOptions } from "react-toastify";

import ToastMessage from "./components/ToastMessage/ToastMessage";

const iconStyles = {
  "data-h2-width": "base(x1.5)",
  "data-h2-stroke-width": "base(2px)",
  "data-h2-margin": "p-tablet(x.2, 0, 0, 0)",
};

const toast = {
  success: (message: React.ReactNode, options?: ToastOptions) =>
    toastify.success(<ToastMessage>{message}</ToastMessage>, {
      icon: <CheckCircleIcon {...iconStyles} />,
      ...options,
    }),
  error: (message: React.ReactNode, options?: ToastOptions) =>
    toastify.error(<ToastMessage>{message}</ToastMessage>, {
      icon: <ExclamationTriangleIcon {...iconStyles} />,
      ...options,
    }),
  warning: (message: React.ReactNode, options?: ToastOptions) =>
    toastify.warning(<ToastMessage>{message}</ToastMessage>, {
      icon: <ExclamationCircleIcon {...iconStyles} />,
      ...options,
    }),
  info: (message: React.ReactNode, options?: ToastOptions) =>
    toastify.info(<ToastMessage>{message}</ToastMessage>, {
      icon: <BellAlertIcon {...iconStyles} />,
      ...options,
    }),
};

export default toast;
