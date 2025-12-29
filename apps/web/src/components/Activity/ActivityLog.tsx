import { useIntl } from "react-intl";
import { ReactNode, useId } from "react";
import { tv } from "tailwind-variants";

import { Card, Heading, HeadingRank, Notice } from "@gc-digital-talent/ui";

import Item from "./Item";

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

const root = tv({ base: "flex flex-col gap-y-12" });

const Root = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={root({ className })} {...rest}>
      {children}
    </div>
  );
};

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
  Item,
};
