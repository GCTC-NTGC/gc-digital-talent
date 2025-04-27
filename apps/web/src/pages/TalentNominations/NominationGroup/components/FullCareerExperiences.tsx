import React from "react";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { MAX_DATE } from "@gc-digital-talent/date-helpers/const";
import { CardBasic } from "@gc-digital-talent/ui";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import { Experience } from "~/components/ExperienceCard/types";

interface FullCareerExperiencesProps {
  experiences: Experience[];
}

const FullCareerExperiences = ({ experiences }: FullCareerExperiencesProps) => {
  return (
    <CardBasic
      data-h2-padding="base(0 0 0 x.5)"
      data-h2-border-radius="base(0 0 0 x.5)"
      data-h2-background-color="base(white)"
      data-h2-box-shadow="base(0 0 0 x.5)"
    >
      {unpackMaybes(
        experiences.map((experience) => {
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
  );
};

export default FullCareerExperiences;
