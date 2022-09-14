import * as React from "react";
import { useIntl } from "react-intl";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { Link } from "@common/components";
import PageHeader from "@common/components/PageHeader";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { getLocalizedName } from "@common/helpers/localize";
import UserProfile from "@common/components/UserProfile";
import { useAdminRoutes } from "admin/src/js/adminRoutes";
import {
  Scalars,
  useGetPoolCandidateSnapshotQuery,
  PoolCandidate,
  Maybe,
} from "../../../api/generated";
import DashboardContentContainer from "../../DashboardContentContainer";

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

  const parsedSnapshot: Maybe<PoolCandidate> = JSON.parse(
    poolCandidate.profileSnapshot,
  );

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
      </h2>

      {parsedSnapshot?.user ? (
        <UserProfile
          applicant={parsedSnapshot?.user}
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
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          {" "}
          <p>
            {intl.formatMessage({
              defaultMessage: "Profile snapshot not found.",
              id: "JH2+tK",
              description: "Message displayed for profile snapshot not found.",
            })}
          </p>
        </NotFound>
      )}
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
