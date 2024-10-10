import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";

import {
  ThrowNotFound,
  Pending,
  Link,
  TaskCard,
  PreviewList,
  ResourceBlock,
  Accordion,
  AccordionMetaData,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { useLocalStorage } from "@gc-digital-talent/storage";

import SEO from "~/components/SEO/SEO";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

import pageMessages from "./messages";

const linkAccessor = (href: string, chunks: ReactNode) => {
  return (
    <Link href={href} color="black">
      {chunks}
    </Link>
  );
};

const ManagerDashboardUser_Fragment = graphql(/* GraphQL */ `
  fragment ManagerDashboardUser on User {
    id
    firstName
  }
`);

interface ManagerDashboardProps {
  userQuery: FragmentType<typeof ManagerDashboardUser_Fragment>;
}

type AccordionItems = ("your_talent_searches" | "")[];

const ManagerDashboard = ({ userQuery }: ManagerDashboardProps) => {
  const paths = useRoutes();
  const intl = useIntl();
  const [accordionItems, setAccordionItems] = useLocalStorage<AccordionItems>(
    "managerDashboardPage:managerToolsAccordion:expandedItems",
    ["your_talent_searches"],
  );
  const user = getFragment(ManagerDashboardUser_Fragment, userQuery);

  const formattedPageTitle = intl.formatMessage(pageMessages.pageTitle);
  const formattedSubTitle = intl.formatMessage(pageMessages.subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: paths.profile(),
      },
    ],
  });

  // Easily identify parts of the page that are unfinished still.
  const showUnfinishedPieces = true;

  const talentRequestMetaData: AccordionMetaData[] = [
    {
      key: "request-history-key",
      type: "link",
      // This link is missing an href since the page doesn't exist yet.  Probably #10982
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "All requests",
            id: "mJKi1Y",
            description: "Link to a page to view all the requests",
          })}
        </>
      ),
    },
    {
      key: "new-request-key",
      type: "link",
      children: (
        <>
          {intl.formatMessage({
            defaultMessage: "New request",
            id: "BGQaDq",
            description: "Link to a page to start a new request",
          })}
        </>
      ),
    },
  ];

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.profileAndApplications)}
        description={formattedSubTitle}
      />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage: "Welcome back, {firstName}",
            id: "Q/f5AF",
            description:
              "Title displayed in the hero section of the Search page.",
          },
          {
            firstName: user.firstName,
          },
        )}
        subtitle={formattedSubTitle}
        crumbs={crumbs}
      />

      <section data-h2-margin="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          {/* Two column layout */}
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-gap="base(x1)"
          >
            {/* Main content */}
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
              data-h2-flex-grow="p-tablet(2)"
            >
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
                  <Accordion.Root
                    value={accordionItems}
                    onValueChange={(newValue: AccordionItems) => {
                      setAccordionItems(newValue);
                    }}
                    type="multiple"
                    // we don't need that fat padding in the accordion inside the task card
                    data-h2-padding-bottom="base:selectors[>.Accordion__Item > .Accordion__Content](x.5)"
                  >
                    <Accordion.Item value="your_talent_searches">
                      <Accordion.Trigger>
                        {intl.formatMessage(
                          {
                            defaultMessage: "Your talent requests ({count})",
                            id: "7l6Xay",
                            description:
                              "Title for a list of your talent requests with a count",
                          },
                          {
                            count: "0",
                          },
                        )}
                      </Accordion.Trigger>
                      <Accordion.MetaData metadata={talentRequestMetaData} />
                      <Accordion.Content>
                        <div
                          data-h2-display="base(flex)"
                          data-h2-flex-direction="base(column)"
                          data-h2-gap="base(x1)"
                        >
                          <div>
                            {intl.formatMessage(
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
                                  linkAccessor("#", chunks),
                              },
                            )}
                          </div>

                          <PreviewList.Root>
                            <PreviewList.Item
                              title="IT01: Junior application developer"
                              metaData={[
                                {
                                  key: "status-chip",
                                  type: "chip",
                                  color: "secondary",
                                  children: "Submitted",
                                },
                                {
                                  key: "match-count",
                                  type: "text",
                                  children: "40 potential matches",
                                },
                                {
                                  key: "open-date",
                                  type: "text",
                                  children: "Opened on: April 30th, 2024",
                                },
                              ]}
                              action={
                                <PreviewList.Button label="IT01: Junior application developer" />
                              }
                            />
                            <PreviewList.Item
                              title="IT-02: Application developer"
                              metaData={[
                                {
                                  key: "status-chip",
                                  type: "chip",
                                  color: "secondary",
                                  children: "Submitted",
                                },
                                {
                                  key: "match-count",
                                  type: "text",
                                  children: "56 potential matches",
                                },
                                {
                                  key: "open-date",
                                  type: "text",
                                  children: "Opened on: April 30th, 2024",
                                },
                              ]}
                              action={
                                <PreviewList.Button label="IT-02: Application developer" />
                              }
                            />
                            <PreviewList.Item
                              title="IT-02: Database architect"
                              metaData={[
                                {
                                  key: "status-chip",
                                  type: "chip",
                                  color: "warning",
                                  children: "Awaiting response",
                                },
                                {
                                  key: "match-count",
                                  type: "text",
                                  children: "12 potential matches",
                                },
                                {
                                  key: "open-date",
                                  type: "text",
                                  children: "Opened on: April 30th, 2024",
                                },
                              ]}
                              action={
                                <PreviewList.Button label="IT-02: Database architect" />
                              }
                            />
                          </PreviewList.Root>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>
                </TaskCard.Item>
              </TaskCard.Root>
            </div>
            {/* Sidebar */}
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
              data-h2-max-width="p-tablet(x14)"
            >
              {/* Switch to new component in #11031 */}
              <ResourceBlock.Root
                headingColor="quinary"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Current role",
                  id: "C0LMCq",
                  description: "Card title for a nav role switcher",
                })}
              >
                <ResourceBlock.LinkMenuItem
                  links={[
                    {
                      title: "Applicant",
                      href: "#",
                      isSelected: false,
                    },
                    {
                      title: "Manager",
                      href: "#",
                      isSelected: true,
                    },
                  ]}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Easily switch between roles your account has access to.",
                    id: "gPvdHC",
                    description: "Helper instructions for a nav role switcher",
                  })}
                />
              </ResourceBlock.Root>
              <ResourceBlock.Root
                headingColor="quaternary"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Your information",
                  id: "jALTj0",
                  description: "Card title for an information card",
                })}
              >
                {showUnfinishedPieces ? (
                  // This block is missing an href since the page doesn't exist yet.  It also needs logic to dynamically set the state.
                  <ResourceBlock.SingleLinkItem
                    state="complete"
                    title={intl.formatMessage({
                      defaultMessage: "Manager profile",
                      id: "hkvlOx",
                      description: "Link to manager profile page",
                    })}
                    href="#"
                    description={intl.formatMessage({
                      defaultMessage:
                        "Describe your leadership style and team culture to give applicants an idea of what it’s like to work with you.",
                      id: "iJrZ6t",
                      description: "the 'Manager profile' tool's description",
                    })}
                  />
                ) : (
                  <></>
                )}
                {showUnfinishedPieces ? (
                  // This block is missing an href since the page doesn't exist yet.  It also needs logic to dynamically set the state.
                  <ResourceBlock.SingleLinkItem
                    state="complete"
                    title={intl.formatMessage({
                      defaultMessage: "Account and privacy",
                      id: "BMWvU8",
                      description: "Link to the 'Account and privacy' page",
                    })}
                    href="#"
                    description={intl.formatMessage({
                      defaultMessage:
                        "Manage your name, contact info, privacy settings, notifications, or delete your account.",
                      id: "3d4GDu",
                      description:
                        "Helper instructions for an 'account and privacy' card",
                    })}
                  />
                ) : (
                  <></>
                )}
              </ResourceBlock.Root>
              <ResourceBlock.Root
                headingColor="tertiary"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Resources",
                  id: "nGSUzp",
                  description: "Card title for a 'resources' card",
                })}
              >
                <ResourceBlock.SingleLinkItem
                  title={intl.formatMessage({
                    defaultMessage: "Learn about skills",
                    id: "n40Nry",
                    description: "Link for the 'learn about skills' card",
                  })}
                  href={paths.skills()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Browse a complete list of available skills, learn how they’re organized, and recommend additional skills to include.",
                    id: "CTBcGm",
                    description: "the 'Learn about skills' tool description",
                  })}
                />
                {showUnfinishedPieces ? (
                  // This block is missing an href since the page doesn't exist yet.
                  <ResourceBlock.SingleLinkItem
                    title={intl.formatMessage({
                      defaultMessage: "Browse job templates",
                      id: "bLxoQL",
                      description: "Link for the 'browse job templates' card",
                    })}
                    href="#"
                    description={intl.formatMessage({
                      defaultMessage:
                        "Explore a library of templates for job advertisements that provide a great starting point for your next hire.",
                      id: "ZCDsMF",
                      description:
                        "Helper instructions for the 'browse job templates' card",
                    })}
                  />
                ) : (
                  <></>
                )}
                <ResourceBlock.SingleLinkItem
                  title={intl.formatMessage({
                    defaultMessage: "Directive on Digital Talent",
                    id: "xXwUGs",
                    description: "Title for the digital talent directive page",
                  })}
                  href={paths.directive()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Learn more about the directive, how it applies to your context, and understand your obligations.",
                    id: "548yXW",
                    description:
                      "Helper instructions for a 'directive on digital talent' card",
                  })}
                />
              </ResourceBlock.Root>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const ManagerDashboard_Query = graphql(/* GraphQL */ `
  query ManagerDashboard {
    me {
      ...ManagerDashboardUser
    }
  }
`);

const ManagerDashboardPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ManagerDashboard_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ManagerDashboard userQuery={data.me} />
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
    <ManagerDashboardPage />
  </RequireAuth>
);

Component.displayName = "ManagerDashboardPage";

export default ManagerDashboardPage;
