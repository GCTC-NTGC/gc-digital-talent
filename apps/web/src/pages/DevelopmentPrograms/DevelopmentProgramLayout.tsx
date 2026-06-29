import type { MessageDescriptor } from "react-intl";
import { useIntl } from "react-intl";
import type { UIMatch } from "react-router";
import { Outlet, useMatches } from "react-router";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Container, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import adminMessages from "~/messages/adminMessages";
import pageTitles from "~/messages/pageTitles";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRequiredParams from "~/hooks/useRequiredParams";

interface DevelopmentProgramHandle {
  pageTitle?: MessageDescriptor;
}

const DevelopmentProgram_Query = graphql(/* GraphQL */ `
  query DevelopmentProgramLayout($id: UUID!) {
    developmentProgram(id: $id) {
      name {
        localized
      }
    }
  }
`);

interface RouteParams extends Record<string, string> {
  developmentProgramId: string;
}

const DevelopmentProgramLayout = () => {
  const intl = useIntl();
  const { developmentProgramId } = useRequiredParams<RouteParams>(
    "developmentProgramId",
  );

  const [{ data, fetching, error }] = useQuery({
    query: DevelopmentProgram_Query,
    variables: { id: developmentProgramId },
  });

  const paths = useRoutes();
  const matches = useMatches() as UIMatch<unknown, DevelopmentProgramHandle>[];

  const currentPage = matches[matches.length - 1];

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.adminDashboard),
        url: paths.adminDashboard(),
      },
      {
        label: intl.formatMessage(pageTitles.developmentPrograms),
        url: paths.developmentProgramTable(),
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

  const pageTitle = data?.developmentProgram?.name.localized;
  const description = intl.formatMessage({
    defaultMessage: "View and edit details about this program",
    id: "rdyy/m",
    description: "Description for the applicant profile section",
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.developmentProgram ? (
        <>
          <SEO
            title={pageTitle ?? intl.formatMessage(commonMessages.notFound)}
            description={description}
          />
          <Hero
            title={pageTitle}
            subtitle={description}
            crumbs={crumbs}
            navTabs={[
              {
                label: intl.formatMessage(adminMessages.details),
                url: paths.developmentProgramView(developmentProgramId),
              },
            ]}
          />
          <Container className="my-18">
            <Outlet />
          </Container>
        </>
      ) : (
        <ThrowNotFound message={intl.formatMessage(commonMessages.notFound)} />
      )}
    </Pending>
  );
};

const Component = () => (
  <RequireAuth rolesRequirements={[{ name: ROLE_NAME.PlatformAdmin }]}>
    <DevelopmentProgramLayout />
  </RequireAuth>
);

export default Component;
