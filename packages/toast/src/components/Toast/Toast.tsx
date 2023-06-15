import * as React from "react";
import {
  ToastContainer,
  Slide,
  CloseButtonProps,
  ToastContainerProps,
} from "react-toastify";

import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

import closeButtonStyles from "./styles";

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
    data-h2-location="base(x1, x1, auto, auto)"
    data-h2-cursor="base(pointer)"
    data-h2-transition="base(all 100ms ease-in)"
    data-h2-z-index="base(9)"
    aria-label={ariaLabel}
    {...closeButtonStyles[type]}
    onClick={closeToast}
  >
    <XCircleIcon data-h2-width="base(x1)" data-h2-height="base(x1)" />
  </button>
);

export type ToastProps = {
  disableTransition?: boolean;
  autoClose?: ToastContainerProps["autoClose"];
};

const Toast = ({ disableTransition, autoClose }: ToastProps) => (
  <ToastContainer
    position="bottom-right"
    transition={!disableTransition ? Slide : undefined}
    hideProgressBar
    role="alert"
    closeButton={CloseButton}
    icon={false}
    autoClose={autoClose}
  />
);

export default Toast;
