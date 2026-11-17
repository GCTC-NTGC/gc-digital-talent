import { useState } from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Button, Heading, Notice } from "@gc-digital-talent/ui";
import type {
  ExperienceCardFragment,
  ExperienceListCardFragment,
} from "@gc-digital-talent/graphql";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";

import ExperienceCardV1 from "~/components/ExperienceCard/SnapshotV1/ExperienceCardV1";
import ExperienceCard, {
  ExperienceCard_Fragment,
} from "~/components/ExperienceCard/ExperienceCard";
import type { FormValues as ExperienceSortAndFilterFormValues } from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import ExperienceSortAndFilter from "~/components/ExperienceSortAndFilter/ExperienceSortAndFilter";
import { sortAndFilterExperiences } from "~/components/ExperienceSortAndFilter/sortAndFilterUtil";
import useControlledCollapsibleGroup from "~/hooks/useControlledCollapsibleGroup";
import experienceMessages from "~/messages/experienceMessages";
import type { SnapshotExperience } from "~/utils/experienceUtils";
import ExperienceListSortSelector, {
  type SortValue,
} from "~/components/ExperienceListCard/ExperienceListSortSelector";
import ExperienceListCard, {
  ExperienceListCard_Fragment,
} from "~/components/ExperienceListCard/ExperienceListCard";

interface CareerTimelineSnapshotProps {
  experiences: SnapshotExperience[];
  snapshotVersion: number | undefined;
}

const CareerTimelineSnapshot = ({
  experiences,
  snapshotVersion,
}: CareerTimelineSnapshotProps) => {
  const intl = useIntl();
  const featureFlags = useFeatureFlags();
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
  const snapshotV1 = !snapshotVersion || snapshotVersion === 1;

  // Used by the new cards behind the careerExperience flag
  const [sortBy, setSortBy] = useState<SortValue>("type");
  // This comes from the snapshot so we cant fragmentize it so we are tricking typescript :(
  const experiencesQuery = experiences.map((exp) =>
    makeFragmentData(
      exp as ExperienceListCardFragment,
      ExperienceListCard_Fragment,
    ),
  );

  const hasExperiences = !!experiences.length;
  const hasExperiencesByType = !!experienceList.length;

  return (
    <>
      <Heading icon={UserCircleIcon} color="error" rank="h2" size="h3">
        {intl.formatMessage(navigationMessages.careerTimeline)}
      </Heading>
      {featureFlags.careerExperience && !snapshotV1 ? (
        <>
          <ExperienceListSortSelector sortBy={sortBy} setSortBy={setSortBy} />
          {sortBy === "type" ? (
            <div className="grid gap-6">
              <ExperienceListCard
                type={"work"}
                experiencesQuery={experiencesQuery}
                showEdit={false}
              />
              <ExperienceListCard
                type={"education"}
                experiencesQuery={experiencesQuery}
                showEdit={false}
              />
              <ExperienceListCard
                type={"community"}
                experiencesQuery={experiencesQuery}
                showEdit={false}
              />
              <ExperienceListCard
                type={"personal"}
                experiencesQuery={experiencesQuery}
                showEdit={false}
              />
              <ExperienceListCard
                type={"award"}
                experiencesQuery={experiencesQuery}
                showEdit={false}
              />
            </div>
          ) : (
            <ExperienceListCard
              type={"timeline"}
              experiencesQuery={experiencesQuery}
              showEdit={false}
            />
          )}
        </>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-3">
            <ExperienceSortAndFilter
              initialFormValues={sortAndFilterValues}
              onChange={(formValues) => setSortAndFilterValues(formValues)}
            />
            {hasExperiences && (
              <div className="self-end xs:ml-auto">
                <Button
                  mode="inline"
                  color="primary"
                  onClick={toggleAllExpanded}
                >
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
                experienceList.map((experience) =>
                  snapshotV1 ? (
                    <ExperienceCardV1
                      key={experience.id}
                      experience={experience}
                      headingRank="h3"
                      showSkills={false}
                      isOpen={isExpanded(experience.id)}
                      onOpenChange={() => toggleExpandedItem(experience.id)}
                    />
                  ) : (
                    <ExperienceCard
                      key={experience.id}
                      /**
                        This comes from the snapshot so we cant fragmentize it so we are tricking typescript :(
                    */
                      experienceQuery={makeFragmentData(
                        {
                          ...experience,
                          __typename:
                            experience.__typename ?? "AwardExperience",
                        } as ExperienceCardFragment,
                        ExperienceCard_Fragment,
                      )}
                      headingRank="h3"
                      showSkills={false}
                      showEdit={false}
                      isOpen={isExpanded(experience.id)}
                      onOpenChange={() => toggleExpandedItem(experience.id)}
                    />
                  ),
                )
              ) : (
                <Notice.Root className="text-center">
                  <Notice.Content>
                    <p>
                      {intl.formatMessage(commonMessages.noExperiencesOfType)}
                    </p>
                  </Notice.Content>
                </Notice.Root>
              )}
            </div>
          ) : (
            <Notice.Root className="text-center">
              <Notice.Content>
                <p>
                  {intl.formatMessage({
                    defaultMessage: "No experiences found",
                    id: "gHMj31",
                    description:
                      "Null state messages for career timeline list when no experiences are found.",
                  })}
                </p>
              </Notice.Content>
            </Notice.Root>
          )}
        </>
      )}
    </>
  );
};

export default CareerTimelineSnapshot;
