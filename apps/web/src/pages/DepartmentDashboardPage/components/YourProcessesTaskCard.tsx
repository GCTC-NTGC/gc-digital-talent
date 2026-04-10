import { useIntl } from "react-intl";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import uniqBy from "lodash/uniqBy";

import {
  type FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  Accordion,
  type AccordionMetaData,
  TaskCard,
  wrapParens,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";

import YourProcessesPreviewList from "./YourProcessesPreviewList";
import { isPoolTeamable } from "../utils";

const YourProcessesTaskCard_Fragment = graphql(/* GraphQL */ `
  fragment YourProcessesTaskCard on User {
    poolBookmarks {
      ...YourProcessesPreviewList
    }
    authInfo {
      roleAssignments {
        teamable {
          ... on Pool {
            id
            ...YourProcessesPreviewList
          }
        }
      }
    }
  }
`);

interface YourProcessesTaskCardProps {
  yourProcessesTaskCardQuery: FragmentType<
    typeof YourProcessesTaskCard_Fragment
  >;
}

const YourProcessesTaskCard = ({
  yourProcessesTaskCardQuery,
}: YourProcessesTaskCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const yourProcessesTaskCardFragment = getFragment(
    YourProcessesTaskCard_Fragment,
    yourProcessesTaskCardQuery,
  );
  const processesUnpacked = unpackMaybes(
    yourProcessesTaskCardFragment?.poolBookmarks,
  );
  const roleAssignmentsUnpacked = unpackMaybes(
    yourProcessesTaskCardFragment?.authInfo?.roleAssignments,
  );

  const poolsFromTeamable = unpackMaybes(
    roleAssignmentsUnpacked.map((roleAssign) => {
      if (isPoolTeamable(roleAssign.teamable)) {
        return roleAssign.teamable;
      }

      return undefined;
    }),
  );
  const poolsFromTeamableUnique = uniqBy(poolsFromTeamable, "id");

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
            defaultMessage: "Your processes",
            id: "BiRxFg",
            description: "Task card title for processes",
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
                      "This section contains any processes you have bookmarked.",
                    id: "3uXEkO",
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
                  <YourProcessesPreviewList
                    yourProcessesQuery={processesUnpacked}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </TaskCard.Item>
          <TaskCard.Item>
            <Accordion.Root type="multiple">
              <Accordion.Item value="your_shared_processes">
                <Accordion.Trigger
                  as="h3"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "This section contains processes shared with you by a different department or community.",
                    id: "KvhRNR",
                    description:
                      "Subtitle explaining shared processes expandable within task card",
                  })}
                >
                  {intl.formatMessage({
                    defaultMessage: "Shared processes",
                    id: "Ozwufr",
                    description: "Shared processes expandable",
                  })}
                  <span className="ml-1">
                    {wrapParens(poolsFromTeamableUnique.length ?? 0)}
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <YourProcessesPreviewList
                    yourProcessesQuery={poolsFromTeamableUnique}
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

export default YourProcessesTaskCard;
