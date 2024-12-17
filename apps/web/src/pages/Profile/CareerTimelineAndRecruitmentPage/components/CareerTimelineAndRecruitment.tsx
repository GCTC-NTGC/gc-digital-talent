import { defineMessage, useIntl } from "react-intl";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { TableOfContents, Heading, Link } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  FragmentType,
  PersonalExperience,
  WorkExperience,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { PAGE_SECTION_ID, titles } from "~/constants/sections/careerTimeline";
import { QualifiedRecruitmentCardCategories_Fragment } from "~/components/QualifiedRecruitmentCard/QualifiedRecruitmentCard";

import CareerTimelineSection from "./CareerTimelineSection";
import QualifiedRecruitmentsSection from "./QualifiedRecruitmentsSection";

const subTitle = defineMessage({
  defaultMessage: "Manage your experience and qualified recruitment processes.",
  id: "zJKngJ",
  description:
    "Description for the Career timeline and recruitment page in applicant profile.",
});

export type ExperienceForDate =
  | (AwardExperience & { startDate: string; endDate: string })
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export const CareerTimelineExperience_Fragment = graphql(/* GraphQL */ `
  fragment CareerTimelineExperience on Experience {
    id
    details
    skills {
      id
      key
      name {
        en
        fr
      }
      category {
        value
        label {
          en
          fr
        }
      }
      experienceSkillRecord {
        details
      }
    }
    ... on AwardExperience {
      title
      issuedBy
      awardedDate
      awardedTo {
        value
        label {
          en
          fr
        }
      }
      awardedScope {
        value
        label {
          en
          fr
        }
      }
    }
    ... on CommunityExperience {
      title
      organization
      project
      startDate
      endDate
    }
    ... on EducationExperience {
      institution
      areaOfStudy
      thesisTitle
      startDate
      endDate
      type {
        value
        label {
          en
          fr
        }
      }
      status {
        value
        label {
          en
          fr
        }
      }
    }
    ... on PersonalExperience {
      title
      description
      startDate
      endDate
    }
    ... on WorkExperience {
      role
      organization
      division
      startDate
      endDate
      employmentCategory {
        value
        label {
          en
          fr
        }
      }
      extSizeOfOrganization {
        value
        label {
          en
          fr
        }
      }
      extRoleSeniority {
        value
        label {
          en
          fr
        }
      }
      govEmploymentType {
        value
        label {
          en
          fr
        }
      }
      govPositionType {
        value
        label {
          en
          fr
        }
      }
      govContractorRoleSeniority {
        value
        label {
          en
          fr
        }
      }
      govContractorType {
        value
        label {
          en
          fr
        }
      }
      contractorFirmAgencyName
      cafEmploymentType {
        value
        label {
          en
          fr
        }
      }
      cafForce {
        value
        label {
          en
          fr
        }
      }
      cafRank {
        value
        label {
          en
          fr
        }
      }
      classification {
        id
        group
        level
      }
      department {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
    }
  }
`);

const CareerTimelineApplication_Fragment = graphql(/* GraphQL */ `
  fragment CareerTimelineApplication on PoolCandidate {
    ...QualifiedRecruitmentsCandidate
    id
    status {
      value
    }
    archivedAt
    submittedAt
    suspendedAt
    pool {
      id
      closingDate
      name {
        en
        fr
      }
      publishingGroup {
        value
      }
    }
  }
`);

interface CareerTimelineAndRecruitmentProps {
  userId: string;
  experiencesQuery: FragmentType<typeof CareerTimelineExperience_Fragment>[];
  applicationsQuery: FragmentType<typeof CareerTimelineApplication_Fragment>[];
  categoriesQuery: FragmentType<
    typeof QualifiedRecruitmentCardCategories_Fragment
  >;
}

const CareerTimelineAndRecruitment = ({
  experiencesQuery,
  applicationsQuery,
  categoriesQuery,
  userId,
}: CareerTimelineAndRecruitmentProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const experiences = getFragment(
    CareerTimelineExperience_Fragment,
    experiencesQuery,
  );
  const applications = getFragment(
    CareerTimelineApplication_Fragment,
    applicationsQuery,
  );

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: paths.profileAndApplications(),
      },
      {
        label: intl.formatMessage(titles.careerTimelineAndRecruitment),
        url: paths.careerTimelineAndRecruitment(),
      },
    ],
  });

  const pageTitle = intl.formatMessage(titles.careerTimelineAndRecruitment);
  const formattedSubtitle = intl.formatMessage(subTitle);

  return (
    <>
      <SEO title={pageTitle} description={formattedSubtitle} />
      <Hero title={pageTitle} subtitle={formattedSubtitle} crumbs={crumbs} />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
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
                  experiences={[...experiences]}
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
              <QualifiedRecruitmentsSection
                applicationsQuery={[...applications]}
                categoriesQuery={categoriesQuery}
              />
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

export default CareerTimelineAndRecruitment;
