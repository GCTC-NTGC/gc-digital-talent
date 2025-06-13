import {
  ToastContainer,
  Slide,
  CloseButton as ReactToastifyCloseButton,
  ToastContainerProps,
} from "react-toastify/unstyled";
import { ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";

import "react-toastify/ReactToastify.css";
import "./toast.css";

const closeBtn = tv({
  base: "absolute top-6 right-6 z-[9] flex cursor-pointer items-center rounded-full bg-transparent text-black transition-colors ease-in outline-none focus-visible:bg-focus dark:text-white",
  variants: {
    type: {
      default: "hover:bg-gray-100",
      success:
        "hover:bg-success-100 hover:text-success-700 dark:hover:bg-success-700 dark:hover:text-success-100",
      warning:
        "hover:bg-warning-100 hover:text-warning-700 dark:hover:bg-warning-700 dark:hover:text-warning-100",
      info: "hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-700 dark:hover:text-primary-100",
      error:
        "hover:bg-error-100 hover:text-error-700 dark:hover:bg-error-700 dark:hover:text-error-100",
    },
  },
});

type CloseButtonProps = ComponentPropsWithoutRef<
  typeof ReactToastifyCloseButton
>;

const CloseButton = ({ type, closeToast, ariaLabel }: CloseButtonProps) => (
  <button
    type="button"
    className={closeBtn({ type })}
    aria-label={ariaLabel}
    onClick={closeToast}
  >
    <XCircleIcon className="size-6" />
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
