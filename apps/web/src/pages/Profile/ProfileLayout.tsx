import type { MessageDescriptor } from "react-intl";
import { useIntl } from "react-intl";
import type { UIMatch } from "react-router";
import { Outlet, useMatches } from "react-router";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { Container } from "@gc-digital-talent/ui";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import { requireUser } from "~/routing/auth";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";

import type { Route } from "./+types/ProfileLayout";

interface ProfileHandle {
  pageTitle?: MessageDescriptor;
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, { roles: [{ name: ROLE_NAME.Applicant }] });
    return await next();
  },
];

const ProfileLayout = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const matches = useMatches() as UIMatch<unknown, ProfileHandle>[];

  const currentPage = matches[matches.length - 1];

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      ...(currentPage.handle?.pageTitle
        ? [
            {
              label: intl.formatMessage(currentPage.handle.pageTitle),
              url: currentPage.pathname,
            },
          ]
        : []),
    ],
  });

  const pageTitle = intl.formatMessage(navigationMessages.applicantProfile);
  const description = intl.formatMessage({
    defaultMessage:
      "Manage your work profile, employment preferences, career experience and skills.",
    id: "7k+D5r",
    description: "Description for the applicant profile section",
  });

  return (
    <>
      <SEO title={pageTitle} description={description} />
      <Hero
        title={pageTitle}
        subtitle={description}
        crumbs={crumbs}
        navTabs={[
          {
            label: intl.formatMessage(navigationMessages.profilePage),
            url: paths.profile(),
          },
          {
            label: intl.formatMessage(navigationMessages.careerExperience),
            url: paths.careerTimeline(),
          },
          {
            label: intl.formatMessage(navigationMessages.skillPortfolio),
            url: paths.skillPortfolio(),
          },
        ]}
      />
      <Container className="mt-18">
        <Outlet />
      </Container>
    </>
  );
};

export default ProfileLayout;
