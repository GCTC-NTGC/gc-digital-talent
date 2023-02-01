import React from "react";
import { useIntl } from "react-intl";

import Hero from "@common/components/Hero/Hero";
import { ThrowNotFound } from "@common/components/NotFound";
import SEO from "@common/components/SEO/SEO";
import Pending from "@common/components/Pending";
import { notEmpty } from "@common/helpers/util";

import { Scalars, useMyApplicationsQuery } from "~/api/generated";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

import ApplicationCard, {
  type Application,
} from "./components/ApplicationCard/ApplicationCard";
import ArchivedApplications from "./components/ArchivedApplications";
import { statusSortMap } from "./components/ApplicationCard/maps";

interface MyApplicationsProps {
  applications: Array<Application>;
  userId: Scalars["ID"];
}

export const MyApplications = ({
  applications,
  userId,
}: MyApplicationsProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const archivedApplications = applications.filter((application) => {
    return !!application.archivedAt;
  });

  const activeApplications = applications.filter((application) => {
    return !application.archivedAt;
  });

  const sortedApplications = activeApplications.sort((a, b) => {
    if (a.status && b.status) {
      return statusSortMap[a.status] - statusSortMap[b.status];
    }
    return 0;
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "My Applications",
    id: "Boze7x",
    description: "Title for page that displays current users applications.",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.applications(userId),
    },
  ]);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <div data-h2-padding="base(x3, 0, x3, 0)">
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          {sortedApplications.length > 0 ? (
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x0.5, 0)"
            >
              {sortedApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          ) : (
            <p>
              {intl.formatMessage({
                defaultMessage: "You currently have no applications.",
                id: "rw05Jq",
                description:
                  "Messaged displayed when a user has no applications.",
              })}
            </p>
          )}
          <ArchivedApplications applications={archivedApplications} />
        </div>
      </div>
    </>
  );
};

const MyApplicationsPage = () => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useMyApplicationsQuery();

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me?.poolCandidates ? (
        <MyApplications
          userId={data.me.id}
          applications={data.me.poolCandidates.filter(notEmpty)}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage({
            defaultMessage: "Error, applications unable to be loaded",
            id: "Q7yh4j",
            description: "My applications error message, placeholder",
          })}
        />
      )}
    </Pending>
  );
};

export default MyApplicationsPage;
