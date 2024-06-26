import { ReactNode } from "react";
import { createPortal } from "react-dom";

export const LOAD_MORE_ROOT_ID = "notification-load-more";
export const NULL_MESSAGE_ROOT_ID = "notification-null-message";

const NotificationPortalContainers = ({ inDialog }: { inDialog?: boolean }) => {
  const prefix = inDialog ? "dialog-" : "";
  return (
    <>
      <div id={`${prefix}${LOAD_MORE_ROOT_ID}`} />
      <div id={`${prefix}${NULL_MESSAGE_ROOT_ID}`} />
    </>
  );
};

interface NotificationPortalProps {
  containerId: string;
  inDialog?: boolean;
  children: ReactNode;
}

const NotificationPortal = ({
  children,
  inDialog,
  containerId,
}: NotificationPortalProps) => {
  const containerRoot = document.getElementById(
    `${inDialog ? "dialog-" : ""}${containerId}`,
  );

  return containerRoot ? createPortal(children, containerRoot) : null;
};

export default {
  Portal: NotificationPortal,
  Containers: NotificationPortalContainers,
};
