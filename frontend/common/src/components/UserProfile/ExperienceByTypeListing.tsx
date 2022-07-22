import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import * as React from "react";
import { useIntl } from "react-intl";
import ExperienceAccordion, {
  ExperiencePaths,
} from "./ExperienceAccordion/ExperienceAccordion";
import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "../../types/ExperienceUtils";
import { AwardExperience, Experience } from "../../api/generated";

const ExperienceByType: React.FunctionComponent<{
  title: string;
  icon: React.ReactNode;
  experiences: Experience[];
  experienceEditPaths?: ExperiencePaths; // If experienceEditPaths is not defined, links to edit experiences will not appear.
  defaultOpen?: boolean;
}> = ({
  title,
  icon,
  experiences,
  experienceEditPaths,
  defaultOpen = false,
}) => {
  return (
    <div>
      <div data-h2-display="b(flex)" data-h2-margin="b(top-bottom, m)">
        {icon}
        <p
          data-h2-font-size="b(h4)"
          data-h2-margin="b(all, none)"
          data-h2-padding="b(left, s)"
        >
          {title}
        </p>
      </div>
      {experiences.map((experience) => (
        <ExperienceAccordion
          key={experience.id}
          experience={experience}
          editPaths={experienceEditPaths}
          defaultOpen={defaultOpen}
        />
      ))}
    </div>
  );
};
export interface ExperienceSectionProps {
  experiences?: Experience[];
  defaultOpen?: boolean;
  editPaths?: ExperiencePaths;
}

const ExperienceByTypeListing: React.FunctionComponent<
  ExperienceSectionProps
> = ({ experiences, editPaths, defaultOpen = false }) => {
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
      <ExperienceByType
        title={intl.formatMessage({ defaultMessage: "Personal" })}
        icon={<LightBulbIcon style={{ width: "1.5rem" }} />}
        experiences={personalExperiences}
        defaultOpen={defaultOpen}
        experienceEditPaths={editPaths}
      />
      <ExperienceByType
        title={intl.formatMessage({ defaultMessage: "Community" })}
        icon={<UserGroupIcon style={{ width: "1.5rem" }} />}
        experiences={communityExperiences}
        defaultOpen={defaultOpen}
        experienceEditPaths={editPaths}
      />
      <ExperienceByType
        title={intl.formatMessage({ defaultMessage: "Work" })}
        icon={<BriefcaseIcon style={{ width: "1.5rem" }} />}
        experiences={workExperiences}
        defaultOpen={defaultOpen}
        experienceEditPaths={editPaths}
      />
      <ExperienceByType
        title={intl.formatMessage({ defaultMessage: "Education" })}
        icon={<BookOpenIcon style={{ width: "1.5rem" }} />}
        experiences={educationExperiences}
        defaultOpen={defaultOpen}
        experienceEditPaths={editPaths}
      />
      <ExperienceByType
        title={intl.formatMessage({ defaultMessage: "Award" })}
        icon={<StarIcon style={{ width: "1.5rem" }} />}
        experiences={awardExperiences}
        defaultOpen={defaultOpen}
        experienceEditPaths={editPaths}
      />
    </>
  );
};

export default ExperienceByTypeListing;
