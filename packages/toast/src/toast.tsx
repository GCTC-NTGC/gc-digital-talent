import { toast as toastify, ToastOptions } from "react-toastify";
import { ReactNode } from "react";

import ToastAlert from "./components/ToastAlert/ToastAlert";

const toast = {
  success: (message: ReactNode, options?: ToastOptions) =>
    toastify.success(<ToastAlert type="success">{message}</ToastAlert>, {
      icon: false,
      ...options,
    }),
  error: (message: ReactNode, options?: ToastOptions) =>
    toastify.error(<ToastAlert type="error">{message}</ToastAlert>, {
      icon: false,
      ...options,
    }),
  warning: (message: ReactNode, options?: ToastOptions) =>
    toastify.warning(<ToastAlert type="warning">{message}</ToastAlert>, {
      icon: false,
      ...options,
    }),
  info: (message: ReactNode, options?: ToastOptions) =>
    toastify.info(<ToastAlert type="info">{message}</ToastAlert>, {
      icon: false,
      ...options,
    }),
};

export default toast;
