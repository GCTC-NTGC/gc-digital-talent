import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import ArrowLeftCircleIcon from "@heroicons/react/24/solid/ArrowLeftCircleIcon";

import {
  NotFound,
  Pending,
  Link,
  ToggleGroup,
  TableOfContents,
  Heading,
  Separator,
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
import {
  fullPoolAdvertisementTitle,
  getFullPoolAdvertisementTitleHtml,
  getFullPoolAdvertisementTitleLabel,
  useAdminPoolPages,
} from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { getFullNameLabel } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import ApplicationStatusForm from "./components/ApplicationStatusForm";

export interface ViewPoolCandidateProps {
  poolCandidate: PoolCandidate;
}

type SectionContent = {
  id: string;
  linkText?: string;
  title: string;
};

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
  const pages = useAdminPoolPages(intl, poolCandidate.pool);

  const sections: Record<string, SectionContent> = {
    statusForm: {
      id: "status-form",
      title: intl.formatMessage({
        defaultMessage: "Application status",
        id: "/s66sg",
        description: "Title for admins to edit an applications status.",
      }),
    },
    snapshot: {
      id: "snapshot",
      title: intl.formatMessage({
        defaultMessage: "Application's profile snapshot",
        id: "L/Vj+K",
        description: "Title for the application's profile snapshot.",
      }),
    },
  };

  const subTitle = (
    <div data-h2-flex-grid="base(center, x2, x1)">
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
      <PageHeader
        icon={UserCircleIcon}
        subtitle={`${poolCandidate.user.firstName} ${
          poolCandidate.user.lastName
        } / ${getFullPoolAdvertisementTitleLabel(intl, poolCandidate.pool)}`}
        navItems={pages}
      >
        {intl.formatMessage({
          defaultMessage: "Candidate information",
          id: "69/cNW",
          description:
            "Heading displayed above the pool candidate application page.",
        })}
      </PageHeader>
      <p data-h2-margin="base(-x1, 0, x1, 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "This is the profile submitted on <strong>{submittedAt}</strong> for the pool: <strong>{poolName}</strong>",
            id: "V2vBbu",
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
      <Separator
        data-h2-background-color="base(black.lightest)"
        data-h2-margin="base(x1, 0, 0, 0)"
      />
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.AnchorLink id={sections.statusForm.id}>
            {sections.statusForm.title}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id={sections.snapshot.id}>
            {sections.snapshot.title}
          </TableOfContents.AnchorLink>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <TableOfContents.Section id={sections.statusForm.id}>
            <TableOfContents.Heading
              data-h2-margin="base(x3, 0, x1, 0)"
              as="h3"
            >
              {sections.statusForm.title}
            </TableOfContents.Heading>
            <ApplicationStatusForm id={poolCandidate.id} />
            <Separator
              data-h2-background-color="base(black.lightest)"
              data-h2-margin="base(x1, 0, 0, 0)"
            />
          </TableOfContents.Section>
        </TableOfContents.Content>
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
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: intl.formatMessage(adminMessages.pools),
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
