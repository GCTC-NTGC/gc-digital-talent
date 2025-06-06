import { ElementRef, forwardRef, MouseEventHandler, ReactNode } from "react";
import { Link, useNavigate } from "react-router";

import { Scalars } from "@gc-digital-talent/graphql";
import { useLogger } from "@gc-digital-talent/logger";

import { linkStyles } from "./styles";
import { useMarkAsRead } from "./mutations";

interface NotificationLinkProps {
  id: Scalars["UUID"]["output"];
  href: string;
  isUnread: boolean;
  onRead?: () => void;
  children: ReactNode;
}

const NotificationLink = forwardRef<
  ElementRef<typeof Link>,
  NotificationLinkProps
>(({ id, href, isUnread, onRead, children }, forwardedRef) => {
  const [{ fetching }, markAsRead] = useMarkAsRead(id);
  const navigate = useNavigate();
  const logger = useLogger();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.stopPropagation();

    markAsRead()
      .then(async () => {
        onRead?.();
        await navigate(href);
      })
      .catch((err) => logger.error(String(err)));
  };

  return (
    <Link
      ref={forwardedRef}
      to={href}
      onClick={handleClick}
      data-notification-link
      {...(fetching && { "aria-disabled": "true" })}
      className={linkStyles({ isUnread, isDisabled: fetching })}
    >
      {children}
    </Link>
  );
});

export default NotificationLink;
