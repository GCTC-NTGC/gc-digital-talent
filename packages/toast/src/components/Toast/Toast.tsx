import {
  ToastContainer,
  Slide,
  CloseButton as ReactToastifyCloseButton,
  ToastContainerProps,
} from "react-toastify/unstyled";
import { ComponentPropsWithoutRef } from "react";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

import closeButtonStyles from "./styles";

import "react-toastify/ReactToastify.css";
import "./toast.css";

type CloseButtonProps = ComponentPropsWithoutRef<
  typeof ReactToastifyCloseButton
>;

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

interface ToastProps {
  disableTransition?: boolean;
  autoClose?: ToastContainerProps["autoClose"];
}

const Toast = ({ disableTransition, autoClose = 5000 }: ToastProps) => (
  <ToastContainer
    position="bottom-right"
    {...(!disableTransition && {
      transition: Slide,
    })}
    hideProgressBar
    role="alert"
    closeButton={CloseButton}
    icon={false}
    autoClose={autoClose}
    aria-label={undefined}
  />
);

export default Toast;
