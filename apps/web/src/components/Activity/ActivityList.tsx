import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Card } from "@gc-digital-talent/ui";

import ActivityItem from "./ActivityItem";

const ActivityList_Fragment = graphql(/** GraphQL **/ `
  fragment ActivityList on Activity {
    id
    ...ActivityItem
  }
`);

interface ActivityListProps {
  query: FragmentType<typeof ActivityList_Fragment>[];
  publishedAt?: Maybe<Scalars["DateTime"]["output"]>;
}

const ActivityList = ({ query, publishedAt }: ActivityListProps) => {
  const intl = useIntl();
  const items = getFragment(ActivityList_Fragment, query);

  return (
    <Card>
      {items.length > 0 ? (
        <ul className="-my-6 list-none">
          {items.map((item, index) => (
            <li key={item.id}>
              <ActivityItem
                query={item}
                border={index > 0}
                publishedAt={publishedAt}
              />
            </li>
          ))}
        </ul>
      ) : (
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
      )}
    </Card>
  );
};

export default ActivityList;
