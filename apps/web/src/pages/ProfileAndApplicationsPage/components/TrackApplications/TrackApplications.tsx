/* eslint-disable import/no-duplicates */
// known issue with date-fns and eslint https://github.com/date-fns/date-fns/issues/1756#issuecomment-624803874
import { useIntl } from "react-intl";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import { ReactNode, ReactElement, useState } from "react";

import { Accordion, Heading, Link, Well } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { isApplicationInProgress } from "~/utils/applicationUtils";
import { PAGE_SECTION_ID as CAREER_TIMELINE_AND_RECRUITMENTS_PAGE_SECTION_ID } from "~/constants/sections/careerTimeline";
import ApplicationCard from "~/components/ApplicationCard/ApplicationCard";

function buildLink(href: string, chunks: ReactNode): ReactElement {
  return <Link href={href}>{chunks}</Link>;
}

export const TrackApplicationsCandidate_Fragment = graphql(/* GraphQL */ `
  fragment TrackApplicationsCandidate on PoolCandidate {
    ...ApplicationCard
    id
    status {
      value
      label {
        en
        fr
      }
    }
    pool {
      id
      closingDate
    }
  }
`);

interface TrackApplicationsProps {
  applicationsQuery: FragmentType<typeof TrackApplicationsCandidate_Fragment>[];
}

type AccordionItems = ("in_progress" | "past" | "")[];

const TrackApplications = ({ applicationsQuery }: TrackApplicationsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const applications = getFragment(
    TrackApplicationsCandidate_Fragment,
    applicationsQuery,
  );

  const inProgressApplications = applications.filter(isApplicationInProgress);

  const pastApplications = applications.filter((a) => {
    return !isApplicationInProgress(a);
  });

  const [currentAccordionItems, setCurrentAccordionItems] =
    useState<AccordionItems>(["in_progress", "past"]); // start with both open

  return (
    <section>
      <div>
        <Heading
          level="h2"
          size="h3"
          data-h2-font-weight="base(400)"
          Icon={FolderOpenIcon}
          color="primary"
          data-h2-margin="base(0, 0, x1, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Track your applications",
            id: "uqiPvH",
            description:
              "Heading for track applications section on the profile and applications.",
          })}
        </Heading>
        <p data-h2-margin="base(x.5, 0, 0, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Applications to recruitment opportunities can be managed and tracked here. You’ll be able to see submission deadlines, your application’s status over time, and past applications.",
            id: "/61ANw",
            description:
              "Description for the track applications section on the profile and applications, paragraph one.",
          })}
        </p>
        <p data-h2-margin="base(x.5, 0, x1, 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "After an application is successfully assessed, the <a>qualified recruitment will be added to your career timeline</a> automatically so that managers can see your accomplishments.",
              id: "ZQbSfP",
              description:
                "Description for the track applications section on the applicant dashboard, paragraph two.",
            },
            {
              a: (chunks: ReactNode) =>
                buildLink(
                  paths.careerTimelineAndRecruitment({
                    section:
                      CAREER_TIMELINE_AND_RECRUITMENTS_PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES,
                  }),
                  chunks,
                ),
            },
          )}
        </p>
      </div>
      <div>
        <Accordion.Root
          type="multiple"
          value={currentAccordionItems}
          onValueChange={(newValue: AccordionItems) => {
            setCurrentAccordionItems(newValue);
          }}
        >
          {/* applications in progress */}
          <Accordion.Item value="in_progress">
            <Accordion.Trigger
              as="h3"
              subtitle={intl.formatMessage({
                defaultMessage:
                  "This section contains your drafts and submitted applications that are still being processed.",
                id: "WuMMRK",
                description:
                  "Introductory text displayed in applications in progress section.",
              })}
            >
              {currentAccordionItems.includes("in_progress")
                ? intl.formatMessage(
                    {
                      defaultMessage:
                        "Hide applications in progress ({applicationCount})",
                      id: "6QrhJQ",
                      description:
                        "Heading for applications in progress accordion on profile and applications.",
                    },
                    {
                      applicationCount: inProgressApplications.length ?? "0",
                    },
                  )
                : intl.formatMessage(
                    {
                      defaultMessage:
                        "Show applications in progress ({applicationCount})",
                      id: "agiL8L",
                      description:
                        "Heading for applications in progress accordion on profile and applications.",
                    },
                    {
                      applicationCount: inProgressApplications.length ?? "0",
                    },
                  )}
            </Accordion.Trigger>
            <Accordion.Content>
              {inProgressApplications.length > 0 ? (
                inProgressApplications.map((activeRecruitment) => (
                  <ApplicationCard
                    key={activeRecruitment.id}
                    poolCandidateQuery={activeRecruitment}
                  />
                ))
              ) : (
                <Well data-h2-text-align="base(center)">
                  <p
                    data-h2-font-weight="base(700)"
                    data-h2-margin="base(0, 0, x.25, 0)"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Applications that are in progress will appear here.",
                      id: "C9PbZN",
                      description:
                        "Text displayed in the applications in progress section when empty.",
                    })}
                  </p>
                  <Link href={paths.browsePools()}>
                    {intl.formatMessage({
                      defaultMessage:
                        "Check out available opportunities to start an application.",
                      id: "oSPdz1",
                      description:
                        "Additional text displayed in the applications in progress section when empty.",
                    })}
                  </Link>
                </Well>
              )}
            </Accordion.Content>
          </Accordion.Item>
          {/* past applications */}
          <Accordion.Item value="past">
            <Accordion.Trigger
              as="h3"
              subtitle={intl.formatMessage({
                defaultMessage:
                  "This section contains old applications that have been fully assessed, as well as applications that have missed the submission deadline.",
                id: "mH2eSA",
                description:
                  "Introductory text displayed in past applications section.",
              })}
            >
              {currentAccordionItems.includes("past")
                ? intl.formatMessage(
                    {
                      defaultMessage:
                        "Hide past applications ({applicationCount})",
                      id: "Kaoxhq",
                      description:
                        "Heading for past applications accordion on profile and applications.",
                    },
                    {
                      applicationCount: pastApplications.length ?? "0",
                    },
                  )
                : intl.formatMessage(
                    {
                      defaultMessage:
                        "Show past applications ({applicationCount})",
                      id: "1fMzyo",
                      description:
                        "Heading for past applications accordion on profile and applications.",
                    },
                    {
                      applicationCount: pastApplications.length ?? "0",
                    },
                  )}
            </Accordion.Trigger>
            <Accordion.Content>
              {pastApplications.length > 0 ? (
                pastApplications.map((pastApplication) => (
                  <ApplicationCard
                    key={pastApplication.id}
                    poolCandidateQuery={pastApplication}
                  />
                ))
              ) : (
                <Well data-h2-text-align="base(center)">
                  <p
                    data-h2-font-weight="base(700)"
                    data-h2-margin="base(0, 0, x.25, 0)"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Applications that are no longer active appear here.",
                      id: "U0qb7j",
                      description:
                        "Text displayed in past applications section when empty.",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "This section will include applications that have missed the submission deadline as well as applications that have been fully assessed.",
                      id: "mOGNS3",
                      description:
                        "Additional text displayed in past applications section when empty.",
                    })}
                  </p>
                </Well>
              )}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </section>
  );
};

export default TrackApplications;
