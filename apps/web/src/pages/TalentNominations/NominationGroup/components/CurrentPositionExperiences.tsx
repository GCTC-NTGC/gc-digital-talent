import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { currentDate } from "@gc-digital-talent/date-helpers";
import { MAX_DATE } from "@gc-digital-talent/date-helpers/const";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import { isWorkExperience } from "~/utils/experienceUtils";

export const CurrentPositionExperiences_Fragment = graphql(/* GraphQL */ `
  fragment CurrentPositionExperiences on User {
    experiences {
      id
      ...ExperienceCard
    }
  }
`);

const isCurrentExperience = (endDate?: string | null): boolean => {
  if (!endDate) {
    return true;
  }

  const currentDateString = currentDate();
  if (endDate > currentDateString) {
    return true;
  }

  return false;
};

interface CurrentPositionExperiencesProps {
  query?: FragmentType<typeof CurrentPositionExperiences_Fragment>;
}

const CurrentPositionExperiences = ({
  query,
}: CurrentPositionExperiencesProps) => {
  const data = getFragment(CurrentPositionExperiences_Fragment, query);

  const experiences = unpackMaybes(data?.experiences);

  const workExperiences = experiences.filter((experience) =>
    isWorkExperience(experience),
  );

  const currentWorkExperiences = workExperiences.filter((exp) =>
    isCurrentExperience(exp.endDate),
  );
  const sorted = currentWorkExperiences.sort((a, b) => {
    const aStart = a?.startDate ? new Date(a.startDate) : MAX_DATE;
    const bStart = b?.startDate ? new Date(b.startDate) : MAX_DATE;
    return bStart.getTime() - aStart.getTime(); // more recent start sorted higher
  });

  return (
    <div>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5 0)"
      >
        {sorted.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} showEdit={false} />
        ))}
      </div>
    </div>
  );
};

export default CurrentPositionExperiences;
