import React from "react";
import { useIntl } from "react-intl";
import { useParams, Outlet } from "react-router-dom";

import { ThrowNotFound, Pending, TableOfContents } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";

import useRoutes from "~/hooks/useRoutes";
import useCurrentPage from "~/hooks/useCurrentPage";

import {
  Maybe,
  PoolAdvertisement,
  PoolCandidate,
  useGetApplicationPoolNameQuery,
} from "~/api/generated";
import { PageNavInfo } from "~/types/pages";
import { HeartIcon } from "@heroicons/react/24/solid";
import { getFullPoolAdvertisementTitleHtml } from "../../utils/poolUtils";

type PageNavKey =
  | "welcome"
  | "profile"
  | "resume"
  | "education"
  | "skills"
  | "questions"
  | "submit";

type PartialApplication = Pick<PoolCandidate, "id"> & {
  poolAdvertisement?: Maybe<
    Pick<PoolAdvertisement, "id" | "classifications" | "stream" | "name">
  >;
};

interface ApplicationPageWrapperProps {
  application: PartialApplication;
}

const ApplicationPageWrapper = ({
  application,
}: ApplicationPageWrapperProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const pages = new Map<PageNavKey, PageNavInfo>([
    [
      "welcome",
      {
        icon: HeartIcon,
        title: intl.formatMessage({
          defaultMessage: "Welcome",
          id: "UfWQoF",
          description: "Page title for the welcome page of an application",
        }),
        link: {
          url: paths.applicationWelcome(application.id),
        },
      },
    ],
  ]);

  const poolName = getFullPoolAdvertisementTitleHtml(
    intl,
    application.poolAdvertisement,
  );
  const currentPage = useCurrentPage<PageNavKey>(pages);

  return (
    <>
      <SEO title={currentPage?.title} />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage: "Apply to {poolName}",
            id: "K8CPir",
            description: "Heading for the application page",
          },
          { poolName },
        )}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper>
          <TableOfContents.Sidebar>
            <p>Stepper here</p>
          </TableOfContents.Sidebar>
          <TableOfContents.Content>
            <Outlet />
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const ApplicationLayout = () => {
  const { applicationId } = useParams();
  const [{ data, fetching, error }] = useGetApplicationPoolNameQuery({
    variables: {
      id: applicationId || "",
    },
  });

  const application = data?.poolCandidate;

  return (
    <Pending fetching={fetching} error={error}>
      {application?.poolAdvertisement ? (
        <ApplicationPageWrapper application={application} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationLayout;
