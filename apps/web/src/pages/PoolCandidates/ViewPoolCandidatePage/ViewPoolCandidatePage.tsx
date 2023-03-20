import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";

import {
  NotFound,
  Pending,
  Link,
  ToggleGroup,
  TableOfContents,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import PageHeader from "~/components/PageHeader";
import UserProfile from "~/components/UserProfile";

import {
  Applicant,
  Scalars,
  useGetPoolCandidateSnapshotQuery,
  PoolCandidate,
  Maybe,
} from "~/api/generated";
import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { getFullNameLabel } from "~/utils/nameUtils";
import ApplicationStatusForm from "./components/ApplicationStatusForm";

export interface ViewPoolCandidateProps {
  poolCandidate: PoolCandidate;
}

type SpacerProps = React.HTMLProps<HTMLDivElement>;

const Spacer = ({ children, ...rest }: SpacerProps) => (
  <div data-h2-margin-bottom="base(x1)" {...rest}>
    {children}
  </div>
);

export const ViewPoolCandidate = ({
  poolCandidate,
}: ViewPoolCandidateProps): JSX.Element => {
  const intl = useIntl();
  const paths = useRoutes();

  // prefer the rich view if available
  const [preferRichView, setPreferRichView] = React.useState(true);

  const parsedSnapshot: Maybe<Applicant> = JSON.parse(
    poolCandidate.profileSnapshot,
  );
  const snapshotUserPropertyExists = !!parsedSnapshot;

  const subTitle = (
    <div data-h2-flex-grid="base(center, x2, x1)">
      <div
        data-h2-flex-item="base(1of1) p-tablet(fill)"
        data-h2-text-align="base(center) p-tablet(left)"
      >
        <h2 data-h2-margin="base(x1, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage: "Application’s profile snapshot",
            id: "rqXJfW",
            description: "Title for the application's profile snapshot.",
          })}
        </h2>
      </div>
      {snapshotUserPropertyExists && (
        <div
          data-h2-flex-item="base(1of1) p-tablet(content)"
          data-h2-text-align="base(center) p-tablet(right)"
          data-h2-padding="base(x1, 0, 0, 0)"
        >
          <ToggleGroup.Root
            type="single"
            color="primary.dark"
            value={preferRichView ? "text" : "code"}
            onValueChange={(value) => {
              if (value) setPreferRichView(value === "text");
            }}
          >
            <ToggleGroup.Item value="text">
              {intl.formatMessage({
                defaultMessage: "Text",
                id: "Ude1JQ",
                description: "Title for the application's profile snapshot.",
              })}
            </ToggleGroup.Item>
            <ToggleGroup.Item value="code">
              {intl.formatMessage({
                defaultMessage: "Code",
                id: "m0JFE/",
                description: "Title for the application's profile snapshot.",
              })}
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
      )}
    </div>
  );

  let mainContent: React.ReactNode;
  if (snapshotUserPropertyExists && preferRichView) {
    mainContent = (
      <UserProfile
        applicant={parsedSnapshot}
        subTitle={subTitle}
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
        {subTitle}
        <pre
          data-h2-background-color="base(gray.light)"
          data-h2-overflow="base(scroll auto)"
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
              poolName: getFullPoolAdvertisementTitleHtml(
                intl,
                poolCandidate.pool,
              ),
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
          href={paths.poolCandidateTable(poolCandidate.pool.id)}
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
      <TableOfContents.Wrapper>
        <TableOfContents.Sidebar>
          <ApplicationStatusForm id={poolCandidate.id} />
        </TableOfContents.Sidebar>
        {mainContent}
      </TableOfContents.Wrapper>
    </>
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
  poolCandidateId: Scalars["ID"];
};

export const ViewPoolCandidatePage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { poolCandidateId } = useParams<RouteParams>();
  const [{ data, fetching, error }] = useGetPoolCandidateSnapshotQuery({
    variables: { poolCandidateId: poolCandidateId || "" },
  });

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "DUK/pz",
        description: "Breadcrumb title for the home page link.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Pools",
        id: "3fAkvM",
        description: "Breadcrumb title for the pools page link.",
      }),
      url: routes.poolTable(),
    },
    ...(data?.poolCandidate?.pool.id
      ? [
          {
            label: getLocalizedName(data.poolCandidate.pool.name, intl),
            url: routes.poolView(data.poolCandidate.pool.id),
          },
        ]
      : []),
    ...(data?.poolCandidate?.pool.id
      ? [
          {
            label: intl.formatMessage({
              defaultMessage: "Candidates",
              id: "zzf16k",
              description: "Breadcrumb for the All Candidates page",
            }),
            url: routes.poolCandidateTable(data.poolCandidate.pool.id),
          },
        ]
      : []),
    ...(poolCandidateId
      ? [
          {
            label: getFullNameLabel(
              data?.poolCandidate?.user.firstName,
              data?.poolCandidate?.user.lastName,
              intl,
            ),
            url: routes.poolCandidateApplication(poolCandidateId),
          },
        ]
      : []),
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <Pending fetching={fetching} error={error}>
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
      </Pending>
    </AdminContentWrapper>
  );
};

export default ViewPoolCandidatePage;
