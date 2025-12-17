import { useIntl } from "react-intl";
import { ReactNode, useId } from "react";

import { Card, Heading, HeadingRank, Notice } from "@gc-digital-talent/ui";

import ActivityItem from "./ActivityItem";
import PoolActivityItem from "./PoolActivityItem";

const Empty = () => {
  const intl = useIntl();

  return (
    <Notice.Root mode="inline" className="text-center">
      <Notice.Title>
        {intl.formatMessage({
          defaultMessage: "This activity log is empty",
          id: "kDTREC",
          description: "Title for when an activity log has no items",
        })}
      </Notice.Title>
      <Notice.Content>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Activity information will appear here when available.",
            id: "sEmaen",
            description: "Description for when an activity log has no items",
          })}
        </p>
      </Notice.Content>
    </Notice.Root>
  );
};

interface RootProps {
  children: ReactNode;
}

const Root = ({ children }: RootProps) => (
  <div className="flex flex-col gap-y-12">{children}</div>
);

interface ListProps {
  heading: ReactNode;
  headingAs?: HeadingRank;
  children: ReactNode;
}

const List = ({ children, heading, headingAs = "h3" }: ListProps) => {
  const id = useId();

  return (
    <div>
      <Heading
        id={id}
        level={headingAs}
        size="h6"
        className="mt-0 mb-1.5 font-bold"
      >
        {heading}
      </Heading>
      <Card>
        <ul aria-labelledby={id} className="-my-6 list-none">
          {children}
        </ul>
      </Card>
    </div>
  );
};

export default {
  Root,
  List,
  Empty,
  Item: ActivityItem,
  PoolItem: PoolActivityItem,
};
