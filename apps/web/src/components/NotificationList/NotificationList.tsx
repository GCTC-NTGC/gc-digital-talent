import { useSearchParams } from "react-router";
import { useQuery } from "urql";
import { tv } from "tailwind-variants";

import { graphql } from "@gc-digital-talent/graphql";

import NotificationActions from "./NotificationActions";
import NotificationListPage from "./NotificationListPage";
import NotificationPortal from "./NotificationPortal";

const actions = tv({
  base: "flex list-none flex-col p-0",
  variants: {
    inDialog: {
      false: "gap-y-1.5",
    },
  },
});

const MaxNotificationPages_Query = graphql(/* GraphQL */ `
  query MaxNotificationPages($where: NotificationFilterInput) {
    notifications(where: $where, page: 1, first: 10) {
      paginatorInfo {
        lastPage
      }
    }
  }
`);

interface NotificationListProps {
  paginate?: boolean;
  limit?: number;
  inDialog?: boolean;
  onRead?: () => void;
}

const NotificationList = ({
  paginate,
  limit,
  inDialog,
  onRead,
}: NotificationListProps) => {
  const [searchParams] = useSearchParams();
  const onlyUnread =
    searchParams.has("unread") && searchParams.get("unread") !== null;
  const [{ data: maxPagesData }, executeQuery] = useQuery({
    query: MaxNotificationPages_Query,
    variables: {
      where: { onlyUnread },
    },
  });
  const lastPage = maxPagesData?.notifications.paginatorInfo.lastPage ?? 1;
  let pagesToLoad =
    paginate && searchParams.has("page") ? Number(searchParams.get("page")) : 1;
  if (pagesToLoad > lastPage) {
    pagesToLoad = lastPage;
  }

  const pagesArray = Array.from(Array(pagesToLoad).keys());
  return (
    <>
      <NotificationActions
        onRead={onRead}
        onlyUnread={onlyUnread}
        inDialog={inDialog}
        onRefresh={executeQuery}
      />
      <ul className={actions({ inDialog })}>
        {pagesArray.map((page) => {
          const currentPage = page + 1;
          return (
            <NotificationListPage
              key={`notification-page-${currentPage}`}
              page={currentPage}
              isLastPage={currentPage === pagesToLoad}
              onlyUnread={onlyUnread}
              inDialog={inDialog}
              onRead={onRead}
              {...((!paginate || limit) && {
                first: limit ?? 100,
              })}
            />
          );
        })}
      </ul>
      <NotificationPortal.Containers inDialog={inDialog} />
    </>
  );
};

export default NotificationList;
