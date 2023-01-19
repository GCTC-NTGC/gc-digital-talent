import React from "react";
import { useIntl } from "react-intl";

import { ThrowNotFound } from "@common/components/NotFound";
import SEO from "@common/components/SEO/SEO";
import Pending from "@common/components/Pending";
import imageUrl from "@common/helpers/imageUrl";
import { notEmpty } from "@common/helpers/util";

import { useMyApplicationsQuery } from "../../api/generated";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";
import ApplicationCard, {
  type Application,
} from "./ApplicationCard/ApplicationCard";
import ArchivedApplications from "./ArchivedApplications";
import { statusSortMap } from "./ApplicationCard/maps";

interface MyApplicationsProps {
  applications: Array<Application>;
}

export const MyApplications = ({ applications }: MyApplicationsProps) => {
  const intl = useIntl();

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

  return (
    <>
      <SEO title={pageTitle} />
      <div
        data-h2-padding="base(x1, x.5)"
        data-h2-color="base(dt-white)"
        data-h2-text-align="base(center)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.png",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1
          data-h2-margin="base(x2, 0)"
          data-h2-font-weight="base(700)"
          style={{
            letterSpacing: "-2px",
            textShadow: "0 3px 3px rgba(10, 10, 10, .3)",
          }}
        >
          {pageTitle}
        </h1>
      </div>
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
