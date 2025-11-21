import { useIntl } from "react-intl";
import { ReactNode } from "react";

import ActivityItem from "./ActivityItem";
import PoolActivityItem from "./PoolActivityItem";

const Empty = () => {
  const intl = useIntl();

  return (
    <div className="text-center">
      <p className="mb-.5 font-bold">
        {intl.formatMessage({
          defaultMessage: "This activity log is empty",
          id: "kDTREC",
          description: "Title for when an activity log has no items",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Activity information will appear here when available.",
          id: "sEmaen",
          description: "Description for when an activity log has no items",
        })}
      </p>
    </div>
  );
};

interface RootProps {
  children: ReactNode;
}

const Root = ({ children }: RootProps) => (
  <ul className="-my-6 list-none">{children}</ul>
);

export default {
  Root,
  Empty,
  Item: ActivityItem,
  PoolItem: PoolActivityItem,
};
