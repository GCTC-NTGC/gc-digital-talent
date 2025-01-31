import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import PlusCircleIconMini from "@heroicons/react/20/solid/PlusCircleIcon";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import FolderIcon from "@heroicons/react/24/outline/FolderIcon";

import {
  ThrowNotFound,
  Pending,
  Link,
  PreviewList,
  Well,
  TableOfContents,
  Separator,
  Heading,
  ScrollToLink,
  CardBasic,
  Button,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  getFragment,
  graphql,
  ManagerRequestHistoryUserFragment,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  formMessages,
  getLocale,
  Locales,
} from "@gc-digital-talent/i18n";
import { assertUnreachable, unpackMaybes } from "@gc-digital-talent/helpers";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import SEO from "~/components/SEO/SEO";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";
import { formatClassificationString } from "~/utils/poolUtils";
import permissionConstants from "~/constants/permissionConstants";

import PoolCandidateSearchRequestPreviewListItem from "../components/PoolCandidateSearchRequestPreviewListItem";
import pageMessages from "./messages";
import managerDashboardMessages from "../ManagerDashboardPage/messages";
import sections from "./sections";
import {
  deriveSingleString,
  deriveStatusActiveOrNot,
  poolCandidateSearchStatusSortOrder,
} from "../utils";

const linkAccessor = (href: string, chunks: ReactNode) => {
  return (
    <Link href={href} color="black">
      {chunks}
    </Link>
  );
};

function scrollToLinkAccessor(to: string, chunks: ReactNode) {
  return (
    <ScrollToLink to={to} color="black">
      {chunks}
    </ScrollToLink>
  );
}

const selectedSortLink: Record<string, string> = {
  mode: "inline",
  color: "secondary",
};

const unselectedSortLink: Record<string, string> = {
  mode: "inline",
  color: "black",
  "data-h2-font-weight": "base(normal)",
};

type PartialPoolCandidateSearchRequest = NonNullable<
  ManagerRequestHistoryUserFragment["poolCandidateSearchRequests"]
>[number];

// calculate easily sortable fields based on the original request
const deriveSortableFields = (
  request: PartialPoolCandidateSearchRequest,
  locale: Locales,
): {
  requestedDateValue: number;
  statusValue: number;
  classificationValue: string;
} => ({
  requestedDateValue: request.requestedDate
    ? parseDateTimeUtc(request.requestedDate).valueOf()
    : 0,
  statusValue: poolCandidateSearchStatusSortOrder(request.status?.value),
  classificationValue: deriveSingleString(
    unpackMaybes(request.applicantFilter?.qualifiedClassifications),
    formatClassificationString,
    locale,
  ),
});

// return a new array, sorted by given field
const toSortedRequests = (
  requests: PartialPoolCandidateSearchRequest[],
  sortField: "date" | "status" | "classification",
  locale: Locales,
): PartialPoolCandidateSearchRequest[] => {
  // step 1: attach easily sorted metadata
  const requestsWithSortableFields = requests.map((request) => ({
    originalRequest: request,
    sortableFields: deriveSortableFields(request, locale),
  }));

  // step 2: sort array by attached metadata
  switch (sortField) {
    case "date":
      requestsWithSortableFields.sort(
        (a, b) =>
          a.sortableFields.requestedDateValue -
          b.sortableFields.requestedDateValue,
      );
      break;
    case "status":
      requestsWithSortableFields.sort(
        (a, b) => a.sortableFields.statusValue - b.sortableFields.statusValue,
      );
      break;
    case "classification":
      requestsWithSortableFields.sort((a, b) =>
        a.sortableFields.classificationValue.localeCompare(
          b.sortableFields.classificationValue,
        ),
      );
      break;
    default:
      assertUnreachable(sortField);
  }

  // step 3: remove extra sorting metadata
  const requestsWithoutSortableFields = requestsWithSortableFields.map(
    (item) => item.originalRequest,
  );

  return requestsWithoutSortableFields;
};

const ManagerRequestHistoryUser_Fragment = graphql(/* GraphQL */ `
  fragment ManagerRequestHistoryUser on User {
    id
    firstName
    poolCandidateSearchRequests {
      id
      requestedDate
      status {
        value
      }
      requestedDate
      applicantFilter {
        qualifiedClassifications {
          group
          level
        }
      }
      ...PreviewListItem
    }
  }
`);

interface ManagerRequestHistoryProps {
  userQuery: FragmentType<typeof ManagerRequestHistoryUser_Fragment>;
}

const ManagerRequestHistory = ({ userQuery }: ManagerRequestHistoryProps) => {
  const paths = useRoutes();
  const intl = useIntl();
  const locale = getLocale(intl);

  const [activeRequestsSortedBy, setActiveRequestsSortedBy] = useState<
    "date" | "status" | "classification"
  >("date");

  const [requestHistorySortedBy, setRequestHistorySortedBy] = useState<
    "date" | "classification"
  >("date");

  const user = getFragment(ManagerRequestHistoryUser_Fragment, userQuery);
  const allRequests = unpackMaybes(user.poolCandidateSearchRequests);
  const unsortedActiveRequests = allRequests.filter(
    (request) => deriveStatusActiveOrNot(request) === "active",
  );
  const activeRequests = toSortedRequests(
    unsortedActiveRequests,
    activeRequestsSortedBy,
    locale,
  );

  const unsortedInactiveRequests = allRequests.filter(
    (request) => deriveStatusActiveOrNot(request) === "inactive",
  );
  const inactiveRequests = toSortedRequests(
    unsortedInactiveRequests,
    requestHistorySortedBy,
    locale,
  );

  const formattedPageTitle = intl.formatMessage(pageMessages.pageTitle);
  const formattedPageSubtitle = intl.formatMessage(pageMessages.pageSubtitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(managerDashboardMessages.pageTitle),
        url: paths.managerDashboard(),
      },
      {
        label: formattedPageTitle,
        url: paths.managerRequestHistory(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedPageSubtitle} />
      <Hero
        title={intl.formatMessage({
          defaultMessage: "Your talent requests",
          id: "8w4tXm",
          description:
            "Title displayed in the hero section of the 'manager request history' page",
        })}
        subtitle={formattedPageSubtitle}
        crumbs={crumbs}
      />

      <section data-h2-margin="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <TableOfContents.Wrapper>
            <TableOfContents.Navigation>
              <TableOfContents.List>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.activeRequests.id}>
                    {intl.formatMessage(sections.activeRequests.title)}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={sections.requestHistory.id}>
                    {intl.formatMessage(sections.requestHistory.title)}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              </TableOfContents.List>

              <>
                <Separator color="base:all(gray.lighter)" space="sm" />
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x0.25)"
                  data-h2-align-items="base(center)"
                >
                  <Link
                    icon={PlusCircleIconMini}
                    mode="solid"
                    href={paths.search()}
                  >
                    {intl.formatMessage({
                      defaultMessage: "New request",
                      id: "BGQaDq",
                      description: "Link to a page to start a new request",
                    })}
                  </Link>
                </div>
              </>
            </TableOfContents.Navigation>
            <TableOfContents.Content>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x3)"
              >
                <TableOfContents.Section id={sections.activeRequests.id}>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x1.5)"
                  >
                    <Heading
                      Icon={DocumentMagnifyingGlassIcon}
                      size="h2"
                      color="primary"
                      data-h2-margin="base(0)"
                    >
                      {intl.formatMessage(sections.activeRequests.title)}
                      <span data-h2-color="base(black.light)">{`(${activeRequests.length})`}</span>
                    </Heading>
                    <div>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "When you use the “<findTalentLink>Find talent</findTalentLink>” tool to request referrals for potential hires, your criteria and notes will be saved as a request and tracked in this section. Requests that are currently in progress will also appear on your “<managerDashboardLink>Manager dashboard</managerDashboardLink>”. When a request is completed, it will automatically move from this section to your <requestHistoryLink>Request history</requestHistoryLink>.",
                          id: "655Jy3",
                          description:
                            "description of the active requests section on the manager request history page",
                        },
                        {
                          findTalentLink: (chunks: ReactNode) =>
                            linkAccessor(paths.search(), chunks),
                          managerDashboardLink: (chunks: ReactNode) =>
                            linkAccessor(paths.managerDashboard(), chunks),
                          requestHistoryLink: (chunks: ReactNode) =>
                            scrollToLinkAccessor(
                              sections.requestHistory.id,
                              chunks,
                            ),
                        },
                      )}
                    </div>
                    <div
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x0.25)"
                    >
                      {/* sorting controls */}
                      <div
                        data-h2-display="base(flex)"
                        data-h2-flex-direction="base(row)"
                        data-h2-gap="base(x0.5)"
                      >
                        <span>
                          {intl.formatMessage(formMessages.sortBy)}
                          {intl.formatMessage(commonMessages.dividingColon)}
                        </span>
                        <Button
                          onClick={() => setActiveRequestsSortedBy("date")}
                          {...(activeRequestsSortedBy === "date"
                            ? selectedSortLink
                            : unselectedSortLink)}
                        >
                          {intl.formatMessage(commonMessages.date)}
                        </Button>
                        <Button
                          onClick={() => setActiveRequestsSortedBy("status")}
                          {...(activeRequestsSortedBy === "status"
                            ? selectedSortLink
                            : unselectedSortLink)}
                        >
                          {intl.formatMessage(commonMessages.status)}
                        </Button>
                        <Button
                          onClick={() =>
                            setActiveRequestsSortedBy("classification")
                          }
                          {...(activeRequestsSortedBy === "classification"
                            ? selectedSortLink
                            : unselectedSortLink)}
                        >
                          {intl.formatMessage(processMessages.classification)}
                        </Button>
                      </div>
                      <CardBasic>
                        {activeRequests.length ? (
                          <PreviewList.Root>
                            {activeRequests.map((request) => (
                              <PoolCandidateSearchRequestPreviewListItem
                                key={request.id}
                                poolCandidateSearchRequestQuery={request}
                              />
                            ))}
                          </PreviewList.Root>
                        ) : (
                          <Well data-h2-text-align="base(center)">
                            <p data-h2-font-weight="base(bold)">
                              {intl.formatMessage({
                                defaultMessage:
                                  "You don't have any active requests at the moment.",
                                id: "3PwQT7",
                                description:
                                  "Title for notice when there are no pool candidate search requests",
                              })}
                            </p>
                            <p>
                              {intl.formatMessage(
                                {
                                  defaultMessage:
                                    'You can start a new talent request using the "<link>New request</link>" button found in the page\'s table of contents.',
                                  id: "xuckIo",
                                  description:
                                    "Body for notice when there are no pool candidate search requests",
                                },
                                {
                                  link: (chunks: ReactNode) =>
                                    linkAccessor(paths.search(), chunks),
                                },
                              )}
                            </p>
                          </Well>
                        )}
                      </CardBasic>
                    </div>
                  </div>
                </TableOfContents.Section>
                <TableOfContents.Section id={sections.requestHistory.id}>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x1.5)"
                  >
                    <Heading
                      Icon={FolderIcon}
                      size="h2"
                      color="secondary"
                      data-h2-margin="base(0)"
                    >
                      {intl.formatMessage(sections.requestHistory.title)}
                    </Heading>
                    <div>
                      {intl.formatMessage({
                        defaultMessage:
                          "Completed talent requests will automatically appear in this section. From here, you can browse your entire request history, including each request’s filters, skills, and additional comments.",
                        id: "FVc2AH",
                        description:
                          "description of the request history section on the manager request history page",
                      })}
                    </div>
                    <div
                      data-h2-display="base(flex)"
                      data-h2-flex-direction="base(column)"
                      data-h2-gap="base(x0.25)"
                    >
                      {/* sorting controls */}
                      <div
                        data-h2-display="base(flex)"
                        data-h2-flex-direction="base(row)"
                        data-h2-gap="base(x0.5)"
                      >
                        <span>
                          {intl.formatMessage(formMessages.sortBy)}
                          {intl.formatMessage(commonMessages.dividingColon)}
                        </span>
                        <Button
                          onClick={() => setRequestHistorySortedBy("date")}
                          {...(requestHistorySortedBy === "date"
                            ? selectedSortLink
                            : unselectedSortLink)}
                        >
                          {intl.formatMessage(commonMessages.date)}
                        </Button>
                        <Button
                          onClick={() =>
                            setRequestHistorySortedBy("classification")
                          }
                          {...(requestHistorySortedBy === "classification"
                            ? selectedSortLink
                            : unselectedSortLink)}
                        >
                          {intl.formatMessage(processMessages.classification)}
                        </Button>
                      </div>
                      <CardBasic>
                        {inactiveRequests.length ? (
                          <PreviewList.Root>
                            {inactiveRequests.map((request) => (
                              <PoolCandidateSearchRequestPreviewListItem
                                key={request.id}
                                poolCandidateSearchRequestQuery={request}
                              />
                            ))}
                          </PreviewList.Root>
                        ) : (
                          <Well data-h2-text-align="base(center)">
                            <p data-h2-font-weight="base(bold)">
                              {intl.formatMessage({
                                defaultMessage:
                                  "You don't have any completed requests yet.",
                                id: "bTkPVZ",
                                description:
                                  "Title for notice when there are no pool candidate search requests",
                              })}
                            </p>
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "Requests will automatically move here when they are completed.",
                                id: "WxuhIh",
                                description:
                                  "Body for notice when there are no pool candidate search requests",
                              })}
                            </p>
                          </Well>
                        )}
                      </CardBasic>
                    </div>
                  </div>
                </TableOfContents.Section>
              </div>
            </TableOfContents.Content>
          </TableOfContents.Wrapper>
        </div>
      </section>
    </>
  );
};

const ManagerRequestHistory_Query = graphql(/* GraphQL */ `
  query ManagerRequestHistory {
    me {
      ...ManagerRequestHistoryUser
    }
  }
`);

const ManagerRequestHistoryPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ManagerRequestHistory_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ManagerRequestHistory userQuery={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.viewOwnRequests}>
    <ManagerRequestHistoryPage />
  </RequireAuth>
);

Component.displayName = "ManagerRequestHistoryPage";

export default ManagerRequestHistoryPage;
