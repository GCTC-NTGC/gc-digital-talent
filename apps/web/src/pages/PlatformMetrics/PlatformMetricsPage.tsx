import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";
import { Alert, Container, Heading, Pending } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import TalentRequestMetricsSections from "./components/TalentRequestMetricsSections";

const PlatformMetricsPage_Query = graphql(/* GraphQL */ `
  query PlatformMetricsPage {
    platformMetrics {
      computedAt
      talentRequests {
        windowStart
        ...TalentRequestMetrics
      }
    }
  }
`);

export const PlatformMetricsPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitles.platformMetrics);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.platformMetrics(),
      },
    ],
  });

  const [{ data, fetching, error }] = useQuery({
    query: PlatformMetricsPage_Query,
  });

  const metrics = data?.platformMetrics;

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper>
        <Container className="my-18">
          <Pending fetching={fetching} error={error}>
            {metrics ? (
              <>
                <Heading level="h2" size="h4" className="mt-0 mb-3">
                  {intl.formatMessage({
                    defaultMessage: "Talent requests",
                    id: '7DGc+M',
                    description: "Heading for the talent request metric group",
                  })}
                </Heading>
                <p className="mb-3">
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "Covering requests submitted since {windowStart}. Figures are recalculated overnight, so they can be up to a day behind.",
                      id: 'pAY+A6',
                      description:
                        "Explanation of the period and freshness of the metrics",
                    },
                    {
                      windowStart: formatDate({
                        date: parseDateTimeUtc(
                          metrics.talentRequests.windowStart,
                        ),
                        formatString: "PPP",
                        intl,
                      }),
                    },
                  )}
                </p>
                <p className="mb-6 text-gray-600 dark:text-gray-200">
                  {intl.formatMessage(
                    {
                      defaultMessage: "Last calculated {computedAt}.",
                      id: 'YGvuaT',
                      description: "When the metrics were last calculated",
                    },
                    {
                      computedAt: formatDate({
                        date: parseDateTimeUtc(metrics.computedAt),
                        formatString: "PPPp",
                        intl,
                      }),
                    },
                  )}
                </p>
                <TalentRequestMetricsSections
                  metricsQuery={metrics.talentRequests}
                  computedAt={metrics.computedAt}
                />
              </>
            ) : (
              // Reached before the first nightly run, and again briefly after a
              // release that changes the shape of the stored metrics. Both are
              // expected states rather than errors.
              <Alert.Root type="info" live={false}>
                <Alert.Title>
                  {intl.formatMessage({
                    defaultMessage: "Metrics haven't been calculated yet",
                    id: 'TeDVop',
                    description:
                      "Title shown when no platform metrics are available",
                  })}
                </Alert.Title>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "They're generated overnight, so check back tomorrow.",
                    id: 'hGnAik',
                    description:
                      "Message shown when no platform metrics are available",
                  })}
                </p>
              </Alert.Root>
            )}
          </Pending>
        </Container>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <PlatformMetricsPage />
  </RequireAuth>
);

Component.displayName = "AdminPlatformMetricsPage";

export default Component;
