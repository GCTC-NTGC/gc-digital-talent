import * as React from "react";
import { useIntl } from "react-intl";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { Button, Link } from "@common/components";
import PageHeader from "@common/components/PageHeader";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { getLocalizedName } from "@common/helpers/localize";
import UserProfile from "@common/components/UserProfile";
import { useAdminRoutes } from "admin/src/js/adminRoutes";
import { useState } from "react";
import { Applicant } from "@common/api/generated";
import TableOfContents from "@common/components/TableOfContents";
import {
  Scalars,
  useGetPoolCandidateSnapshotQuery,
  PoolCandidate,
  Maybe,
} from "../../../api/generated";
import DashboardContentContainer from "../../DashboardContentContainer";
import ApplicationStatusForm from "../ApplicationStatusForm";

export interface ViewPoolCandidateProps {
  poolCandidate: PoolCandidate;
}

type SpacerProps = React.HTMLProps<HTMLDivElement>;

const Spacer = ({ children, ...rest }: SpacerProps) => (
  <div data-h2-padding-bottom="base(1.5rem)" {...rest}>
    {children}
  </div>
);

export const ViewPoolCandidate = ({
  poolCandidate,
}: ViewPoolCandidateProps): JSX.Element => {
  const intl = useIntl();
  const adminPaths = useAdminRoutes();

  // prefer the rich view if available
  const [preferRichView, setPreferRichView] = useState(true);

  const links = [
    {
      title: intl.formatMessage({
        defaultMessage: "My pools",
        id: "0Y4Dt4",
        description: "Breadcrumb title for the pools page link.",
      }),
      href: adminPaths.poolTable(),
    },
    {
      title: getLocalizedName(poolCandidate.pool.name, intl),
      href: adminPaths.poolView(poolCandidate.pool.id),
    },
    {
      title: intl.formatMessage({
        defaultMessage: "All candidates",
        id: "e9FNqp",
        description: "Breadcrumb title for the All Candidates page link.",
      }),
      href: adminPaths.poolCandidateTable(poolCandidate.pool.id),
    },
    {
      title: `${poolCandidate.user.firstName} ${poolCandidate.user.lastName}`,
    },
  ] as BreadcrumbsProps["links"];

  const parsedSnapshot: Maybe<Applicant> = JSON.parse(
    poolCandidate.profileSnapshot,
  );
  const snapshotUserPropertyExists = !!parsedSnapshot;

  let mainContent: React.ReactNode;
  if (snapshotUserPropertyExists && preferRichView) {
    mainContent = (
      <UserProfile
        applicant={parsedSnapshot}
        sections={{
          myStatus: { isVisible: false },
          hiringPools: { isVisible: false },
          about: { isVisible: true },
          language: {
            isVisible: true,
          },
          government: {
            isVisible: true,
          },
          workLocation: {
            isVisible: true,
          },
          workPreferences: {
            isVisible: true,
          },
          employmentEquity: {
            isVisible: true,
          },
          roleSalary: { isVisible: true },
          skillsExperience: {
            isVisible: true,
          },
        }}
        isNavigationVisible={false}
      />
    );
  } else if (snapshotUserPropertyExists && !preferRichView) {
    mainContent = (
      <TableOfContents.Content>
        <pre
          data-h2-background-color="base(light.dt-gray)"
          data-h2-overflow="base(scroll, auto)"
        >
          {JSON.stringify(parsedSnapshot, null, 2)}
        </pre>
      </TableOfContents.Content>
    );
  } else {
    mainContent = (
      <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
        <p>
          {intl.formatMessage({
            defaultMessage: "Profile snapshot not found.",
            id: "JH2+tK",
            description: "Message displayed for profile snapshot not found.",
          })}
        </p>
      </NotFound>
    );
  }

  return (
    <>
      <PageHeader icon={UserCircleIcon}>
        {intl.formatMessage({
          defaultMessage: "Candidate information",
          id: "69/cNW",
          description:
            "Heading displayed above the pool candidate application page.",
        })}
      </PageHeader>
      <Spacer>
        <Breadcrumbs links={links} />
      </Spacer>
      <Spacer>
        <h3>{`${poolCandidate.user.firstName} ${poolCandidate.user.lastName}`}</h3>
      </Spacer>
      <Spacer>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "This is the profile submitted on {submittedAt} for the pool: {poolName}",
              id: "D24NyA",
              description:
                "Snapshot details displayed above the pool candidate application page.",
            },
            {
              submittedAt: poolCandidate.submittedAt,
              poolName: getLocalizedName(poolCandidate.pool?.name, intl),
            },
          )}
        </p>
      </Spacer>
      <Spacer>
        <Link
          mode="solid"
          color="primary"
          data-h2-display="base(inline-flex)"
          data-h2-align-items="base(center)"
          href={adminPaths.poolView(poolCandidate.pool.id)}
        >
          <ArrowLeftCircleIcon
            style={{ height: "1em", width: "1rem" }}
            data-h2-margin="base(0, x.25, 0, 0)"
          />
          <span>
            {intl.formatMessage({
              defaultMessage: "Go back to All candidates",
              id: "Z2KhWS",
              description: "Navigation link back to All candidates.",
            })}
          </span>
        </Link>
      </Spacer>
      <h2>
        {intl.formatMessage({
          defaultMessage: "Application’s profile snapshot",
          id: "rqXJfW",
          description: "Title for the application's profile snapshot.",
        })}
        {snapshotUserPropertyExists && (
          <>
            &nbsp;
            <Button onClick={() => setPreferRichView(!preferRichView)}>
              Toggle View
            </Button>
          </>
        )}
      </h2>
      <TableOfContents.Wrapper>
        <TableOfContents.Sidebar>
          <ApplicationStatusForm id={poolCandidate.id} />
        </TableOfContents.Sidebar>
        {mainContent}
      </TableOfContents.Wrapper>
    </>
  );
};

interface ViewPoolCandidatePageProps {
  poolCandidateId: Scalars["ID"];
}

export const ViewPoolCandidatePage = ({
  poolCandidateId,
}: ViewPoolCandidatePageProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetPoolCandidateSnapshotQuery({
    variables: { poolCandidateId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        {data?.poolCandidate ? (
          <ViewPoolCandidate poolCandidate={data.poolCandidate} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Candidate {poolCandidateId} not found.",
                  id: "GrfidX",
                  description:
                    "Message displayed for pool candidate not found.",
                },
                { poolCandidateId },
              )}
            </p>
          </NotFound>
        )}
      </DashboardContentContainer>
    </Pending>
  );
};

export default ViewPoolCandidatePage;
