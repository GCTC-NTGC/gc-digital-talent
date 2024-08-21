import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";

import {
  ThrowNotFound,
  Pending,
  Heading,
  Link,
  TaskCard,
  PreviewList,
  DropdownMenu,
  Button,
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

import pageMessages from "./messages";

const linkAccessor = (href: string, chunks: ReactNode) => {
  return (
    <Link href={href} color="black">
      {chunks}
    </Link>
  );
};

export const ManagerDashboardUser_Fragment = graphql(/* GraphQL */ `
  fragment ManagerDashboardUser on User {
    id
    firstName
  }
`);

interface ManagerDashboardProps {
  userQuery: FragmentType<typeof ManagerDashboardUser_Fragment>;
}

const ManagerDashboard = ({ userQuery }: ManagerDashboardProps) => {
  const paths = useRoutes();
  const intl = useIntl();
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
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column)"
                    data-h2-gap="base(x0.5)"
                  >
                    <div>
                      {intl.formatMessage(
                        {
                          defaultMessage: "Your talent searches ({count})",
                          id: "aeCkWS",
                          description:
                            "Title for a list of talent searches with a count",
                        },
                        {
                          count: "0",
                        },
                      )}
                    </div>
                    <div>
                      <Link>View all searches</Link>
                      &bull;
                      <Link>Start a new search</Link>
                    </div>
                    <div>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "When you submit a request for talent using the “<a>Find talent</a>” feature, it will appear in this list while it remains active. Recipients of your request will have a fixed amount of time to reply, after which, only those who have accepted to share their information will remain available to you.",
                          id: "Z4lyjB",
                          description:
                            "Helper instructions for the manager tools",
                        },
                        {
                          a: (chunks: ReactNode) =>
                            linkAccessor(paths.search(), chunks),
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
                        buttonName="IT01: Junior application developer"
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
                        buttonName="IT-02: Application developer"
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
                        buttonName="IT-02: Database architect"
                      />
                    </PreviewList.Root>
                  </div>
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
              <TaskCard.Root
                headingColor="quinary"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Current role",
                  id: "C0LMCq",
                  description: "Card title for a nav role switcher",
                })}
              >
                <TaskCard.Item>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button utilityIcon={ChevronDownIcon}>Role</Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end" collisionPadding={2}>
                      <DropdownMenu.Item>Applicant</DropdownMenu.Item>
                      <DropdownMenu.Item>Manager</DropdownMenu.Item>
                      <DropdownMenu.Item>Admin</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                  <div>
                    {intl.formatMessage({
                      defaultMessage:
                        "Easily switch between roles your account has access to.",
                      id: "gPvdHC",
                      description:
                        "Helper instructions for a nav role switcher",
                    })}
                  </div>
                </TaskCard.Item>
              </TaskCard.Root>
              <div data-h2-background-color="base(quaternary.lightest)">
                <Heading level="h2">
                  {intl.formatMessage({
                    defaultMessage: "Your information",
                    id: "jALTj0",
                    description: "Card title for an information card",
                  })}
                </Heading>
                <Heading level="h3">
                  {intl.formatMessage({
                    defaultMessage: "Manager profile",
                    id: "hkvlOx",
                    description: "Link to manager profile page",
                  })}
                </Heading>
                <div>
                  {intl.formatMessage({
                    defaultMessage:
                      "Describe your leadership style and team culture to give applicants an idea of what working with you is like.",
                    id: "lbtzDG",
                    description:
                      "Helper instructions for a 'manager profile' card",
                  })}
                </div>
                <Heading level="h3">
                  {intl.formatMessage({
                    defaultMessage: "Account and privacy",
                    id: "8KTW4C",
                    description: "Link to account and privacy page",
                  })}
                </Heading>
                {intl.formatMessage({
                  defaultMessage:
                    "Manage your name, contact info, privacy settings, notifications, or delete your account.",
                  id: "3d4GDu",
                  description:
                    "Helper instructions for an 'account and privacy' card",
                })}
              </div>
              <div data-h2-background-color="base(tertiary.lightest)">
                <Heading level="h2">
                  {intl.formatMessage({
                    defaultMessage: "Resources",
                    id: "nGSUzp",
                    description: "Card title for a 'resources' card",
                  })}
                </Heading>
                <Heading level="h3">
                  {intl.formatMessage({
                    defaultMessage: "Learn about skills",
                    id: "n40Nry",
                    description: "Link for the 'learn about skills' card",
                  })}
                </Heading>
                {intl.formatMessage({
                  defaultMessage:
                    "Browse a complete list of available skills, learn how they’re organized, and submit skill recommendations.",
                  id: "p3UL9X",
                  description:
                    "Helper instructions for a 'learn about skills' card",
                })}
                <Heading level="h3">
                  {intl.formatMessage({
                    defaultMessage: "Browse job templates",
                    id: "bLxoQL",
                    description: "Link for the 'browse job templates' card",
                  })}
                </Heading>
                {intl.formatMessage({
                  defaultMessage:
                    "Explore a library of templates for job advertisements that provide a great starting point for your next hire.",
                  id: "DPN4v3",
                  description:
                    "Helper instructions for an 'browse job templates' card",
                })}
                <Heading level="h3">
                  {intl.formatMessage({
                    defaultMessage: "Directive on Digital Talent",
                    id: "H+qaPk",
                    description:
                      "Link for the 'directive on digital talent' card",
                  })}
                </Heading>
                {intl.formatMessage({
                  defaultMessage:
                    "Learn more about the directive, how it applies to your context, and understand your obligations.",
                  id: "548yXW",
                  description:
                    "Helper instructions for a 'directive on digital talent' card",
                })}
              </div>
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
