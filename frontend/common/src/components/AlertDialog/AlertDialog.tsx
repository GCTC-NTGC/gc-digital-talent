import React from "react";
import {
  AlertDialogDescription,
  AlertDialogOverlay,
} from "@reach/alert-dialog";
import type { AlertDialogProps as ReachAlertDialogProps } from "@reach/alert-dialog";

import "@reach/dialog/styles.css";

import AlertDialogFooter from "./AlertDialogFooter";
import AlertDialogContent from "./AlertDialogContent";
import AlertDialogHeading from "./AlertDialogHeading";

export interface AlertDialogProps
  extends Pick<ReachAlertDialogProps, "leastDestructiveRef"> {
  isOpen: boolean;
  onDismiss: () => void;
  title: string;
  children: React.ReactNode;
}

const AlertDialog = ({
  isOpen,
  onDismiss,
  title,
  children,
  leastDestructiveRef,
}: AlertDialogProps) =>
  isOpen ? (
    <AlertDialogOverlay
      leastDestructiveRef={leastDestructiveRef}
      onDismiss={onDismiss}
    >
      <AlertDialogContent>
        <AlertDialogHeading onDismiss={onDismiss}>{title}</AlertDialogHeading>
        {children}
      </AlertDialogContent>
    </AlertDialogOverlay>
  ) : null;

AlertDialog.Footer = AlertDialogFooter;
AlertDialog.Content = AlertDialogContent;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Heading = AlertDialogHeading;
AlertDialog.Overlay = AlertDialogOverlay;

export default AlertDialog;
