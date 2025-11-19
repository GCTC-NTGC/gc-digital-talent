import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import ActivityItem from "./ActivityItem";

const ActivityList_Fragment = graphql(/** GraphQL **/ `
  fragment ActivityList on Activity {
    id
    ...ActivityItem
  }
`);

interface ActivityListProps {
  query: FragmentType<typeof ActivityList_Fragment>[];
}

const ActivityList = ({ query }: ActivityListProps) => {
  const intl = useIntl();
  const items = getFragment(ActivityList_Fragment, query);

  return (
    <Card>
      {items.length > 0 ? (
        <ul className="-my-6 list-none">
          {items.map((item, index) => (
            <li key={item.id}>
              <ActivityItem query={item} border={index > 0} />
            </li>
          ))}
        </ul>
      ) : (
        <p>{intl.formatMessage(commonMessages.notAvailable)}</p>
      )}
    </Card>
  );
};

export default ActivityList;
