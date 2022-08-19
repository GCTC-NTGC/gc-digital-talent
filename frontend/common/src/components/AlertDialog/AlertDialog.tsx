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
  /**
   * Hack: This is for storybook
   *
   * @reach/alert-dialog portal is appended at the bottom
   * of the document.body and is not in the root
   * element so does not get hydrogen styles applied.
   */
  "data-h2"?: boolean;
}

const AlertDialog = ({
  isOpen,
  onDismiss,
  title,
  children,
  leastDestructiveRef,
  ...props
}: AlertDialogProps) =>
  isOpen ? (
    <AlertDialogOverlay
      leastDestructiveRef={leastDestructiveRef}
      onDismiss={onDismiss}
      // See:  note in prop type interface
      {...(props["data-h2"] && { "data-h2": true })}
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
