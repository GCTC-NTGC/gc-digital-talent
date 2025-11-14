import { toast as toastify, ToastOptions } from "react-toastify/unstyled";

import ToastAlert, {
  type ToastMessage,
} from "./components/ToastAlert/ToastAlert";

const toast = {
  success: (message: ToastMessage, options?: ToastOptions) =>
    toastify.success(<ToastAlert message={message} color="success" />, {
      icon: false,
      ...options,
    }),
  error: (message: ToastMessage, options?: ToastOptions) =>
    toastify.error(<ToastAlert message={message} color="error" />, {
      icon: false,
      ...options,
    }),
  warning: (message: ToastMessage, options?: ToastOptions) =>
    toastify.warning(<ToastAlert message={message} color="warning" />, {
      icon: false,
      ...options,
    }),
  info: (message: ToastMessage, options?: ToastOptions) =>
    toastify.info(<ToastAlert message={message} color="gray" />, {
      icon: false,
      ...options,
    }),
};

export default toast;
