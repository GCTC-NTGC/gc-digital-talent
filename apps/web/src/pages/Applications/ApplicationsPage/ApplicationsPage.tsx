import { useIntl } from "react-intl";
import { useQuery } from "urql";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { useMemo, useState } from "react";

import {
  Pending,
  Container,
  Card,
  Heading,
  Button,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { graphql, getFragment } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { MAX_DATE } from "@gc-digital-talent/date-helpers";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import ReviewApplicationPreviewList from "~/components/ReviewApplicationPreviewList/ReviewApplicationPreviewList";

export const ApplicationsPage_Fragment = graphql(/* GraphQL */ `
  fragment ApplicationsPage on PoolCandidate {
    submittedAt
    ...ReviewApplicationPreviewList
  }
`);

interface ApplicationsPageProps {
  query: FragmentType<typeof ApplicationsPage_Fragment>[];
}

type OrderValues = "newest" | "oldest";

export const ApplicationsPage = ({ query }: ApplicationsPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const applications = getFragment(ApplicationsPage_Fragment, query);

  const [orderBy, setOrderBy] = useState<OrderValues>("newest");

  const sortedApplications = useMemo(
    () =>
      unpackMaybes(applications).sort((a, b) => {
        const aDate =
          "submittedAt" in a && a?.submittedAt
            ? new Date(a.submittedAt)
            : MAX_DATE;
        const bDate =
          "submittedAt" in b && b?.submittedAt
            ? new Date(b.submittedAt)
            : MAX_DATE;
        return orderBy === "newest"
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      }),
    [applications, orderBy],
  );

  const pageTitle = intl.formatMessage({
    defaultMessage: "All applications",
    id: "9dEyux",
    description: "Job applications title",
  });

  const pageSubtitle = intl.formatMessage({
    defaultMessage: "View and manage your application history.",
    id: "cFrdgi",
    description: "Job applications subtitle",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        label: pageTitle,
        url: paths.applications(),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} description={pageSubtitle} />
      <Hero title={pageTitle} subtitle={pageSubtitle} crumbs={crumbs} />
      <section className="mb-18">
        <Container>
          <Heading level="h2" size="h3" color="primary" icon={CalendarIcon}>
            {intl.formatMessage({
              defaultMessage: "Application history",
              id: "kKAase",
              description: "Heading for all applications",
            })}
          </Heading>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage:
                "This page provides a complete overview of your application history.",
              id: "vfEb+6",
              description: "Description for all applications",
            })}
          </p>
          <div
            role="group"
            aria-labelledby="sortFilter"
            className="my-6 flex items-center gap-3"
          >
            <span id="sortFilter">
              {intl.formatMessage({
                defaultMessage: "Order",
                id: "HdmGJ4",
                description: "Text to filter order",
              })}
              {intl.formatMessage(commonMessages.dividingColon)}
            </span>
            <Button
              onClick={() => setOrderBy("newest")}
              mode="inline"
              color={orderBy === "newest" ? "primary" : "black"}
            >
              {intl.formatMessage({
                defaultMessage: "Newest",
                id: "fZwNME",
                description: "Order by newest",
              })}
            </Button>
            <Button
              onClick={() => setOrderBy("oldest")}
              mode="inline"
              color={orderBy === "oldest" ? "primary" : "black"}
            >
              {intl.formatMessage({
                defaultMessage: "Oldest",
                id: "Sk4nXd",
                description: "Order by oldest",
              })}
            </Button>
          </div>
          <Card>
            <ReviewApplicationPreviewList
              applicationsQuery={sortedApplications}
              doNotSort
            />
          </Card>
        </Container>
      </section>
    </>
  );
};

const Applications_Query = graphql(/* GraphQL */ `
  query Applications {
    me {
      poolCandidates {
        ...ApplicationsPage
      }
    }
  }
`);

export const ApplicationsPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: Applications_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <ApplicationsPage query={unpackMaybes(data?.me?.poolCandidates)} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ApplicationsPageApi />
  </RequireAuth>
);
Component.displayName = "ApplicationsPage";

export default Component;
