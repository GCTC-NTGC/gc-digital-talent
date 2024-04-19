import * as React from "react";
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { HeadingRank, Link, Well } from "@gc-digital-talent/ui";
import { Experience } from "@gc-digital-talent/graphql";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSortAndFilter, {
  FormValues as ExperienceSortAndFilterFormValues,
} from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";
import useRoutes from "~/hooks/useRoutes";
import experienceMessages from "~/messages/experienceMessages";

interface CareerTimelineSectionProps {
  experiences?: Experience[];
  editParam?: string;
  headingLevel?: HeadingRank;
  userId?: string;
}

const CareerTimelineSection = ({
  experiences,
  editParam,
  headingLevel = "h3",
  userId,
}: CareerTimelineSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const [sortAndFilterValues, setSortAndFilterValues] =
    React.useState<ExperienceSortAndFilterFormValues>({
      sortBy: "date_desc",
      filterBy: "none",
    });

  const experienceList = sortAndFilterExperiences(
    experiences,
    sortAndFilterValues,
    intl,
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
        {userId ? (
          <div
            data-h2-flex-item="base(1of1) p-tablet(content)"
            data-h2-align-self="base(flex-end)"
          >
            <Link
              href={paths.createExperience(userId)}
              icon={PlusCircleIcon}
              mode="solid"
              color="secondary"
            >
              {intl.formatMessage(experienceMessages.addNewExperience)}
            </Link>
          </div>
        ) : null}
      </div>

      {hasExperiences ? (
        <div
          className="flex"
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
              defaultMessage:
                "You haven’t added any career timeline items yet.",
              id: "31HF1c",
              description:
                "Message to user when no career timeline items have been attached to profile.",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default CareerTimelineSection;
