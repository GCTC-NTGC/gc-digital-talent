import React from "react";
import { createPortal } from "react-dom";

export const LOAD_MORE_ROOT_ID = "notification-load-more";
export const NULL_MESSAGE_ROOT_ID = "notification-null-message";

export const NotificationPortalContainers = () => (
  <>
    <div id={LOAD_MORE_ROOT_ID} />
    <div id={NULL_MESSAGE_ROOT_ID} />
  </>
);

interface NotificationPortalProps {
  containerId: string;
  children: React.ReactNode;
}

const NotificationPortal = ({
  children,
  containerId,
}: NotificationPortalProps) => {
  const containerRoot = document.getElementById(containerId);

  return containerRoot ? createPortal(children, containerRoot) : null;
};

export default {
  Portal: NotificationPortal,
  Containers: NotificationPortalContainers,
};
