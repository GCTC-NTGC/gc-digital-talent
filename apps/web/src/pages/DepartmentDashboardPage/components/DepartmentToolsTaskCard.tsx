import { useIntl } from "react-intl";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  AccordionMetaData,
  TaskCard,
  wrapParens,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";

import BookmarkedProcessesPreviewList from "./BookmarkedProcessesPreviewList";

const DepartmentToolsTaskCard_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentToolsTaskCard on User {
    poolBookmarks {
      ...BookmarkedProcessesPreviewList
    }
  }
`);

interface DepartmentToolsTaskCardTaskCardProps {
  departmentToolsTaskCardQuery: FragmentType<
    typeof DepartmentToolsTaskCard_Fragment
  >;
}

const DepartmentToolsTaskCard = ({
  departmentToolsTaskCardQuery,
}: DepartmentToolsTaskCardTaskCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const departmentProcessesTaskCardFragment = getFragment(
    DepartmentToolsTaskCard_Fragment,
    departmentToolsTaskCardQuery,
  );
  const processesUnpacked = unpackMaybes(
    departmentProcessesTaskCardFragment?.poolBookmarks,
  );

  const bookmarkedProcessesMetaData: AccordionMetaData = [
    {
      key: "pools-table-key",
      type: "link",
      href: paths.poolTable(),
      color: "secondary",
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "View all processes",
            id: "B8N4yZ",
            description: "Link to view all processes",
          })}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <TaskCard.Root
          icon={WrenchScrewdriverIcon}
          title={intl.formatMessage({
            defaultMessage: "Your department tools",
            id: "AMHpov",
            description: "Task card title for department tools",
          })}
          headingColor="primary"
          headingAs="h2"
        >
          <TaskCard.Item>
            <Accordion.Root type="multiple">
              <Accordion.Item value="your_bookmarked_processes">
                <Accordion.Trigger
                  as="h3"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "This section contains any process you have bookmarked.",
                    id: "/Sps62",
                    description:
                      "Subtitle explaining bookmarked processes expandable within task card",
                  })}
                >
                  {intl.formatMessage({
                    defaultMessage: "Bookmarked processes",
                    id: "DNUZPm",
                    description: "Bookmarked processes expandable",
                  })}
                  <span className="ml-1">
                    {wrapParens(processesUnpacked?.length ?? 0)}
                  </span>
                </Accordion.Trigger>
                <Accordion.MetaData metadata={bookmarkedProcessesMetaData} />
                <Accordion.Content>
                  <BookmarkedProcessesPreviewList
                    bookmarkedProcessesQuery={processesUnpacked}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </TaskCard.Item>
        </TaskCard.Root>
      </div>
    </>
  );
};

export default DepartmentToolsTaskCard;
