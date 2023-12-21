import * as React from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import HandRaisedIcon from "@heroicons/react/24/outline/HandRaisedIcon";
import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";

import {
  NotFound,
  Pending,
  ToggleGroup,
  Accordion,
  Heading,
  Sidebar,
  CardBasic,
  Button,
  Link,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import PageHeader from "~/components/PageHeader";
import {
  User,
  Scalars,
  useGetPoolCandidateSnapshotQuery,
  PoolCandidate,
  Maybe,
  Pool,
} from "~/api/generated";
import { getFullPoolTitleLabel, useAdminPoolPages } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import { getFullNameLabel } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";

import CareerTimelineSection from "./components/CareerTimelineSection/CareerTimelineSection";
import ApplicationInformation from "./components/ApplicationInformation/ApplicationInformation";
import ProfileDetails from "./components/ProfileDetails/ProfileDetails";
import NotesDialog from "./components/MoreActions/NotesDialog";

export interface ViewPoolCandidateProps {
  poolCandidate: PoolCandidate;
  pools: Pool[];
}

type SectionContent = {
  id: string;
  linkText?: string;
  title: string;
};

export const ViewPoolCandidate = ({
  poolCandidate,
  pools,
}: ViewPoolCandidateProps): JSX.Element => {
  const intl = useIntl();
  const paths = useRoutes();

  // prefer the rich view if available
  const [preferRichView, setPreferRichView] = React.useState(true);

  const parsedSnapshot: Maybe<User> = JSON.parse(poolCandidate.profileSnapshot);
  const snapshotUserPropertyExists = !!parsedSnapshot;
  const pages = useAdminPoolPages(intl, poolCandidate.pool);
  const showRichSnapshot = snapshotUserPropertyExists && preferRichView;

  const sections: Record<string, SectionContent> = {
    statusForm: {
      id: "status-form",
      title: intl.formatMessage({
        defaultMessage: "Application status",
        id: "/s66sg",
        description: "Title for admins to edit an applications status.",
      }),
    },
    poolInformation: {
      id: "pool-information",
      title: intl.formatMessage({
        defaultMessage: "Pool information",
        id: "Cjp2F6",
        description: "Title for the pool info page",
      }),
    },
    snapshot: {
      id: "snapshot",
      title: intl.formatMessage({
        defaultMessage: "Application",
        id: "5iNcHS",
        description:
          "Title displayed for the Pool Candidates table View Application link.",
      }),
    },
    minExperience: {
      id: "min-experience",
      title: intl.formatMessage({
        defaultMessage: "Minimum experience or equivalent education",
        id: "Fbh/MK",
        description:
          "Title for the minimum experience or equivalent education snapshot section.",
      }),
    },
    essentialSkills: {
      id: "essential-skills",
      title: intl.formatMessage({
        defaultMessage: "Essential skills",
        id: "w7E0He",
        description: "Title for the required skills snapshot section",
      }),
    },
    assetSkills: {
      id: "asset-skills",
      title: intl.formatMessage({
        defaultMessage: "Asset skills",
        id: "Xpo+u6",
        description: "Title for the optional skills snapshot section",
      }),
    },
    questions: {
      id: "questions",
      title: intl.formatMessage({
        defaultMessage: "Screening questions",
        id: "mqWvWR",
        description: "Title for the screening questions snapshot section",
      }),
    },
    careerTimeline: {
      id: "career-timeline",
      title: intl.formatMessage({
        defaultMessage: "Career timeline",
        id: "2KM4iz",
        description: "Title for the career timeline snapshot section",
      }),
    },
    personal: {
      id: "personal",
      title: intl.formatMessage({
        defaultMessage: "Personal and contact information",
        id: "0lUoqK",
        description:
          "Title for the personal and contact information snapshot section",
      }),
    },
    work: {
      id: "work",
      title: intl.formatMessage({
        defaultMessage: "Work preferences",
        id: "s7F24X",
        description: "Title for the work preferences snapshot section",
      }),
    },
    dei: {
      id: "dei",
      title: intl.formatMessage({
        defaultMessage: "Diversity, equity, and inclusion",
        id: "zLeH2i",
        description:
          "Title for the diversity, equity, and inclusion snapshot section",
      }),
    },
    government: {
      id: "government",
      title: intl.formatMessage({
        defaultMessage: "Government employee information",
        id: "nEVNHp",
        description:
          "Title for the government employee information snapshot section",
      }),
    },
    language: {
      id: "language",
      title: intl.formatMessage({
        defaultMessage: "Language profile",
        id: "KsS1Py",
        description: "Title for the language profile snapshot section",
      }),
    },
    signature: {
      id: "signature",
      title: intl.formatMessage({
        defaultMessage: "Signature",
        id: "1ZZgbi",
        description: "Title for the signature snapshot section",
      }),
    },
  };

  const subTitle = (
    <div
      data-h2-display="l-tablet(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(space-between)"
      data-h2-margin="base(x1, 0)"
    >
      {snapshotUserPropertyExists && (
        <>
          <Heading
            level="h3"
            data-h2-margin="base(0)"
            data-h2-font-weight="base(800)"
          >
            {sections.snapshot.title}
          </Heading>
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
        </>
      )}
    </div>
  );

  let mainContent: React.ReactNode;
  if (showRichSnapshot) {
    const snapshotCandidate = parsedSnapshot?.poolCandidates
      ?.filter(notEmpty)
      .find(({ id }) => id === poolCandidate.id);
    const nonEmptyExperiences = parsedSnapshot.experiences?.filter(notEmpty);

    mainContent = (
      <>
        <ApplicationInformation
          pool={poolCandidate.pool}
          snapshot={parsedSnapshot}
          application={snapshotCandidate}
        />
        <div data-h2-margin="base(x2 0)">
          <Accordion.Root type="single" mode="card" collapsible>
            <Accordion.Item value="otherRecruitments">
              <Accordion.Trigger>
                {intl.formatMessage({
                  defaultMessage: "Other recruitments",
                  id: "kZs3Nk",
                  description:
                    "Heading for table of a users other applications and recruitments",
                })}
              </Accordion.Trigger>
              <Accordion.Content>
                <PoolStatusTable user={poolCandidate.user} pools={pools} />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
        <CareerTimelineSection experiences={nonEmptyExperiences ?? []} />
      </>
    );
  } else if (snapshotUserPropertyExists && !preferRichView) {
    mainContent = (
      <>
        {subTitle}
        <pre
          data-h2-background-color="base(background.dark.3)"
          data-h2-border="base(1px solid background.darker)"
          data-h2-overflow="base(scroll auto)"
          data-h2-padding="base(x1)"
          data-h2-radius="base(s)"
        >
          {JSON.stringify(parsedSnapshot, null, 2)}
        </pre>
      </>
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
        } / ${getFullPoolTitleLabel(intl, poolCandidate.pool)}`}
        navItems={pages}
      >
        {intl.formatMessage({
          defaultMessage: "Candidate information",
          id: "69/cNW",
          description:
            "Heading displayed above the pool candidate application page.",
        })}
      </PageHeader>
      <ProfileDetails user={poolCandidate.user} />
      <Sidebar.Wrapper>
        <Sidebar.Sidebar>
          <Heading size="h3">
            {intl.formatMessage({
              defaultMessage: "More actions",
              id: "QaMkP7",
              description:
                "Title for more actions sidebar on view pool candidate page",
            })}
          </Heading>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Additional information, relevant to this candidate’s application.",
              id: "5cW3Ns",
              description:
                "Description for more actions sidebar on view pool candidate page",
            })}
          </p>
          <CardBasic
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(flex-start)"
            data-h2-gap="base(x.5)"
            data-h2-margin-bottom="base(x1)"
          >
            <Button type="button" color="primary" mode="solid">
              {intl.formatMessage({
                defaultMessage: "Record final decision",
                id: "DD0Zd+",
                description:
                  "Button label for record final decision on view pool candidate page",
              })}
            </Button>
            <Button
              icon={HandRaisedIcon}
              type="button"
              color="primary"
              mode="inline"
            >
              {intl.formatMessage({
                defaultMessage: "Remove candidate",
                id: "Aixzmb",
                description:
                  "Button label for remove candidate on view pool candidate page",
              })}
            </Button>
            <NotesDialog
              poolCandidateId={poolCandidate.id}
              notes={poolCandidate.notes}
            />
            <Link
              href={paths.userProfile(poolCandidate.user.id)}
              icon={UserCircleIcon}
              type="button"
              color="primary"
              mode="inline"
            >
              {intl.formatMessage({
                defaultMessage: "View up-to-date profile",
                id: "mh7ndf",
                description:
                  "Link label for view profile on view pool candidate page",
              })}
            </Link>
          </CardBasic>
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(flex-start)"
            data-h2-gap="base(x.5)"
          >
            <p data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Currently screening:",
                id: "h7l8Sd",
                description:
                  "Label for currently screening section on view pool candidate page",
              })}
            </p>
            <p>Step 1: Screening Application (Replace with fetched value)</p>
            <Link
              href="#replace-with-link"
              icon={ArrowRightCircleIcon}
              type="button"
              color="primary"
              mode="inline"
            >
              {intl.formatMessage({
                defaultMessage: "Go to next candidate",
                id: "oTNbp0",
                description:
                  "Link label to view next candidate on view pool candidate page",
              })}
            </Link>
          </div>
        </Sidebar.Sidebar>
        <Sidebar.Content>
          <div data-h2-margin-bottom="base(x1)">
            <Heading
              Icon={ExclamationTriangleIcon}
              color="quaternary"
              data-h2-margin-bottom="base(x1)"
            >
              {intl.formatMessage({
                defaultMessage: "Screening and assessment",
                id: "R8Naqm",
                description: "Heading for the information of an application",
              })}
            </Heading>
            <div>Coming soon!</div>
          </div>
          {mainContent}
        </Sidebar.Content>
      </Sidebar.Wrapper>
    </>
  );
};

type RouteParams = {
  poolId: Scalars["ID"];
  poolCandidateId: Scalars["ID"];
};

export const RODViewPoolCandidatePage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { poolCandidateId } = useRequiredParams<RouteParams>("poolCandidateId");
  const [{ data, fetching, error }] = useGetPoolCandidateSnapshotQuery({
    variables: { poolCandidateId },
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
        {data?.poolCandidate && data?.pools ? (
          <ViewPoolCandidate
            poolCandidate={data.poolCandidate}
            pools={data.pools.filter(notEmpty)}
          />
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

export default RODViewPoolCandidatePage;
