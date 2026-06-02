import { useIntl } from "react-intl";
import ArrowRightStartOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightStartOnRectangleIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql, PoolStatus } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { PreviewMetaData } from "@gc-digital-talent/ui";
import { PreviewList, Notice } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getProcessStatusBadge } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

const YourProcessesPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment YourProcessesPreviewList on Pool {
    id
    name {
      localized
    }
    status {
      value
      label {
        en
        fr
      }
    }
    classification {
      groupAndLevel
    }
    workStream {
      name {
        localized
      }
    }
    applicantsCount
  }
`);

interface YourProcessesPreviewListProps {
  yourProcessesQuery: FragmentType<typeof YourProcessesPreviewList_Fragment>[];
}

const YourProcessesPreviewList = ({
  yourProcessesQuery,
}: YourProcessesPreviewListProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const processes = getFragment(
    YourProcessesPreviewList_Fragment,
    yourProcessesQuery,
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

            let processMetadata: PreviewMetaData[] = [
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
                  ? process.classification.groupAndLevel
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
                    process.applicantsCount !== null &&
                    process.applicantsCount !== undefined
                      ? intl.formatMessage(
                          {
                            defaultMessage:
                              "{applicantsCount, plural, =0 {0 applications} one {# application} other {# applications}}",
                            id: "vd8CrA",
                            description: "Applications count for process",
                          },
                          {
                            applicantsCount: process.applicantsCount,
                          },
                        )
                      : intl.formatMessage(commonMessages.notFound),
                },
              ];
            }

            const processName =
              !!process.name?.localized && process.name.localized !== ""
                ? process.name.localized
                : intl.formatMessage(commonMessages.notFound);

            return (
              <PreviewList.Item
                key={process.id}
                title={processName}
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
                "You have no recruitment processes at the moment.",
              id: "L7nLT4",
              description:
                "Title for notice when there are no processes to view",
            })}
          </Notice.Title>
        </Notice.Root>
      )}
    </>
  );
};

export default YourProcessesPreviewList;
