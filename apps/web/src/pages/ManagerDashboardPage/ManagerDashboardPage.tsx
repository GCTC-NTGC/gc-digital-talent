import { useIntl } from "react-intl";
import { useQuery } from "urql";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import { ReactNode } from "react";

import { ThrowNotFound, Pending, Heading, Link } from "@gc-digital-talent/ui";
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
              <div data-h2-background-color="base(primary.lightest)">
                <Heading
                  Icon={WrenchScrewdriverIcon}
                  level="h2"
                  data-h2-margin="base(0)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Your manager tools",
                    id: "iChSXW",
                    description: "Card title for the manager tools",
                  })}
                </Heading>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "When you submit a request for talent using the “<a>Find talent</a>” feature, it will appear in this list while it remains active. Recipients of your request will have a fixed amount of time to reply, after which, only those who have accepted to share their information will remain available to you.",
                    id: "Z4lyjB",
                    description: "Helper instructions for the manager tools",
                  },
                  {
                    a: (chunks: ReactNode) =>
                      linkAccessor(paths.search(), chunks),
                  },
                )}
              </div>
            </div>
            {/* Sidebar */}
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
              data-h2-max-width="p-tablet(x14)"
            >
              <div data-h2-background-color="base(quinary.lightest)">
                <Heading level="h2" data-h2-margin="base(0)">
                  {intl.formatMessage({
                    defaultMessage: "Current role",
                    id: "C0LMCq",
                    description: "Card title for a nav role switcher",
                  })}
                </Heading>
                {intl.formatMessage({
                  defaultMessage:
                    "Easily switch between roles your account has access to.",
                  id: "gPvdHC",
                  description: "Helper instructions for a nav role switcher",
                })}
              </div>
              <div data-h2-background-color="base(quaternary.lightest)">
                <Heading level="h2" data-h2-margin="base(0)">
                  {intl.formatMessage({
                    defaultMessage: "Your information",
                    id: "jALTj0",
                    description: "Card title for an information card",
                  })}
                </Heading>
                {intl.formatMessage({
                  defaultMessage:
                    "Describe your leadership style and team culture to give applicants an idea of what working with you is like.",
                  id: "lbtzDG",
                  description:
                    "Helper instructions for a 'manager profile' card",
                })}
                {intl.formatMessage({
                  defaultMessage:
                    "Manage your name, contact info, privacy settings, notifications, or delete your account.",
                  id: "3d4GDu",
                  description:
                    "Helper instructions for an 'account and privacy' card",
                })}
              </div>
              <div data-h2-background-color="base(tertiary.lightest)">
                <Heading level="h2" data-h2-margin="base(0)">
                  {intl.formatMessage({
                    defaultMessage: "Resources",
                    id: "nGSUzp",
                    description: "Card title for a 'resources' card",
                  })}
                </Heading>
                {intl.formatMessage({
                  defaultMessage:
                    "Browse a complete list of available skills, learn how they’re organized, and submit skill recommendations.",
                  id: "p3UL9X",
                  description:
                    "Helper instructions for a 'learn about skills' card",
                })}
                {intl.formatMessage({
                  defaultMessage:
                    "Explore a library of templates for job advertisements that provide a great starting point for your next hire.",
                  id: "DPN4v3",
                  description:
                    "Helper instructions for an 'browse job templates' card",
                })}
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
