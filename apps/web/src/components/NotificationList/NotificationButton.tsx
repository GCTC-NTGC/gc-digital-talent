import { forwardRef, MouseEventHandler, ReactNode } from "react";

import { Scalars } from "@gc-digital-talent/graphql";

import styles from "./styles";
import { useMarkAsRead } from "./mutations";

interface NotificationLinkProps {
  id: Scalars["UUID"]["output"];
  isUnread: boolean;
  onRead?: () => void;
  children: ReactNode;
}

const NotificationButton = forwardRef<HTMLButtonElement, NotificationLinkProps>(
  ({ id, isUnread, onRead, children }, forwardedRef) => {
    const [{ fetching }, markAsRead] = useMarkAsRead(id);

    const handleClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
      event.stopPropagation();

      await markAsRead().then(() => {
        onRead?.();
      });
    };

    return (
      <button
        type="button"
        ref={forwardedRef}
        onClick={handleClick}
        data-h2-text-align="base(left)"
        data-h2-background="base(none)"
        {...styles.link(isUnread, fetching)}
      >
        {children}
      </button>
    );
  },
);

export default NotificationButton;
