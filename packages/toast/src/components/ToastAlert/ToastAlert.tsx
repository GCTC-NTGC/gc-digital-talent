import { ReactNode } from "react";

import { Notice, NoticeProps } from "@gc-digital-talent/ui";

interface ToastMessageObject {
  title: ReactNode;
  content?: ReactNode;
  actions?: ReactNode;
}

export type ToastMessage = ReactNode | ToastMessageObject;

function isMessageObject(msg: ToastMessage): msg is ToastMessageObject {
  return typeof msg === "object" && msg !== null && "title" in msg;
}

const ToastAlertTitle = ({ children }: { children: ReactNode }) => (
  <Notice.Title as="p" defaultIcon>
    {children}
  </Notice.Title>
);

interface ToastAlertProps {
  message: ToastMessage;
  color: NoticeProps["color"];
}

const ToastAlert = ({ message, color }: ToastAlertProps) => {
  return (
    <Notice.Root mode="card" small color={color}>
      {isMessageObject(message) ? (
        <>
          <ToastAlertTitle>{message.title}</ToastAlertTitle>
          {message.content && (
            <Notice.Content>{message.content}</Notice.Content>
          )}
          {message.actions && (
            <Notice.Actions>{message.actions}</Notice.Actions>
          )}
        </>
      ) : (
        <ToastAlertTitle>{message}</ToastAlertTitle>
      )}
    </Notice.Root>
  );
};

export default ToastAlert;
