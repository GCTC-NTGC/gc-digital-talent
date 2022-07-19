import React from "react";
import {
  AlertDialogDescription,
  AlertDialogOverlay,
} from "@reach/alert-dialog";
import type { AlertDialogProps as ReachAlertDialogProps } from "@reach/alert-dialog";
import Actions from "./Actions";
import Content from "./Content";
import Heading from "./Heading";

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
    <AlertDialogOverlay leastDestructiveRef={leastDestructiveRef}>
      <Content>
        <Heading onDismiss={onDismiss}>{title}</Heading>
        {children}
      </Content>
    </AlertDialogOverlay>
  ) : null;

AlertDialog.Actions = Actions;
AlertDialog.Content = Content;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Heading = Heading;
AlertDialog.Overlay = AlertDialogOverlay;

export default AlertDialog;
