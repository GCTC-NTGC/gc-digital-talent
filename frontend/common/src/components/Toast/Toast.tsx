import * as React from "react";
import { ToastContainer, Slide } from "react-toastify";
import { XCircleIcon } from "@heroicons/react/solid";

import "react-toastify/dist/ReactToastify.min.css";
import "./toast.css";

const contextClass = {
  success: "toast-success",
  error: "toast-error",
  info: "",
  warning: "",
  default: "",
  dark: "",
};

const CloseButton = ({
  closeToast,
}: {
  closeToast: React.MouseEventHandler;
}) => (
  <XCircleIcon
    style={{ flexShrink: 0, height: "1rem", width: "1rem" }}
    onClick={closeToast}
  />
);

const Toast: React.FunctionComponent = () => (
  <ToastContainer
    position="top-center"
    transition={Slide}
    autoClose={5000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    role="alert"
    toastClassName={(classOptions) =>
      `${contextClass[classOptions?.type || "default"]} toast ${
        classOptions?.defaultClassName
      }`
    }
    style={{ width: "400px" }}
    closeButton={CloseButton}
    icon={false}
  />
);

export default Toast;
