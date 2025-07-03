import { defineMessage, useIntl } from "react-intl";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";

import { Container, Heading } from "@gc-digital-talent/ui";
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
    ...CareerTimelineSectionExperience
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
        url: paths.applicantDashboard(),
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
      <Container className="my-18">
        <Heading
          icon={BookmarkSquareIcon}
          color="error"
          size="h3"
          className="mt-0 mb-6 font-normal"
        >
          {intl.formatMessage({
            defaultMessage: "Manage your career timeline",
            id: "eZYP/W",
            description:
              "Titles for a page section to manage your career timeline",
          })}
        </Heading>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "This section is similar to your traditional resume. This is where you can describe your experiences across work, school, and life. You'll be able to reuse this information on each application you submit on the platform, speeding up the process and ensuring that your information is always up-to-date.",
            id: "0m3FMH",
            description: "Descriptive paragraph for the career timeline page.",
          })}
        </p>
        <CareerTimelineSection experiencesQuery={experiences} userId={userId} />
      </Container>
    </>
  );
};

export default CareerTimeline;
