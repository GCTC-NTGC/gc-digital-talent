import React from "react";
import {
  CheckCircleIcon,
  EyeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast as toastify, ToastOptions } from "react-toastify";

import ToastMessage from "./components/ToastMessage/ToastMessage";

const iconStyles = {
  "data-h2-width": "base(x2)",
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
      icon: <EyeIcon {...iconStyles} />,
      ...options,
    }),
};

export default toast;
