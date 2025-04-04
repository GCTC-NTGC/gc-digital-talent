import { defineMessage, useIntl } from "react-intl";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";

import { Heading } from "@gc-digital-talent/ui";
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

import CareerTimelineSection from "./CareerTimelineSection";

const pageTitle = defineMessage({
  defaultMessage: "Career timeline",
  id: "TUfJUD",
  description: "Name of Career timeline page",
});

const subTitle = defineMessage({
  defaultMessage: "Describe your experiences across work, school, and life.",
  id: "66WkNy",
  description: "Description for the Career timeline page in applicant profile.",
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
      workStreams {
        id
        key
        name {
          localized
        }
        community {
          id
          key
          name {
            localized
          }
        }
      }
      supervisoryPosition
      supervisedEmployees
      supervisedEmployeesNumber
      budgetManagement
      annualBudgetAllocation
      seniorManagementStatus
      cSuiteRoleTitle {
        value
        label {
          localized
        }
      }
      otherCSuiteRoleTitle
    }
  }
`);

interface CareerTimelineProps {
  userId: string;
  experiencesQuery: FragmentType<typeof CareerTimelineExperience_Fragment>[];
}

const CareerTimeline = ({ experiencesQuery, userId }: CareerTimelineProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const experiences = getFragment(
    CareerTimelineExperience_Fragment,
    experiencesQuery,
  );

  const formattedSubtitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.profileAndApplications(),
      },
      {
        label: intl.formatMessage(pageTitle),
        url: paths.careerTimeline(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={formattedSubtitle}
      />
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={formattedSubtitle}
        crumbs={crumbs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x3, 0)">
          <Heading
            Icon={BookmarkSquareIcon}
            color="tertiary"
            size="h3"
            data-h2-margin="base(0, 0, x1, 0)"
            data-h2-font-weight="base(400)"
          >
            {intl.formatMessage({
              defaultMessage: "Manage your career timeline",
              id: "eZYP/W",
              description:
                "Titles for a page section to manage your career timeline",
            })}
          </Heading>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This section is similar to your traditional resume. This is where you can describe your experiences across work, school, and life. You'll be able to reuse this information on each application you submit on the platform, speeding up the process and ensuring that your information is always up-to-date.",
              id: "0m3FMH",
              description:
                "Descriptive paragraph for the career timeline page.",
            })}
          </p>
          <div data-h2-margin-top="base(x1)">
            <CareerTimelineSection
              experiences={[...experiences]}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CareerTimeline;
