import BookOpenIcon from "@heroicons/react/24/solid/BookOpenIcon";
import BriefcaseIcon from "@heroicons/react/24/solid/BriefcaseIcon";
import LightBulbIcon from "@heroicons/react/24/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Button, HeadingRank } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { compareByDate } from "~/utils/experienceUtils";
import useControlledCollapsibleGroup from "~/hooks/useControlledCollapsibleGroup";
import experienceMessages from "~/messages/experienceMessages";

import ExperienceCard from "../ExperienceCard/ExperienceCard";

const ExperienceByType_Fragment = graphql(/** GraphQL */ `
  fragment ExperienceByType on Experience {
    id
    ...ExperienceCard
  }
`);

interface ExperienceByTypeProps {
  title: string;
  headingLevel?: HeadingRank;
  icon: ReactNode;
  experiencesQuery?: FragmentType<typeof ExperienceByType_Fragment>[];
  editParam?: string;
  isExperienceOpen: (id: string) => boolean;
  onExperienceOpenChange: (id: string) => void;
}

const ExperienceByType = ({
  title,
  headingLevel = "h2",
  icon,
  experiencesQuery,
  editParam,
  isExperienceOpen,
  onExperienceOpenChange,
}: ExperienceByTypeProps) => {
  const experiences = getFragment(ExperienceByType_Fragment, experiencesQuery);

  return (
    <div>
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-padding="base(0, 0, x.5, 0)"
      >
        <span data-h2-margin="base(x.125, x.5, 0, 0)">{icon}</span>
        <p data-h2-font-size="base(h5, 1)">{title}</p>
      </div>
      <div>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {experiences?.map((experience) => (
            <ExperienceCard
              key={experience.id}
              isOpen={isExperienceOpen(experience.id)}
              onOpenChange={() => onExperienceOpenChange(experience.id)}
              experienceQuery={experience}
              headingLevel={headingLevel}
              editParam={editParam}
              showEdit={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ExperienceByTypeListingExperience_Fragment = graphql(/** GraphQL */ `
  fragment ExperienceByTypeListingExperience on Experience {
    id
    ...ExperienceByType
    ... on AwardExperience {
      awardedDate
    }
    ... on CommunityExperience {
      startDate
      endDate
    }
    ... on EducationExperience {
      startDate
      endDate
    }
    ... on PersonalExperience {
      startDate
      endDate
    }
    ... on WorkExperience {
      startDate
      endDate
    }
  }
`);

interface ExperienceByTypeListingProps {
  experiencesQuery?: FragmentType<
    typeof ExperienceByTypeListingExperience_Fragment
  >[];
  headingLevel?: HeadingRank;
  editParam?: string;
}

const ExperienceByTypeListing = ({
  experiencesQuery,
  editParam,
  headingLevel = "h2",
}: ExperienceByTypeListingProps) => {
  const intl = useIntl();
  const experiences = getFragment(
    ExperienceByTypeListingExperience_Fragment,
    experiencesQuery,
  );
  const { isExpanded, hasExpanded, toggleAllExpanded, toggleExpandedItem } =
    useControlledCollapsibleGroup(
      unpackMaybes(experiences).map(({ id }) => id),
    );

  const awardExperiences =
    experiences
      ?.filter((e) => e.__typename === "AwardExperience")
      .sort(compareByDate) ?? [];
  const communityExperiences =
    experiences
      ?.filter((e) => e.__typename === "CommunityExperience")
      .sort(compareByDate) ?? [];
  const educationExperiences =
    experiences
      ?.filter((e) => e.__typename === "EducationExperience")
      .sort(compareByDate) ?? [];
  const personalExperiences =
    experiences
      ?.filter((e) => e.__typename === "PersonalExperience")
      .sort(compareByDate) ?? [];
  const workExperiences =
    experiences
      ?.filter((e) => e.__typename === "WorkExperience")
      .sort(compareByDate) ?? [];

  return (
    <>
      <p data-h2-text-align="base(right)">
        <Button mode="inline" onClick={toggleAllExpanded}>
          {intl.formatMessage(
            hasExpanded
              ? experienceMessages.collapseDetails
              : experienceMessages.expandDetails,
          )}
        </Button>
      </p>
      {personalExperiences.length > 0 ? (
        <ExperienceByType
          title={intl.formatMessage({
            defaultMessage: "Personal experiences",
            id: "6VyRZ/",
            description:
              "Heading for personal experiences in experience by type listing",
          })}
          icon={<LightBulbIcon style={{ width: "1.5rem" }} />}
          headingLevel={headingLevel}
          editParam={editParam}
          experiencesQuery={personalExperiences}
          isExperienceOpen={isExpanded}
          onExperienceOpenChange={toggleExpandedItem}
        />
      ) : null}
      {communityExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Community experiences",
              id: "iWD2Pz",
              description:
                "Heading for community experiences in experience by type listing",
            })}
            headingLevel={headingLevel}
            icon={<UserGroupIcon style={{ width: "1.5rem" }} />}
            editParam={editParam}
            experiencesQuery={communityExperiences}
            isExperienceOpen={isExpanded}
            onExperienceOpenChange={toggleExpandedItem}
          />
        </div>
      ) : null}
      {workExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Work experiences",
              id: "QvyQc3",
              description: "Heading for work experiences",
            })}
            headingLevel={headingLevel}
            icon={<BriefcaseIcon style={{ width: "1.5rem" }} />}
            editParam={editParam}
            experiencesQuery={workExperiences}
            isExperienceOpen={isExpanded}
            onExperienceOpenChange={toggleExpandedItem}
          />
        </div>
      ) : null}
      {educationExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Education experiences",
              id: "pV96Xv",
              description:
                "Heading for education experiences in experience by type listing",
            })}
            headingLevel={headingLevel}
            icon={<BookOpenIcon style={{ width: "1.5rem" }} />}
            editParam={editParam}
            experiencesQuery={educationExperiences}
            isExperienceOpen={isExpanded}
            onExperienceOpenChange={toggleExpandedItem}
          />
        </div>
      ) : null}
      {awardExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Award experiences",
              id: "X0YPib",
              description:
                "Heading for award experiences in experience by type listing",
            })}
            headingLevel={headingLevel}
            icon={<StarIcon style={{ width: "1.5rem" }} />}
            editParam={editParam}
            experiencesQuery={awardExperiences}
            isExperienceOpen={isExpanded}
            onExperienceOpenChange={toggleExpandedItem}
          />
        </div>
      ) : null}
    </>
  );
};

export default ExperienceByTypeListing;
