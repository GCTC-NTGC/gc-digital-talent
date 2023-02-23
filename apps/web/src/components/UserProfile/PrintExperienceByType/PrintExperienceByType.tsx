import React from "react";
import { useIntl } from "react-intl";
import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

import { AwardExperience, Experience } from "~/api/generated";
import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/types/experience";
import ExperienceType from "./ExperienceType";

interface PrintExperienceByTypeProps {
  experiences?: Experience[];
}

const PrintExperienceByType = ({ experiences }: PrintExperienceByTypeProps) => {
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
      {personalExperiences.length ? (
        <ExperienceType
          title={intl.formatMessage({
            defaultMessage: "Personal experiences",
            id: "6VyRZ/",
            description:
              "Heading for personal experiences in experience by type listing",
          })}
          icon={<LightBulbIcon style={{ width: "1.5rem" }} />}
          experiences={personalExperiences}
        />
      ) : null}
      {communityExperiences.length ? (
        <ExperienceType
          title={intl.formatMessage({
            defaultMessage: "Community experiences",
            id: "iWD2Pz",
            description:
              "Heading for community experiences in experience by type listing",
          })}
          icon={<UserGroupIcon style={{ width: "1.5rem" }} />}
          experiences={communityExperiences}
        />
      ) : null}
      {workExperiences.length ? (
        <ExperienceType
          title={intl.formatMessage({
            defaultMessage: "Work experiences",
            id: "aBSEkP",
            description:
              "Heading for personal experiences in experience by type listing",
          })}
          icon={<BriefcaseIcon style={{ width: "1.5rem" }} />}
          experiences={workExperiences}
        />
      ) : null}
      {educationExperiences.length ? (
        <ExperienceType
          title={intl.formatMessage({
            defaultMessage: "Education experiences",
            id: "pV96Xv",
            description:
              "Heading for education experiences in experience by type listing",
          })}
          icon={<BookOpenIcon style={{ width: "1.5rem" }} />}
          experiences={educationExperiences}
        />
      ) : null}
      {awardExperiences.length ? (
        <ExperienceType
          title={intl.formatMessage({
            defaultMessage: "Award experiences",
            id: "X0YPib",
            description:
              "Heading for award experiences in experience by type listing",
          })}
          icon={<StarIcon style={{ width: "1.5rem" }} />}
          experiences={awardExperiences}
        />
      ) : null}
    </>
  );
};

export default PrintExperienceByType;
