import type { MouseEventHandler, ReactNode } from "react";
import { forwardRef } from "react";

import { getLogger } from "@gc-digital-talent/logger";

import { linkStyles } from "./styles";
import { useMarkAsRead } from "./mutations";

interface NotificationLinkProps {
  id: string;
  isUnread: boolean;
  onRead?: () => void;
  children: ReactNode;
}

const NotificationButton = forwardRef<HTMLButtonElement, NotificationLinkProps>(
  ({ id, isUnread, onRead, children }, forwardedRef) => {
    const logger = getLogger();
    const [{ fetching }, markAsRead] = useMarkAsRead(id);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.stopPropagation();

      markAsRead()
        .then(() => {
          onRead?.();
        })
        .catch((err) => logger.error(String(err)));
    };

    return (
      <button
        type="button"
        ref={forwardedRef}
        onClick={handleClick}
        data-notification-link
        {...(fetching && { "aria-disabled": "true" })}
        className={linkStyles({
          isUnread,
          isDisabled: fetching,
          class: "bg-none text-left",
        })}
      >
        {children}
      </button>
    );
  },
);

export default NotificationButton;
