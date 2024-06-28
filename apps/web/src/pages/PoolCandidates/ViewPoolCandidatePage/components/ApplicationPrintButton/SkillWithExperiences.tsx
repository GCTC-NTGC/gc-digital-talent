import { useIntl } from "react-intl";
import { ReactNode, JSX } from "react";

import {
  commonMessages,
  getAwardedTo,
  getEducationStatus,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { Experience, Scalars, Skill } from "@gc-digital-talent/graphql";

import { getExperienceSkills } from "~/utils/skillUtils";
import experienceMessages from "~/messages/experienceMessages";
import { formattedDate, getDateRange } from "~/utils/dateUtils";
import {
  getExperienceFormLabels,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

const PageSection = ({ children }: { children: ReactNode }) => (
  <div
    data-h2-margin-bottom="base(2rem)"
    data-h2-display="base(block)"
    data-h2-break-inside="base(avoid) base:print(avoid)"
    data-h2-break-after="base(avoid) base:print(avoid)"
  >
    {children}
  </div>
);

const getRelevantSkillRecordDetails = (
  experience: Experience,
  skillId: Skill["id"],
): string | null => {
  const experienceSkills = experience.skills ?? [];
  const applicableSkill = experienceSkills.find(
    (skill) => skill.id === skillId,
  );

  return applicableSkill?.experienceSkillRecord?.details ?? null;
};

interface ExperienceListForSkillProps {
  experience: Experience;
  skillId: Scalars["UUID"]["output"];
}

const ExperienceListForSkill = ({
  experience,
  skillId,
}: ExperienceListForSkillProps) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  if (isAwardExperience(experience)) {
    const { title, issuedBy, awardedDate, awardedTo, details } = experience;
    return (
      <>
        <p>
          {intl.formatMessage(experienceMessages.awardIssuedBy, {
            title,
            issuedBy,
          })}
        </p>
        <p>
          {awardedDate
            ? formattedDate(awardedDate, intl)
            : intl.formatMessage(commonMessages.notProvided)}
        </p>
        <p>
          {experienceFormLabels.awardedTo}
          {intl.formatMessage(commonMessages.dividingColon)}
          {awardedTo
            ? intl.formatMessage(getAwardedTo(awardedTo))
            : intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.howIUsed}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getRelevantSkillRecordDetails(experience, skillId) ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>{details}</p>
        <p>
          {experienceFormLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {details ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
      </>
    );
  }
  if (isCommunityExperience(experience)) {
    const { title, organization, endDate, startDate, project, details } =
      experience;
    return (
      <>
        <p>
          {intl.formatMessage(experienceMessages.communityAt, {
            title,
            organization,
          })}
        </p>
        <p>{getDateRange({ endDate, startDate, intl })}</p>
        <p>
          {experienceFormLabels.project}
          {intl.formatMessage(commonMessages.dividingColon)}
          {project ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.howIUsed}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getRelevantSkillRecordDetails(experience, skillId) ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {details ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
      </>
    );
  }
  if (isEducationExperience(experience)) {
    const { areaOfStudy, institution, startDate, endDate, status, details } =
      experience;
    return (
      <>
        <p>
          {intl.formatMessage(experienceMessages.educationAt, {
            areaOfStudy,
            institution,
          })}
        </p>
        <p>{getDateRange({ endDate, startDate, intl })}</p>
        <p>
          {experienceFormLabels.educationStatus}
          {intl.formatMessage(commonMessages.dividingColon)}
          {status
            ? intl.formatMessage(getEducationStatus(status))
            : intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.howIUsed}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getRelevantSkillRecordDetails(experience, skillId) ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {details ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
      </>
    );
  }
  if (isPersonalExperience(experience)) {
    const { details, title, startDate, endDate, description } = experience;
    return (
      <>
        <p>{title || ""}</p>
        <p>{getDateRange({ endDate, startDate, intl })}</p>
        <p>{description}</p>
        <p>
          {experienceFormLabels.howIUsed}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getRelevantSkillRecordDetails(experience, skillId) ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {details ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
      </>
    );
  }

  if (isWorkExperience(experience)) {
    const { role, organization, startDate, endDate, division, details } =
      experience; // left with work experience
    return (
      <>
        <p>
          {intl.formatMessage(experienceMessages.workAt, {
            role,
            organization,
          })}
        </p>
        <p>{getDateRange({ endDate, startDate, intl })}</p>
        <p>
          {experienceFormLabels.team}
          {intl.formatMessage(commonMessages.dividingColon)}
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.howIUsed}
          {intl.formatMessage(commonMessages.dividingColon)}
          {getRelevantSkillRecordDetails(experience, skillId) ??
            intl.formatMessage(commonMessages.notAvailable)}
        </p>
        <p>
          {experienceFormLabels.details}
          {intl.formatMessage(commonMessages.dividingColon)}
          {details ?? intl.formatMessage(commonMessages.notAvailable)}
        </p>
      </>
    );
  }

  return null;
};

interface SkillWithExperiencesProps {
  skill: Skill;
  experiences: Experience[];
}

const SkillWithExperiences = ({
  skill,
  experiences,
}: SkillWithExperiencesProps): JSX.Element => {
  const intl = useIntl();
  const skillExperiences = getExperienceSkills(experiences, skill);

  const description = getLocalizedName(skill.description, intl, true);

  return (
    <PageSection>
      <p data-h2-font-weight="base(700)">
        {getLocalizedName(skill.name, intl)}
      </p>
      {description && <p>{description}</p>}
      <ul>
        {skillExperiences.map((experience) => {
          return (
            <li key={experience.id}>
              <ExperienceListForSkill
                experience={experience}
                skillId={skill.id}
              />
            </li>
          );
        })}
      </ul>
    </PageSection>
  );
};

export default SkillWithExperiences;
