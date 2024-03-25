import * as React from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, Well } from "@gc-digital-talent/ui";
import { Experience } from "@gc-digital-talent/graphql";
import { navigationMessages } from "@gc-digital-talent/i18n";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSortAndFilter, {
  FormValues as ExperienceSortAndFilterFormValues,
} from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";

interface CareerTimelineSectionProps {
  experiences: Experience[];
}

const CareerTimelineSection = ({ experiences }: CareerTimelineSectionProps) => {
  const intl = useIntl();
  const [sortAndFilterValues, setSortAndFilterValues] =
    React.useState<ExperienceSortAndFilterFormValues>({
      sortBy: "date_desc",
      filterBy: "none",
    });
  const nonEmptyExperiences = experiences?.filter(notEmpty) ?? [];
  const experienceList = sortAndFilterExperiences(
    nonEmptyExperiences,
    sortAndFilterValues,
    intl,
  );

  const hasSomeExperience = !!experiences.length;

  return (
    <>
      <Heading Icon={UserCircleIcon} color="tertiary">
        {intl.formatMessage(navigationMessages.careerTimelineAndRecruitment)}
      </Heading>
      <div
        data-h2-flex-grid="base(center, x1, x1)"
        data-h2-margin-bottom="base(x.5)"
      >
        <ExperienceSortAndFilter
          initialFormValues={sortAndFilterValues}
          onChange={(formValues) => setSortAndFilterValues(formValues)}
        />
        <div data-h2-flex-item="base(0of1) p-tablet(fill)">{/* spacer */}</div>
      </div>
      {hasSomeExperience ? (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {experienceList.map((experience) => {
            return (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                headingLevel="h3"
                showSkills={false}
                showEdit={false}
              />
            );
          })}
        </div>
      ) : (
        <Well>
          <p data-h2-text-align="base(center)">
            {intl.formatMessage({
              defaultMessage: "No experiences found",
              id: "gHMj31",
              description:
                "Null state messages for career timeline list when no experiences are found.",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default CareerTimelineSection;
