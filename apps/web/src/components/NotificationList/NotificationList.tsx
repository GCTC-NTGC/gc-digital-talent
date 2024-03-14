import React from "react";
import { useSearchParams } from "react-router-dom";

import NotificationActions from "./NotificationActions";
import NotificationListPage from "./NotificationListPage";

const NotificationList = () => {
  const [searchParams] = useSearchParams();
  const pagesToLoad = searchParams.has("page")
    ? Number(searchParams.get("page"))
    : 1;
  const onlyUnread =
    searchParams.has("unread") && searchParams.get("unread") !== null;

  const pagesArray = Array.from(Array(pagesToLoad).keys());

  return (
    <>
      <NotificationActions onlyUnread={onlyUnread} />
      <div data-h2-margin="base(x1 0)">
        {pagesArray.map((page) => {
          const currentPage = page + 1;
          return (
            <NotificationListPage
              key={`notification-page-${currentPage}`}
              page={currentPage}
              isLastPage={currentPage === pagesToLoad}
              onlyUnread={onlyUnread}
            />
          );
        })}
      </div>
    </>
  );
};

export default NotificationList;
