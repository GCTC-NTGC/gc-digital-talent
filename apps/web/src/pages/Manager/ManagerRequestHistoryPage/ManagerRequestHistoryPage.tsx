import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import PlusCircleIconMini from "@heroicons/react/20/solid/PlusCircleIcon";
import DocumentMagnifyingGlassIcon from "@heroicons/react/24/outline/DocumentMagnifyingGlassIcon";
import FolderIcon from "@heroicons/react/24/outline/FolderIcon";

import {
  ThrowNotFound,
  Pending,
  Link,
  TaskCard,
  PreviewList,
  Well,
  TableOfContents,
  Separator,
  Heading,
  ScrollToLink,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

import PoolCandidateSearchRequestPreviewListItem from "../components/PoolCandidateSearchRequestPreviewListItem";
import pageMessages from "./messages";
import managerDashboardMessages from "../ManagerDashboardPage/messages";
import sections from "./sections";

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

const ManagerRequestHistoryUser_Fragment = graphql(/* GraphQL */ `
  fragment ManagerRequestHistoryUser on User {
    id
    firstName
    poolCandidateSearchRequests {
      id
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

  const user = getFragment(ManagerRequestHistoryUser_Fragment, userQuery);

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

  // Easily identify parts of the page that are unfinished still.
  const showUnfinishedPieces = true;

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.profileAndApplications)}
        description={formattedPageSubtitle}
      />
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
                      <span data-h2-color="base(black.light)">{`(x)`}</span>
                    </Heading>
                    <div>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "When you use the “<findTalentLink>Find talent</findTalentLink>” tool to request referrals for potential hires, your criteria and notes will be saved as a request and tracked in this section. Requests that are currently in progress will also appear on your “<managerDashboardLink>Manager dashboard</managerDashboardLink>”. When a request is completed, it will automatically move from this section to your <requestHistoryLink>request history</requestHistoryLink>.",
                          id: "p6YJ1q",
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
                    <TaskCard.Root
                      icon={WrenchScrewdriverIcon}
                      title={intl.formatMessage({
                        defaultMessage: "Your manager tools",
                        id: "iChSXW",
                        description: "Card title for the manager tools",
                      })}
                      headingColor="primary"
                      headingAs="h2"
                    >
                      <TaskCard.Item>
                        <div
                          data-h2-display="base(flex)"
                          data-h2-flex-direction="base(column)"
                          data-h2-gap="base(x1)"
                        >
                          <div>
                            {showUnfinishedPieces
                              ? intl.formatMessage(
                                  {
                                    defaultMessage:
                                      'When you submit a request for talent using the "<findTalentLink>Find talent</findTalentLink>" feature, it will appear in this list while it remains active. Requests that have been closed can be found by visiting the "<allRequestsLink>All requests</allRequestsLink>" page.',
                                    id: "OWLaKF",
                                    description:
                                      "instructional text for the 'Your talent requests' tool",
                                  },
                                  {
                                    findTalentLink: (chunks: ReactNode) =>
                                      linkAccessor(paths.search(), chunks),
                                    allRequestsLink: (chunks: ReactNode) =>
                                      linkAccessor("#", chunks), // This link is missing an href since the "Your talent requests" page doesn't exist yet.
                                  },
                                )
                              : null}
                          </div>

                          {user.poolCandidateSearchRequests?.length ? (
                            <PreviewList.Root>
                              {user.poolCandidateSearchRequests?.map(
                                (request) => (
                                  <PoolCandidateSearchRequestPreviewListItem
                                    key={request.id}
                                    poolCandidateSearchRequestQuery={request}
                                    showUnfinishedPieces={showUnfinishedPieces}
                                  />
                                ),
                              )}
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
                                {intl.formatMessage({
                                  defaultMessage:
                                    'You can start a new talent request using the "New request" button or navigating to the "Find talent" page from the main navigation.',
                                  id: "6jBrNA",
                                  description:
                                    "Body for notice when there are no pool candidate search requests",
                                })}
                              </p>
                            </Well>
                          )}
                        </div>
                      </TaskCard.Item>
                    </TaskCard.Root>
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
                          "Completed talent requests will appear in this section automatically. From here, you can browse your entire request history, including each request’s filters, skills, and additional comments.",
                        id: "JR9d2J",
                        description:
                          "description of the request history section on the manager request history page",
                      })}
                    </div>
                    <TaskCard.Root
                      icon={WrenchScrewdriverIcon}
                      title={intl.formatMessage({
                        defaultMessage: "Your manager tools",
                        id: "iChSXW",
                        description: "Card title for the manager tools",
                      })}
                      headingColor="primary"
                      headingAs="h2"
                    >
                      <TaskCard.Item>
                        <div
                          data-h2-display="base(flex)"
                          data-h2-flex-direction="base(column)"
                          data-h2-gap="base(x1)"
                        >
                          <div>
                            {showUnfinishedPieces
                              ? intl.formatMessage(
                                  {
                                    defaultMessage:
                                      'When you submit a request for talent using the "<findTalentLink>Find talent</findTalentLink>" feature, it will appear in this list while it remains active. Requests that have been closed can be found by visiting the "<allRequestsLink>All requests</allRequestsLink>" page.',
                                    id: "OWLaKF",
                                    description:
                                      "instructional text for the 'Your talent requests' tool",
                                  },
                                  {
                                    findTalentLink: (chunks: ReactNode) =>
                                      linkAccessor(paths.search(), chunks),
                                    allRequestsLink: (chunks: ReactNode) =>
                                      linkAccessor("#", chunks), // This link is missing an href since the "Your talent requests" page doesn't exist yet.
                                  },
                                )
                              : null}
                          </div>

                          {user.poolCandidateSearchRequests?.length ? (
                            <PreviewList.Root>
                              {user.poolCandidateSearchRequests?.map(
                                (request) => (
                                  <PoolCandidateSearchRequestPreviewListItem
                                    key={request.id}
                                    poolCandidateSearchRequestQuery={request}
                                    showUnfinishedPieces={showUnfinishedPieces}
                                  />
                                ),
                              )}
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
                                {intl.formatMessage({
                                  defaultMessage:
                                    'You can start a new talent request using the "New request" button or navigating to the "Find talent" page from the main navigation.',
                                  id: "6jBrNA",
                                  description:
                                    "Body for notice when there are no pool candidate search requests",
                                })}
                              </p>
                            </Well>
                          )}
                        </div>
                      </TaskCard.Item>
                    </TaskCard.Root>
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
  <RequireAuth roles={[ROLE_NAME.Manager]}>
    <ManagerRequestHistoryPage />
  </RequireAuth>
);

Component.displayName = "ManagerRequestHistoryPage";

export default ManagerRequestHistoryPage;