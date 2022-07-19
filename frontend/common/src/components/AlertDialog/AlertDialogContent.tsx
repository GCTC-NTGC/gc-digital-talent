import React from "react";
import { AlertDialogContent as ReachAlertDialogContent } from "@reach/alert-dialog";
import type { AlertDialogContentProps } from "@reach/alert-dialog";

import "./alert-dialog.css";

const AlertDialogContent = (props: AlertDialogContentProps) => (
  <ReachAlertDialogContent
    data-h2-font-family="b(sans)"
    data-h2-bg-color="b(white)"
    data-h2-margin="b(top-bottom, xxl)"
    data-h2-position="b(relative)"
    data-h2-radius="b(s)"
    data-h2-shadow="b(s)"
    {...props}
  />
);

export default AlertDialogContent;
