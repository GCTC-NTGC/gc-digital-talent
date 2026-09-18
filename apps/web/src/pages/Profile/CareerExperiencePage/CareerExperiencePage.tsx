import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";
import { useState } from "react";

import {
  Button,
  Heading,
  Pending,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql, type FragmentType } from "@gc-digital-talent/graphql";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import profileMessages from "~/messages/profileMessages";
import experienceMessages from "~/messages/experienceMessages";
import type { CareerTimelineSectionExperience_Fragment } from "~/components/CareerTimelineSection/CareerTimelineSection";
import CareerTimelineSection from "~/components/CareerTimelineSection/CareerTimelineSection";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { PAGE_SECTION_ID } from "~/constants/sections/careerExperiencePage";

type SortValues = "type" | "timeline";

const pageTitle = defineMessage({
  defaultMessage: "Your career experience",
  id: "kLl/xh",
  description: "Name of career experience page",
});

export const handle = {
  pageTitle: defineMessage({
    defaultMessage: "Career experience",
    id: "iAMDPG",
    description: "Breadcrumb for the career experience page",
  }),
};

export const CareerExperiencePage_Query = graphql(/* GraphQL */ `
  query CareerExperiencePage {
    me {
      id
      experiences {
        ...CareerTimelineSectionExperience
      }
    }
  }
`);

const selectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "black",
  className: "[&_*]:no-underline pointer-events-none",
};

const unselectedFilterStyle: Record<string, string> = {
  mode: "inline",
  color: "black",
  className: "font-normal text-gray-500",
};

interface CareerExperienceProps {
  userId: string;
  experiencesQuery: FragmentType<
    typeof CareerTimelineSectionExperience_Fragment
  >[];
}

export const CareerExperience = ({
  userId,
  experiencesQuery,
}: CareerExperienceProps) => {
  const intl = useIntl();

  const [sortBy, setSortBy] = useState<SortValues>("type");

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.CAREER_EXPERIENCE}>
              {intl.formatMessage(pageTitle)}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
        </TableOfContents.List>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        <TableOfContents.Section id={PAGE_SECTION_ID.CAREER_EXPERIENCE}>
          <Heading
            icon={NewspaperIcon}
            color="primary"
            size="h3"
            className="mt-0 mb-6 font-normal"
          >
            {intl.formatMessage(pageTitle)}
          </Heading>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "This section of your profile acts as your resume, where you can describe your experience across work, school, and life. You'll be able to reuse this information on each application you submit, speeding up the process and ensuring that your information is always up-to-date.",
              id: "V4oTbX",
              description:
                "Descriptive paragraph for the career experience page.",
            })}
          </p>
          <div
            role="group"
            aria-labelledby="sortFilter"
            className="mt-6 flex items-center gap-3"
          >
            <span id="sortFilter" className="text-gray-500 dark:text-gray-200">
              {intl.formatMessage(formMessages.sortBy)}
              {intl.formatMessage(commonMessages.dividingColon)}
            </span>
            <Button
              onClick={() => setSortBy("type")}
              {...(sortBy === "type"
                ? selectedFilterStyle
                : unselectedFilterStyle)}
            >
              {intl.formatMessage(experienceMessages.type)}
            </Button>
            <Button
              onClick={() => setSortBy("timeline")}
              {...(sortBy === "timeline"
                ? selectedFilterStyle
                : unselectedFilterStyle)}
            >
              {intl.formatMessage({
                defaultMessage: "Timeline",
                id: "V+cJvn",
                description: "Button to filter experiences by timeline",
              })}
            </Button>
          </div>
          {sortBy === "type" ? (
            // experiences by type
            <div>Experiences by type</div>
          ) : (
            <CareerTimelineSection
              experiencesQuery={experiencesQuery}
              userId={userId}
            />
          )}
        </TableOfContents.Section>
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

const CareerExperiencePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: CareerExperiencePage_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <CareerExperience
          userId={data?.me.id}
          experiencesQuery={unpackMaybes(data?.me.experiences)}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CareerExperiencePage />
  </RequireAuth>
);

Component.displayName = "CareerExperiencePage";

export default Component;
