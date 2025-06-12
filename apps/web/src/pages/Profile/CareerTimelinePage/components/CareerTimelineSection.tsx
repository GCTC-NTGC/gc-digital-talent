import { useState } from "react";
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { HeadingRank, Link, Well } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSortAndFilter, {
  FormValues as ExperienceSortAndFilterFormValues,
} from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";
import useRoutes from "~/hooks/useRoutes";
import experienceMessages from "~/messages/experienceMessages";

const CareerTimelineSectionExperience_Fragment = graphql(/** GraphQL */ `
  fragment CareerTimelineSectionExperience on Experience {
    id
    ...ExperienceCard
  }
`);

interface CareerTimelineSectionProps {
  experiencesQuery?: FragmentType<
    typeof CareerTimelineSectionExperience_Fragment
  >[];
  editParam?: string;
  headingLevel?: HeadingRank;
  userId?: string;
}

const CareerTimelineSection = ({
  experiencesQuery,
  editParam,
  headingLevel = "h3",
  userId,
}: CareerTimelineSectionProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const experiences = getFragment(
    CareerTimelineSectionExperience_Fragment,
    experiencesQuery,
  );

  const [sortAndFilterValues, setSortAndFilterValues] =
    useState<ExperienceSortAndFilterFormValues>({
      sortBy: "date_desc",
      filterBy: "none",
    });

  const experienceList = sortAndFilterExperiences(
    experiences,
    sortAndFilterValues,
    intl,
  );

  const hasExperiences = !!experiences?.length;
  const hasExperiencesByType = !!experienceList.length;

  return (
    <>
      <div className="mb-3 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <ExperienceSortAndFilter
          initialFormValues={sortAndFilterValues}
          onChange={(formValues) => setSortAndFilterValues(formValues)}
        />

        {userId ? (
          <div>
            <Link
              href={paths.createExperience()}
              icon={PlusCircleIcon}
              mode="solid"
              color="primary"
            >
              {intl.formatMessage(experienceMessages.addNewExperience)}
            </Link>
          </div>
        ) : null}
      </div>

      {hasExperiences ? (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {hasExperiencesByType ? (
            experienceList.map((experience) => (
              <ExperienceCard
                headingLevel={headingLevel}
                key={experience.id}
                experienceQuery={experience}
                editParam={editParam}
              />
            ))
          ) : (
            <Well data-h2-text-align="base(center)">
              <p>{intl.formatMessage(commonMessages.noExperiencesOfType)}</p>
            </Well>
          )}
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
