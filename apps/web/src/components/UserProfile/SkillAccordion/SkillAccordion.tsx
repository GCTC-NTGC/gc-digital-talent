import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { Accordion, HeadingRank, Ul } from "@gc-digital-talent/ui";
import {
  getLocale,
  commonMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Skill,
  PersonalExperience,
  WorkExperience,
  AwardExperience,
  CommunityExperience,
  EducationExperience,
} from "@gc-digital-talent/graphql";

import {
  getExperienceFormLabels,
  getExperienceName,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import { InvertedSkillExperience } from "~/utils/skillUtils";
import { getDateRange, formattedDate } from "~/utils/dateUtils";
import experienceMessages from "~/messages/experienceMessages";

export interface SkillAccordionProps {
  skill: InvertedSkillExperience;
  headingLevel?: HeadingRank;
}

/**
 * @param skillsArray - array of skills attached to experience
 * @param accordionSkill - single skill that is the focus of a skill accordion
 * @returns justification for the skill that matches the accordion skill or return an empty string
 */
const grabSkillJustification = (
  skillsArray: Skill[],
  accordionSkill: Skill,
): string => {
  // find the skill from the array that matches the accordion skill
  const specificSkill = skillsArray.find(
    (skillIterator) => skillIterator.id === accordionSkill.id,
  );
  // guarding against possible undefined
  const justification = specificSkill?.experienceSkillRecord?.details ?? "";
  return justification;
};

const text = tv({
  base: "text-secondary-600 dark:text-secondary-200",
  variants: {
    bold: {
      true: "font-bold",
    },
    italic: {
      true: "italic",
    },
    space: {
      true: "mt-6 mb-1.5",
    },
  },
});

const SkillAccordion = ({
  skill,
  headingLevel = "h2",
}: SkillAccordionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const experienceFormLabels = getExperienceFormLabels(intl);

  const { name, experiences } = skill;

  const getPersonalExperience = (
    experience: Omit<PersonalExperience, "user">,
  ) => {
    const { title, description, startDate, endDate, details, skills } =
      experience;

    const justification = skills ? grabSkillJustification(skills, skill) : "";

    return (
      <>
        {title && <p className={text()}>{title}</p>}
        {endDate || startDate ? (
          <p className="mb-3">{getDateRange({ endDate, startDate, intl })}</p>
        ) : (
          ""
        )}
        {description && <p>{description}</p>}
        {justification && <p>{justification}</p>}
        {details && <p>{details}</p>}
      </>
    );
  };

  const getEducationExperience = (
    experience: Omit<EducationExperience, "user">,
  ) => {
    const {
      type,
      thesisTitle,
      startDate,
      endDate,
      details,
      status,
      areaOfStudy,
      institution,
      skills,
    } = experience;

    const justification = skills ? grabSkillJustification(skills, skill) : "";

    return (
      <>
        {type || areaOfStudy || institution ? (
          <p>{getExperienceName(experience, intl, true)}</p>
        ) : (
          intl.formatMessage(commonMessages.notProvided)
        )}
        {endDate || startDate ? (
          <p className="mb-3">{getDateRange({ endDate, startDate, intl })}</p>
        ) : (
          ""
        )}
        {type?.label && status?.label ? (
          <p>
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            {getLocalizedName(type.label, intl)}{" "}
            <span className={text({ italic: true })}>
              {getLocalizedName(status.label, intl)}
            </span>
          </p>
        ) : (
          ""
        )}
        {thesisTitle && (
          <p>
            {experienceFormLabels.thesisTitle}
            {intl.formatMessage(commonMessages.dividingColon)}
            {thesisTitle}
          </p>
        )}
        <p>{details}</p>
        <p>{justification}</p>
      </>
    );
  };

  const getAwardExperience = (experience: Omit<AwardExperience, "user">) => {
    const {
      awardedDate,
      awardedScope,
      awardedTo,
      details,
      title,
      issuedBy,
      skills,
    } = experience;

    const justification = skills ? grabSkillJustification(skills, skill) : "";

    return (
      <>
        {title || issuedBy ? (
          <p>
            {intl.formatMessage(experienceMessages.awardIssuedBy, {
              title: <span className={text()}>{title}</span>,
              issuedBy,
            })}
          </p>
        ) : (
          ""
        )}
        {awardedDate && (
          <p className="mb-3">{formattedDate(awardedDate, intl)}</p>
        )}
        {awardedTo?.label && (
          <p>
            {experienceFormLabels.awardedTo}
            {intl.formatMessage(commonMessages.dividingColon)}
            {getLocalizedName(awardedTo.label, intl)}
          </p>
        )}
        {awardedScope?.label && (
          <p>
            {experienceFormLabels.awardedScope}
            {intl.formatMessage(commonMessages.dividingColon)}
            {getLocalizedName(awardedScope.label, intl)}
          </p>
        )}
        {justification && <p>{justification}</p>}
        {details && (
          <>
            <p className={text({ space: true, bold: true })}>
              {experienceFormLabels.details}
              {intl.formatMessage(commonMessages.dividingColon)}
            </p>
            <p>{details}</p>
          </>
        )}
      </>
    );
  };

  const getCommunityExperience = (
    experience: Omit<CommunityExperience, "user">,
  ) => {
    const {
      startDate,
      endDate,
      project,
      organization,
      details,
      title,
      skills,
    } = experience;

    const justification = skills ? grabSkillJustification(skills, skill) : "";

    return (
      <>
        {title || organization ? (
          <p>
            {intl.formatMessage(experienceMessages.communityAt, {
              title: <span className={text()}>{title}</span>,
              organization,
            })}
          </p>
        ) : (
          ""
        )}
        {endDate || startDate ? (
          <p className="mb-3">{getDateRange({ endDate, startDate, intl })}</p>
        ) : (
          ""
        )}
        {project && (
          <>
            <p>
              {experienceFormLabels.project}
              {intl.formatMessage(commonMessages.dividingColon)}
            </p>
            <p>{project}</p>
          </>
        )}
        <p>{justification}</p>
        {details && (
          <>
            <p className={text({ space: true, bold: true })}>
              {experienceFormLabels.details}
              {intl.formatMessage(commonMessages.dividingColon)}
            </p>
            <p>{details}</p>
          </>
        )}
      </>
    );
  };

  const getWorkExperience = (experience: Omit<WorkExperience, "user">) => {
    const {
      startDate,
      endDate,
      role,
      division,
      organization,
      details,
      skills,
    } = experience;

    const justification = skills ? grabSkillJustification(skills, skill) : "";

    return (
      <>
        {role || organization ? (
          <p>
            {intl.formatMessage(experienceMessages.workAt, {
              role: <span className={text()}>{role}</span>,
              organization,
            })}
          </p>
        ) : (
          ""
        )}
        {endDate || startDate ? (
          <p className="mb-3">{getDateRange({ endDate, startDate, intl })}</p>
        ) : (
          ""
        )}
        {division && <p>{division}</p>}
        {justification && <p>{justification}</p>}
        {details && (
          <>
            <p className={text({ space: true, bold: true })}>
              {experienceFormLabels.details}
              {intl.formatMessage(commonMessages.dividingColon)}
            </p>
            <p>{details}</p>
          </>
        )}
      </>
    );
  };

  const renderWithExperience = () => {
    return experiences?.map((experience) => {
      return (
        <Ul space="xl" key={experience?.id} className="mt-6">
          <li>
            {isPersonalExperience(experience) &&
              getPersonalExperience(experience)}
            {isEducationExperience(experience) &&
              getEducationExperience(experience)}
            {isAwardExperience(experience) && getAwardExperience(experience)}
            {isCommunityExperience(experience) &&
              getCommunityExperience(experience)}
            {isWorkExperience(experience) && getWorkExperience(experience)}
          </li>
        </Ul>
      );
    });
  };

  const renderNoExperience = () => {
    return (
      <p>
        {intl.formatMessage({
          defaultMessage:
            "You do not have any experiences attached to this skill",
          id: "oC/GRF",
          description: "The skill is not attached to any experience",
        })}
      </p>
    );
  };

  function renderDetail() {
    if (experiences != null && experiences.length > 0) {
      return (
        <>
          <p className="mt-6 font-bold">
            {intl.formatMessage({
              defaultMessage:
                "This skill has the following related experiences:",
              id: "rcI/H3",
              description:
                "An introduction to a list of experiences associated with a skill",
            })}
          </p>
          {renderWithExperience()}
        </>
      );
    }
    return renderNoExperience();
  }
  return (
    <Accordion.Item value={skill.id}>
      <Accordion.Trigger
        as={headingLevel}
        context={intl.formatMessage(
          {
            defaultMessage:
              "{experienceCount, plural, =0 {0 experiences} one {# experience} other {# experiences}}",
            id: "uuXnmb",
            description: "list a number of unknown experiences",
          },
          {
            experienceCount: experiences ? experiences.length : 0,
          },
        )}
      >
        {name[locale]}
      </Accordion.Trigger>
      <Accordion.Content>{renderDetail()}</Accordion.Content>
    </Accordion.Item>
  );
};
export default SkillAccordion;
