import * as React from "react";
import { useIntl } from "react-intl";

import { HeadingRank, Well } from "@gc-digital-talent/ui";

import { Experience } from "~/api/generated";
import AddExperienceDialog from "~/pages/Profile/ResumeAndRecruitmentPage/components/AddExperienceDialog";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSortAndFilter, {
  FormValues as ExperienceSortAndFilterFormValues,
} from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";

export interface ResumeSectionProps {
  experiences?: Experience[];
  editParam?: string;
  headingLevel?: HeadingRank;
  applicantId?: string;
}

const ResumeSection = ({
  experiences,
  editParam,
  headingLevel = "h3",
  applicantId,
}: ResumeSectionProps) => {
  const intl = useIntl();

  const [sortAndFilterValues, setSortAndFilterValues] =
    React.useState<ExperienceSortAndFilterFormValues>({
      sortBy: "date_desc",
      filterBy: "none",
    });

  const experienceList = sortAndFilterExperiences(
    experiences,
    sortAndFilterValues,
  );

  const hasExperiences = experiences && experiences.length >= 1;

  return (
    <>
      <div
        data-h2-flex-grid="base(center, x1, x1)"
        data-h2-margin-bottom="base(x.5)"
      >
        <ExperienceSortAndFilter
          initialFormValues={sortAndFilterValues}
          onChange={(formValues) => setSortAndFilterValues(formValues)}
        />

        <div data-h2-flex-item="base(0of1) p-tablet(fill)">{/* spacer */}</div>
        {applicantId ? (
          <div
            data-h2-flex-item="base(1of1) p-tablet(content)"
            data-h2-align-self="base(flex-end)"
          >
            <AddExperienceDialog applicantId={applicantId} />
          </div>
        ) : null}
      </div>

      {hasExperiences ? (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {experienceList.map((experience) => (
            <ExperienceCard
              headingLevel={headingLevel}
              key={experience.id}
              experience={experience}
              editParam={editParam}
            />
          ))}
        </div>
      ) : (
        <Well data-h2-text-align="base(center)">
          <p>
            {intl.formatMessage({
              defaultMessage: "You haven’t added any résumé items yet.",
              id: "SjY+Wn",
              description:
                "Message to user when no résumé items have been attached to profile.",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default ResumeSection;
