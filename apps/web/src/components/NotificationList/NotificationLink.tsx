import { ElementRef, forwardRef, MouseEventHandler, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Scalars } from "@gc-digital-talent/graphql";

import styles from "./styles";
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

  const handleClick: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.stopPropagation();

    await markAsRead().then(() => {
      onRead?.();
      navigate(href);
    });
  };

  return (
    <Link
      ref={forwardedRef}
      to={href}
      onClick={handleClick}
      {...styles.link(isUnread, fetching)}
    >
      {children}
    </Link>
  );
});

export default NotificationLink;