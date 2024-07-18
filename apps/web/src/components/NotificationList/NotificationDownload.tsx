import { forwardRef, MouseEventHandler, ReactNode } from "react";
import { useIntl } from "react-intl";

import { Scalars } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";

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
  const [{ fetching }, markAsRead] = useMarkAsRead(id);
  const [{ fetching: downloadingFile }, executeFileDownload] =
    useAsyncFileDownload({
      url: href,
      fileName,
    });

  const handleClick: MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    await markAsRead().then(() => {
      onRead?.();
    });

    await executeFileDownload().catch((err) => {
      if (err instanceof Error && err.message === "not found") {
        toast.error(
          intl.formatMessage(
            {
              defaultMessage:
                "{fileName} no longer exists and cannot be downloaded.",
              id: "4bbN50",
              description: "Error message when a file no longer exists",
            },
            { fileName },
          ),
        );
      } else {
        toast.error(
          intl.formatMessage(errorMessages.downloadingFileFailed, { fileName }),
        );
      }
    });
  };

  return (
    // NOTE: We need this for downloads
    // eslint-disable-next-line react/forbid-elements
    <a
      ref={forwardedRef}
      href={href}
      onClick={handleClick}
      {...styles.link(isUnread, fetching || downloadingFile)}
    >
      {children}
    </a>
  );
});

export default NotificationDownload;
