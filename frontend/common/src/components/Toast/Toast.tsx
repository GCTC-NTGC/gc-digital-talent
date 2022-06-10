import * as React from "react";
import { ToastContainer, Slide } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { XCircleIcon } from "@heroicons/react/solid";

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
}) => <XCircleIcon style={{ width: "1rem" }} onClick={closeToast} />;

const Toast: React.FunctionComponent = () => {
  injectStyle();
  return (
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
        `${contextClass[classOptions?.type || "default"]} toast`
      }
      style={{ width: "400px" }}
      closeButton={CloseButton}
      icon={false}
    />
  );
};

export default Toast;
