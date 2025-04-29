import React from "react";
import { useIntl } from "react-intl";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { MAX_DATE } from "@gc-digital-talent/date-helpers/const";
import { Accordion, CardBasic } from "@gc-digital-talent/ui";
import { AwardExperience } from "@gc-digital-talent/graphql";

import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import { Experience } from "~/components/ExperienceCard/types";

interface FullCareerExperiencesProps {
  experiences: Experience[];
}

const FullCareerExperiences = ({ experiences }: FullCareerExperiencesProps) => {
  const intl = useIntl();

  const awardExperiences =
    experiences
      ?.filter(isAwardExperience)
      .map(
        (award: Omit<AwardExperience, "user">) =>
          ({
            ...award,
            startDate: award.awardedDate,
            endDate: award.awardedDate,
          }) as AwardExperience & { startDate: string; endDate: string },
      )
      .sort(compareByDate) ?? [];
  const communityExperiences =
    experiences?.filter(isCommunityExperience).sort(compareByDate) ?? [];
  const educationExperiences =
    experiences?.filter(isEducationExperience).sort(compareByDate) ?? [];
  const personalExperiences =
    experiences?.filter(isPersonalExperience).sort(compareByDate) ?? [];
  const workExperiences: Experience[] =
    experiences?.filter(isWorkExperience).sort(compareByDate) ?? [];

  const experienceSections = [
    {
      id: "WorkExperience",
      title: intl.formatMessage({
        defaultMessage: "Work experience",
        id: "ayIdMa",
        description: "Heading for work experiences",
      }),
      experiences: workExperiences,
    },
    {
      id: "AwardExperience",
      title: intl.formatMessage({
        defaultMessage: "Awards and recognition",
        id: "5KEERD",
        description: "Heading for awards",
      }),
      experiences: awardExperiences,
    },
    {
      id: "CommunityExperience",
      title: intl.formatMessage({
        defaultMessage: "Community participation",
        id: "g4quJR",
        description: "Heading for community experiences",
      }),
      experiences: communityExperiences,
    },
    {
      id: "EducationExperience",
      title: intl.formatMessage({
        defaultMessage: "Education and certificates",
        id: "tBudth",
        description: "Heading for education experiences",
      }),
      experiences: educationExperiences,
    },
    {
      id: "PersonalExperience",
      title: intl.formatMessage({
        defaultMessage: "Personal learning",
        id: "xqW2sR",
        description: "Heading for personal experiences",
      }),
      experiences: personalExperiences,
    },
  ];

  return (
    <Accordion.Root
      type="multiple"
      mode="card"
      collapsible
      data-h2-margin="base(0, 0)"
    >
      {experienceSections
        .filter(
          ({ experiences: sectionExperiences }) =>
            sectionExperiences.length > 0,
        )
        .map(({ id, title, experiences: sectionExperiences }) => (
          <Accordion.Item key={id} value={id}>
            <Accordion.Trigger>
              {intl.formatMessage(
                {
                  defaultMessage: "{title} ({count})",
                  id: "Rb4Khk",
                  description: "Title with the count of experiences",
                },
                { title, count: experiences.length },
              )}
            </Accordion.Trigger>
            <Accordion.Content>
              <CardBasic
                data-h2-padding="base(0 0 0 x.5)"
                data-h2-border-radius="base(0 0 0 x.5)"
                data-h2-background-color="base(white)"
                data-h2-box-shadow="base(0 0 0 x.5)"
              >
                {unpackMaybes(
                  sectionExperiences.map((experience) => {
                    const startDate = parseDateTimeUtc(experience.startDate);
                    const endDate = experience.endDate
                      ? parseDateTimeUtc(experience.endDate)
                      : MAX_DATE;

                    return (
                      <ExperienceCard
                        key={experience.id}
                        experience={experience}
                        startDate={startDate}
                        endDate={endDate}
                        isCurrentPosition={false}
                        showEdit={false}
                      />
                    );
                  }),
                )}
              </CardBasic>
            </Accordion.Content>
          </Accordion.Item>
        ))}
    </Accordion.Root>
  );
};

export default FullCareerExperiences;
