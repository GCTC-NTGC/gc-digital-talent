/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from "react";
import { useIntl } from "react-intl";
import { getLocale } from "../../../helpers/localize";
import Accordion from "../../Accordion";
import {
  getAwardedScope,
  getAwardedTo,
  getEducationStatus,
  getEducationType,
} from "../../../constants/localizedConstants";

import { getDateRange, formattedDate } from "../accordionUtils";
import {
  Skill,
  PersonalExperience,
  WorkExperience,
  AwardExperience,
  CommunityExperience,
  EducationExperience,
} from "../../../api/generated";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "../../../types/ExperienceUtils";

export interface SkillAccordionProps {
  skill: Skill;
}

const SkillAccordion: React.FunctionComponent<SkillAccordionProps> = ({
  skill,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const { name, experiences } = skill;

  const getPersonalExperience = (experience: PersonalExperience) => {
    const { title, description, startDate, endDate, details } = experience;
    return (
      <>
        <p data-h2-color="base(dt-primary)">{title}</p>
        <p data-h2-margin="base(0, 0, x.5, 0)">
          {getDateRange({ endDate, startDate, intl })}
        </p>
        <p> {description} </p>
        <p>{skill.experienceSkillRecord?.details}</p>
        <p> {details} </p>
      </>
    );
  };

  const getEducationExperience = (experience: EducationExperience) => {
    const {
      type,
      thesisTitle,
      startDate,
      endDate,
      details,
      status,
      areaOfStudy,
      institution,
    } = experience;

    return (
      <div>
        <p>
          <span data-h2-color="base(dt-primary)"> {areaOfStudy} </span>
          {intl.formatMessage(
            {
              defaultMessage: " at {institution}",
              id: "CX/qKY",
              description: "Study at institution",
            },
            { institution },
          )}
        </p>
        <p data-h2-margin="base(0, 0, x.5, 0)">
          {getDateRange({ endDate, startDate, intl })}
        </p>
        <p>
          {type ? intl.formatMessage(getEducationType(type)) : ""}{" "}
          <span
            data-h2-color="base(dt-primary)"
            data-h2-font-style="base(italic)"
          >
            {status ? intl.formatMessage(getEducationStatus(status)) : ""}{" "}
          </span>
        </p>
        <p>
          {thesisTitle
            ? intl.formatMessage(
                {
                  defaultMessage: "Thesis: {thesisTitle}",
                  id: "omDlZN",
                  description: "Thesis, if applicable",
                },
                { thesisTitle },
              )
            : ""}
        </p>
        <p> {details} </p>
        <p>{skill.experienceSkillRecord?.details}</p>
      </div>
    );
  };

  const getAwardExperience = (experience: AwardExperience) => {
    const { awardedDate, awardedScope, awardedTo, details, title, issuedBy } =
      experience;
    return (
      <>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "<primary>{title}</primary> issued by {issuedBy}",
              id: "cK/hoN",
              description: "The award title is issued by some group",
            },
            { issuedBy, title },
          )}
        </p>
        <p data-h2-margin="base(0, 0, x.5, 0)">
          {awardedDate && formattedDate(awardedDate, intl)}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Awarded to: ",
            id: "3JL02L",
            description: "The award was given to",
          })}{" "}
          {awardedTo ? intl.formatMessage(getAwardedTo(awardedTo)) : ""}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Scope: ",
            id: "FAOzjP",
            description: "The scope of the award given",
          })}{" "}
          {awardedScope
            ? intl.formatMessage(getAwardedScope(awardedScope))
            : ""}
        </p>
        <p>{skill.experienceSkillRecord?.details}</p>
        <p
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(x1, 0, x.25, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Additional information:",
            id: "+nS/ak",
            description: "Additional information if provided (without details)",
          })}
        </p>

        <p>{details}</p>
      </>
    );
  };

  const getCommunityExperience = (experience: CommunityExperience) => {
    const { startDate, endDate, project, organization, details, title } =
      experience;
    return (
      <>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "<primary>{title}</primary> at {organization}",
              id: "UPx6kk",
              description: "Title at organization",
            },
            { organization, title },
          )}
        </p>
        <p data-h2-margin="base(0, 0, x.5, 0)">
          {getDateRange({ endDate, startDate, intl })}
        </p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "Project: {project}",
              id: "gtLuDM",
              description: "Project Name",
            },
            { project },
          )}
        </p>
        <p>{skill.experienceSkillRecord?.details}</p>
        <p
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(x1, 0, x.25, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Additional information:",
            id: "+nS/ak",
            description: "Additional information if provided (without details)",
          })}
        </p>
        <p>{details}</p>
      </>
    );
  };

  const getWorkExperience = (experience: WorkExperience) => {
    const { startDate, endDate, role, division, organization, details } =
      experience;
    return (
      <>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "<primary>{role}</primary> at {organization}",
              id: "VOheZB",
              description:
                "Role at organization in work experience block of skill accordion.",
            },
            { organization, role },
          )}
        </p>
        <p data-h2-margin="base(0, 0, x.5, 0)">
          {getDateRange({ endDate, startDate, intl })}
        </p>
        <p>{division}</p>
        <p>{skill.experienceSkillRecord?.details}</p>
        <p
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(x1, 0, x.25, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Additional information:",
            id: "+nS/ak",
            description: "Additional information if provided (without details)",
          })}
        </p>
        <p>{details}</p>
      </>
    );
  };
  const renderWithExperience = () => {
    return experiences?.map((experience) => {
      return (
        <ul data-h2-padding="base(0, 0, 0, x1)" key={experience?.id}>
          <li data-h2-margin="base(x1, 0, 0, 0)">
            {isPersonalExperience(experience!)
              ? getPersonalExperience(experience)
              : ""}
            {isEducationExperience(experience!)
              ? getEducationExperience(experience)
              : ""}
            {isAwardExperience(experience!)
              ? getAwardExperience(experience)
              : ""}
            {isCommunityExperience(experience!)
              ? getCommunityExperience(experience)
              : ""}
            {isWorkExperience(experience!) ? getWorkExperience(experience) : ""}
          </li>
        </ul>
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
          <p data-h2-font-weight="base(700)">
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
        context={
          experiences?.length === 1
            ? intl.formatMessage({
                defaultMessage: "1 Experience",
                id: "dQseX7",
                description: "Pluralization for one experience",
              })
            : intl.formatMessage(
                {
                  defaultMessage: "{experienceLength} Experiences",
                  id: "xNVsei",
                  description: "Pluralization for zero or multiple experiences",
                },
                { experienceLength: experiences ? experiences.length : 0 },
              )
        }
      >
        {name[locale]}
      </Accordion.Trigger>
      <Accordion.Content>{renderDetail()}</Accordion.Content>
    </Accordion.Item>
  );
};
export default SkillAccordion;
