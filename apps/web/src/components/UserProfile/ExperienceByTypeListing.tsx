import * as React from "react";
import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { useIntl } from "react-intl";

import { Accordion, HeadingRank } from "@gc-digital-talent/ui";

import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/types/experience";
import { AwardExperience, Experience } from "~/api/generated";

import ExperienceAccordion, {
  ExperiencePaths,
} from "./ExperienceAccordion/ExperienceAccordion";

const ExperienceByType = ({
  title,
  headingLevel = "h2",
  icon,
  experiences,
  experienceEditPaths,
}: {
  title: string;
  headingLevel?: HeadingRank;
  icon: React.ReactNode;
  experiences: Experience[];
  experienceEditPaths?: ExperiencePaths; // If experienceEditPaths is not defined, links to edit experiences will not appear.
}) => {
  return (
    <div className="experience-category">
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-padding="base(0, 0, x.5, 0)"
      >
        <span data-h2-margin="base(x.125, x.5, 0, 0)">{icon}</span>
        <p data-h2-font-size="base(h5, 1)">{title}</p>
      </div>
      <div>
        <Accordion.Root type="single" collapsible>
          {experiences.map((experience) => (
            <ExperienceAccordion
              key={experience.id}
              experience={experience}
              editPaths={experienceEditPaths}
              headingLevel={headingLevel}
            />
          ))}
        </Accordion.Root>
      </div>
    </div>
  );
};
export interface ExperienceSectionProps {
  experiences?: Experience[];
  headingLevel?: HeadingRank;
  editPaths?: ExperiencePaths;
}

const ExperienceByTypeListing = ({
  experiences,
  editPaths,
  headingLevel = "h2",
}: ExperienceSectionProps) => {
  const intl = useIntl();

  const awardExperiences =
    experiences
      ?.filter(isAwardExperience)
      .map(
        (award: AwardExperience) =>
          ({
            ...award,
            startDate: award.awardedDate,
            endDate: award.awardedDate,
          } as AwardExperience & { startDate: string; endDate: string }),
      )
      .sort(compareByDate) || [];
  const communityExperiences =
    experiences?.filter(isCommunityExperience).sort(compareByDate) || [];
  const educationExperiences =
    experiences?.filter(isEducationExperience).sort(compareByDate) || [];
  const personalExperiences =
    experiences?.filter(isPersonalExperience).sort(compareByDate) || [];
  const workExperiences =
    experiences?.filter(isWorkExperience).sort(compareByDate) || [];

  return (
    <>
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
          experiences={personalExperiences}
          experienceEditPaths={editPaths}
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
            experiences={communityExperiences}
            experienceEditPaths={editPaths}
          />
        </div>
      ) : null}
      {workExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Work experiences",
              id: "aBSEkP",
              description:
                "Heading for personal experiences in experience by type listing",
            })}
            headingLevel={headingLevel}
            icon={<BriefcaseIcon style={{ width: "1.5rem" }} />}
            experiences={workExperiences}
            experienceEditPaths={editPaths}
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
            experiences={educationExperiences}
            experienceEditPaths={editPaths}
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
            experiences={awardExperiences}
            experienceEditPaths={editPaths}
          />
        </div>
      ) : null}
    </>
  );
};

export default ExperienceByTypeListing;
