import React from "react";
import { useIntl } from "react-intl";

import { AwardExperience, Experience } from "@gc-digital-talent/graphql";

import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

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
          }) as AwardExperience & { startDate: string; endDate: string },
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
      {workExperiences.length ? (
        <ExperienceType
          title={intl.formatMessage({
            defaultMessage: "Work experiences",
            id: "QvyQc3",
            description: "Heading for work experiences",
          })}
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
          experiences={educationExperiences}
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
          experiences={communityExperiences}
        />
      ) : null}
      {personalExperiences.length ? (
        <ExperienceType
          title={intl.formatMessage({
            defaultMessage: "Personal experiences",
            id: "6VyRZ/",
            description:
              "Heading for personal experiences in experience by type listing",
          })}
          experiences={personalExperiences}
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
          experiences={awardExperiences}
        />
      ) : null}
    </>
  );
};

export default PrintExperienceByType;
