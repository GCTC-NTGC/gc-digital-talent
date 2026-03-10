import { useIntl } from "react-intl";
import ArrowRightStartOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightStartOnRectangleIcon";

import {
  FragmentType,
  getFragment,
  graphql,
  PoolStatus,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { PreviewList, PreviewMetaData, Notice } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import {
  formatClassificationString,
  getProcessStatusBadge,
} from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

const BookmarkedProcessesPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment BookmarkedProcessesPreviewList on Pool {
    id
    name {
      localized
    }
    status {
      value
      label {
        localized
      }
    }
    classification {
      group
      level
    }
    workStream {
      name {
        localized
      }
    }
    applicantsCount
  }
`);

interface BookmarkedProcessesPreviewListProps {
  bookmarkedProcessesQuery: FragmentType<
    typeof BookmarkedProcessesPreviewList_Fragment
  >[];
}

const BookmarkedProcessesPreviewList = ({
  bookmarkedProcessesQuery,
}: BookmarkedProcessesPreviewListProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const processes = getFragment(
    BookmarkedProcessesPreviewList_Fragment,
    bookmarkedProcessesQuery,
  );

  const poolStatusEnumSortOrder: (PoolStatus | null)[] = [
    PoolStatus.Draft,
    PoolStatus.Published,
    PoolStatus.Closed,
    PoolStatus.Archived,
    null,
  ];

  const sortedProcesses = unpackMaybes(processes).sort(
    (a, b) =>
      poolStatusEnumSortOrder.indexOf(a.status?.value ?? null) -
      poolStatusEnumSortOrder.indexOf(b.status?.value ?? null),
  );

  return (
    <>
      {sortedProcesses.length ? (
        <PreviewList.Root>
          {sortedProcesses.map((process) => {
            const processBadge = getProcessStatusBadge(process.status, intl);

            let processMetadata: PreviewMetaData[] = [];
            processMetadata = [
              {
                key: "status",
                type: "chip",
                color: processBadge.color,
                children:
                  typeof processBadge.label === "string"
                    ? processBadge.label
                    : intl.formatMessage(
                        processBadge.label ?? commonMessages.notFound,
                      ),
              },
              {
                key: "classification",
                type: "text",
                children: process.classification
                  ? formatClassificationString({
                      group: process.classification.group,
                      level: process.classification.level,
                    })
                  : intl.formatMessage(commonMessages.notFound),
              },
              {
                key: "stream",
                type: "text",
                children:
                  process.workStream?.name?.localized ??
                  intl.formatMessage(commonMessages.notFound),
              },
            ];

            if (process.status?.value !== PoolStatus.Draft) {
              processMetadata = [
                ...processMetadata,
                {
                  key: "applicationCount",
                  type: "text",
                  children:
                    process.applicantsCount ??
                    intl.formatMessage(commonMessages.notFound),
                },
              ];
            }

            return (
              <PreviewList.Item
                key={process.id}
                title={
                  process.name?.localized
                    ? intl.formatMessage(
                        {
                          defaultMessage:
                            "<hidden>Application for </hidden>{poolName}",
                          id: "LC1Rsg",
                          description:
                            "Text before application pool name in application preview list.",
                        },
                        {
                          poolName: process.name.localized,
                        },
                      )
                    : intl.formatMessage(commonMessages.notFound)
                }
                metaData={processMetadata}
                action={
                  <>
                    <PreviewList.Link
                      href={paths.poolView(process.id)}
                      label={
                        process.name?.localized ??
                        intl.formatMessage(commonMessages.notFound)
                      }
                      icon={ArrowRightStartOnRectangleIcon}
                    />
                  </>
                }
                headingAs="h4"
              />
            );
          })}
        </PreviewList.Root>
      ) : (
        <Notice.Root className="text-center">
          <Notice.Title>
            {intl.formatMessage({
              defaultMessage:
                "You don't have any active applications at the moment.",
              id: "Y93ht7",
              description: "Title for notice when there are no applications",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage: `You can start a new application by visiting the "Browse jobs" page and selecting an opportunity.`,
                id: "0K7Upw",
                description: "Body for notice when there are no applications",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
    </>
  );
};

export default BookmarkedProcessesPreviewList;
