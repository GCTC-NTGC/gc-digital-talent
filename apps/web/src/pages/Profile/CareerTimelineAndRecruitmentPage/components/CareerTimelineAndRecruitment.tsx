import React from "react";
import { useIntl } from "react-intl";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { TableOfContents, Heading, Link } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import { Application } from "~/utils/applicationUtils";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { PAGE_SECTION_ID, titles } from "../constants";
import CareerTimelineSection from "./CareerTimelineSection";
import QualifiedRecruitmentsSection from "./QualifiedRecruitmentsSection";

type MergedExperiences = Array<
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience
>;

export type ExperienceForDate =
  | (AwardExperience & { startDate: string; endDate: string })
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

interface CareerTimelineAndRecruitmentProps {
  userId: string;
  experiences?: MergedExperiences;
  applications: Application[];
}

const CareerTimelineAndRecruitment = ({
  experiences,
  applications,
  userId,
}: CareerTimelineAndRecruitmentProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: paths.profileAndApplications(),
      },
      {
        label: intl.formatMessage(titles.careerTimelineAndRecruitment),
        url: paths.careerTimelineAndRecruitment(userId),
      },
    ],
  });

  const pageTitle = intl.formatMessage(titles.careerTimelineAndRecruitment);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage(
          {
            defaultMessage:
              "Manage your experience and qualified recruitment processes.",
            id: "zJKngJ",
            description:
              "Description for the Career timeline and recruitment page in applicant profile.",
          },
          {
            abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
          },
        )}
        crumbs={crumbs}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.MANAGE_YOUR_CAREER_TIMELINE}
                >
                  {intl.formatMessage(titles.manageYourCareerTimeline)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES}
                >
                  {intl.formatMessage(titles.qualifiedRecruitmentProcesses)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.MANAGE_YOUR_CAREER_TIMELINE}
            >
              <Heading
                Icon={BookmarkSquareIcon}
                color="tertiary"
                size="h3"
                data-h2-margin="base(0, 0, x1, 0)"
                data-h2-font-weight="base(400)"
              >
                {intl.formatMessage(titles.manageYourCareerTimeline)}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This section is similar to your traditional resume. This is where you can describe your experiences across work, school, and life. You'll be able to reuse this information on each application you submit on the platform, speeding up the process and ensuring that your information is always up-to-date.",
                  id: "49MghK",
                  description:
                    "Descriptive paragraph for the Manage your career timeline section of the career timeline and recruitment page.",
                })}
              </p>
              <div data-h2-margin-top="base(x1)">
                <CareerTimelineSection
                  experiences={experiences}
                  userId={userId}
                />
              </div>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES}
              data-h2-margin="base(x3, 0, 0, 0)"
            >
              <div data-h2-flex-grid="base(center, x1, x1)">
                <Heading
                  Icon={IdentificationIcon}
                  color="secondary"
                  data-h2-font-weight="base(400)"
                  size="h3"
                  data-h2-flex-item="base(1of1) p-tablet(fill)"
                >
                  {intl.formatMessage(titles.qualifiedRecruitmentProcesses)}
                </Heading>
                <Link
                  href={paths.browsePools()}
                  data-h2-flex-item="base(1of1) p-tablet(content)"
                  mode="inline"
                >
                  {intl.formatMessage(navigationMessages.browseJobs)}
                </Link>
              </div>
              <p data-h2-margin="base(x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "When you apply to a recruitment process and successfully pass the assessment, you’re awarded entry and can start being considered for related opportunities. This section highlights all active and expired processes that you’re currently a part of and allows you to manage whether or not you appear in talent searches.",
                  id: "4r4MJP",
                  description:
                    "Descriptive paragraph for the Qualified recruitment processes section of the career timeline and recruitment page.",
                })}
              </p>
              <QualifiedRecruitmentsSection applications={applications} />
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

export default CareerTimelineAndRecruitment;
