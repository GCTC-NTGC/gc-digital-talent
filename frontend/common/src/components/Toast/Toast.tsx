import * as React from "react";
import {
  ToastContainer,
  Slide,
  toast as toastify,
  ToastOptions,
  CloseButtonProps,
} from "react-toastify";
import {
  CheckCircleIcon,
  EyeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";

import { iconStyles, closeButtonStyles } from "./styles";

import "react-toastify/dist/ReactToastify.minimal.css";
import "./toast.css";

const CloseButton = ({ type, closeToast, ariaLabel }: CloseButtonProps) => (
  <button
    type="button"
    data-h2-outline="base(none)"
    data-h2-radius="base(9999px)"
    data-h2-position="base(absolute)"
    data-h2-display="base(flex)"
    data-h2-align-items="base(center)"
    data-h2-offset="base(x.15, x.15, auto, auto)"
    data-h2-cursor="base(pointer)"
    data-h2-padding="base(x.15)"
    data-h2-transition="base(all, 100ms, ease-in)"
    data-h2-z-index="base(9)"
    aria-label={ariaLabel}
    {...closeButtonStyles[type]}
    onClick={closeToast}
  >
    <XCircleIcon data-h2-width="base(1rem)" data-h2-height="base(1rem)" />
  </button>
);

const Toast = () => (
  <ToastContainer
    position="bottom-right"
    transition={Slide}
    hideProgressBar
    role="alert"
    closeButton={CloseButton}
    icon={false}
  />
);

interface ToastMessageProps {
  children: React.ReactNode;
}

const ToastMessage = ({ children }: ToastMessageProps) => (
  <div data-h2-padding="base(x.5)" data-h2-line-height="base(1.2)">
    {children}
  </div>
);

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    toastify.success(<ToastMessage>{message}</ToastMessage>, {
      icon: <CheckCircleIcon {...iconStyles} />,
      ...options,
    }),
  error: (message: string, options?: ToastOptions) =>
    toastify.error(<ToastMessage>{message}</ToastMessage>, {
      icon: <ExclamationTriangleIcon {...iconStyles} />,
      ...options,
    }),
  warning: (message: string, options: ToastOptions) =>
    toastify.warning(<ToastMessage>{message}</ToastMessage>, {
      icon: <ExclamationCircleIcon {...iconStyles} />,
      ...options,
    }),
  info: (message: string, options: ToastOptions) =>
    toastify.info(<ToastMessage>{message}</ToastMessage>, {
      icon: <EyeIcon {...iconStyles} />,
      ...options,
    }),
};

export default Toast;
