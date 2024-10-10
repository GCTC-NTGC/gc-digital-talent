import { forwardRef, MouseEventHandler, ReactNode } from "react";
import { useIntl } from "react-intl";

import { Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";
import { useLogger } from "@gc-digital-talent/logger";

import useAsyncFileDownload from "~/hooks/useAsyncFileDownload";

import styles from "./styles";
import { useMarkAsRead } from "./mutations";

interface NotificationLinkProps {
  id: Scalars["UUID"]["output"];
  href: string;
  fileName: string;
  isUnread: boolean;
  onRead?: () => void;
  children: ReactNode;
}

const NotificationDownload = forwardRef<
  HTMLAnchorElement,
  NotificationLinkProps
>(({ id, href, isUnread, fileName, onRead, children }, forwardedRef) => {
  const intl = useIntl();
  const logger = useLogger();
  const [{ fetching }, markAsRead] = useMarkAsRead(id);
  const [{ fetching: downloadingFile }, executeFileDownload] =
    useAsyncFileDownload();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    markAsRead()
      .then(() => {
        onRead?.();

        executeFileDownload({
          url: href,
          fileName,
        }).catch((err) => {
          if (err instanceof Error && err.message === "not found") {
            toast.error(
              intl.formatMessage(
                {
                  defaultMessage:
                    "This file is older than 24 hours and is no longer available. Please request a new file. If the problem persists contact support for assistance.",
                  id: "JFlQjb",
                  description: "Error message when a file no longer exists",
                },
                { fileName },
              ),
            );
          } else {
            toast.error(
              intl.formatMessage(errorMessages.downloadingFileFailed, {
                fileName,
              }),
            );
          }
        });
      })
      .catch((err) => logger.error(String(err)));
  };

  return (
    // NOTE: We need this for downloads
    // eslint-disable-next-line react/forbid-elements
    <a
      ref={forwardedRef}
      href={href}
      onClick={handleClick}
      data-notification-link
      {...styles.link(isUnread, fetching || downloadingFile)}
    >
      {children}
    </a>
  );
});

export default NotificationDownload;
