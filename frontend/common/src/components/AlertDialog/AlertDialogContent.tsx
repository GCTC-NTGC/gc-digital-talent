import React from "react";
import { AlertDialogContent as ReachAlertDialogContent } from "@reach/alert-dialog";
import type { AlertDialogContentProps } from "@reach/alert-dialog";

import "./alert-dialog.css";

const AlertDialogContent = (props: AlertDialogContentProps) => (
  <ReachAlertDialogContent
    data-h2-font-family="base(sans)"
    data-h2-background-color="base(dt-white)"
    data-h2-margin="base(x3, 0)"
    data-h2-position="base(relative)"
    data-h2-radius="base(s)"
    data-h2-shadow="base(s)"
    {...props}
  />
);

export default AlertDialogContent;
