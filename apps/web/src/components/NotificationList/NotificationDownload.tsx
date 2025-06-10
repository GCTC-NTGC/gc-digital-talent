import { forwardRef, MouseEventHandler, ReactNode } from "react";
import { useIntl } from "react-intl";

import { Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";
import { useLogger } from "@gc-digital-talent/logger";

import useAsyncFileDownload from "~/hooks/useAsyncFileDownload";

import { linkStyles } from "./styles";
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
              intl.formatMessage({
                defaultMessage:
                  "This file is not available. If it's been more than 24 hours since you requested it, please try requesting the download again. If it's been less than 24 hours or the problem persists, contact support for assistance.",
                id: "klyOZZ",
                description: "Error message when a file no longer exists",
              }),
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

  const isDisabled = fetching || downloadingFile;

  return (
    // NOTE: We need this for downloads
    // eslint-disable-next-line react/forbid-elements
    <a
      ref={forwardedRef}
      href={href}
      onClick={handleClick}
      {...(isDisabled && { "aria-disabled": "true" })}
      data-notification-link
      className={linkStyles({ isUnread, isDisabled })}
    >
      {children}
    </a>
  );
});

export default NotificationDownload;
