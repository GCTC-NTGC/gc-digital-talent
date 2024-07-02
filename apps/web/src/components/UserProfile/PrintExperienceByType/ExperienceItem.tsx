import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Skill, Experience, Maybe } from "@gc-digital-talent/graphql";

import {
  getExperienceFormLabels,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
  useExperienceInfo,
} from "~/utils/experienceUtils";
import { getDateRange } from "~/utils/dateUtils";

interface SkillListProps {
  skills?: Maybe<Skill[]>;
}

const SkillList = ({ skills }: SkillListProps) => {
  const intl = useIntl();

  if (!skills) return null;

  return (
    <ul>
      {skills?.map((skill) => (
        <li key={skill.id}>
          {getLocalizedName(skill.name, intl)}
          {skill.experienceSkillRecord?.details
            ? ` - ${skill.experienceSkillRecord?.details}`
            : ""}
        </li>
      ))}
    </ul>
  );
};

interface ExperienceItemProps {
  experience: Experience;
}

const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  const intl = useIntl();
  const { title } = useExperienceInfo(experience);
  const experienceLabels = getExperienceFormLabels(intl);

  const normalizedDateRange = (
    startDate: Maybe<string> | undefined,
    endDate: Maybe<string> | undefined,
  ) => {
    return getDateRange({
      startDate,
      endDate,
      intl,
    });
  };

  let content = null;
  let dateRange = null;

  if (isAwardExperience(experience)) {
    dateRange = normalizedDateRange(experience.awardedDate, undefined);
    content = (
      <>
        <p>
          {experienceLabels.awardedTo}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getLocalizedName(experience.awardedTo?.label, intl)}
        </p>
        <p>
          {experienceLabels.issuedBy}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.issuedBy}
        </p>
        <p data-h2-margin-bottom="base(x1)">
          {experienceLabels.awardedScope}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getLocalizedName(experience.awardedScope?.label, intl)}
        </p>
        <p>
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        <SkillList skills={experience.skills} />
      </>
    );
  }

  if (isCommunityExperience(experience)) {
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
    content = (
      <>
        <p data-h2-margin-bottom="base(x1)">
          {experienceLabels.project}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.project}
        </p>
        <p data-h2-margin-bottom="base(x1)">
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        <SkillList skills={experience.skills} />
      </>
    );
  }

  if (isEducationExperience(experience)) {
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
    content = (
      <>
        <p>
          {experienceLabels.areaOfStudy}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.areaOfStudy}
        </p>
        <p>
          {experienceLabels.educationStatus}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getLocalizedName(experience.status?.label, intl)}
        </p>
        <p data-h2-margin-bottom="base(x1)">
          {experienceLabels.thesisTitle}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.thesisTitle}
        </p>
        <p data-h2-margin-bottom="base(x1)">
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        <SkillList skills={experience.skills} />
      </>
    );
  }

  if (isPersonalExperience(experience)) {
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
    content = (
      <>
        <p data-h2-margin-bottom="base(x1)">
          {intl.formatMessage({
            defaultMessage: "Learning description",
            id: "szVmh/",
            description:
              "Label displayed on Personal Experience form for learning description section",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.description}
        </p>
        <p data-h2-margin-bottom="base(x1)">
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        <SkillList skills={experience.skills} />
      </>
    );
  }

  if (isWorkExperience(experience)) {
    dateRange = normalizedDateRange(experience.startDate, experience.endDate);
    content = (
      <>
        <p data-h2-margin-bottom="base(x1)">
          {experienceLabels.team}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.division}
        </p>
        <p data-h2-margin-bottom="base(x1)">
          {experienceLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {experience.details}
        </p>
        <SkillList skills={experience.skills} />
      </>
    );
  }

  return (
    <div data-h2-break-inside="base(avoid) base:print(avoid)">
      <div data-h2-margin-bottom="base(x1)">
        {title && (
          <Heading level="h5" data-h2-font-weight="base(700)">
            {title}
          </Heading>
        )}
        {dateRange && <p>{dateRange}</p>}
      </div>
      {content && content}
    </div>
  );
};

export default ExperienceItem;
