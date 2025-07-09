import { useState } from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Button, Heading, Well } from "@gc-digital-talent/ui";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import ExperienceCard, {
  ExperienceCard_Fragment,
} from "~/components/ExperienceCard/ExperienceCard";
import ExperienceSortAndFilter, {
  FormValues as ExperienceSortAndFilterFormValues,
} from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";
import useControlledCollapsibleGroup from "~/hooks/useControlledCollapsibleGroup";
import experienceMessages from "~/messages/experienceMessages";
import { SnapshotExperience } from "~/utils/experienceUtils";

interface CareerTimelineSectionProps {
  experiences: SnapshotExperience[];
}

const CareerTimelineSection = ({ experiences }: CareerTimelineSectionProps) => {
  const intl = useIntl();
  const [sortAndFilterValues, setSortAndFilterValues] =
    useState<ExperienceSortAndFilterFormValues>({
      sortBy: "date_desc",
      filterBy: "none",
    });
  const nonEmptyExperiences = unpackMaybes(experiences);
  const { hasExpanded, toggleAllExpanded, toggleExpandedItem, isExpanded } =
    useControlledCollapsibleGroup(nonEmptyExperiences.map((e) => e.id));
  const experienceList = sortAndFilterExperiences(
    nonEmptyExperiences,
    sortAndFilterValues,
    intl,
  );

  const hasExperiences = !!experiences.length;
  const hasExperiencesByType = !!experienceList.length;

  return (
    <>
      <Heading icon={UserCircleIcon} color="error">
        {intl.formatMessage(navigationMessages.careerTimeline)}
      </Heading>
      <div className="mb-3 flex flex-wrap gap-3">
        <ExperienceSortAndFilter
          initialFormValues={sortAndFilterValues}
          onChange={(formValues) => setSortAndFilterValues(formValues)}
        />
        {hasExperiences && (
          <div className="self-end xs:ml-auto">
            <Button mode="inline" color="primary" onClick={toggleAllExpanded}>
              {intl.formatMessage(
                hasExpanded
                  ? experienceMessages.collapseDetails
                  : experienceMessages.expandDetails,
              )}
            </Button>
          </div>
        )}
      </div>
      {hasExperiences ? (
        <div className="flex flex-col gap-y-3">
          {hasExperiencesByType ? (
            experienceList.map((experience) => (
              <ExperienceCard
                key={experience.id}
                /**
                    This comes from the snapshot so we cant fragmentize it so we are tricking typescript :(
                */
                experienceQuery={makeFragmentData(
                  {
                    ...experience,
                    __typename: experience.__typename ?? "AwardExperience",
                  },
                  ExperienceCard_Fragment,
                )}
                headingLevel="h3"
                showSkills={false}
                showEdit={false}
                isOpen={isExpanded(experience.id)}
                onOpenChange={() => toggleExpandedItem(experience.id)}
              />
            ))
          ) : (
            <Well className="text-center">
              <p>{intl.formatMessage(commonMessages.noExperiencesOfType)}</p>
            </Well>
          )}
        </div>
      ) : (
        <Well className="text-center">
          <p>
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
