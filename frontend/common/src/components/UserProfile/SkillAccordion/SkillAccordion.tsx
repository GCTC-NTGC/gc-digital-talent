/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from "react";
import { useIntl } from "react-intl";
import { getLocale } from "../../../helpers/localize";
import Accordion from "../../accordion";
import {
  getAwardedScope,
  getAwardedTo,
  getEducationStatus,
  getEducationType,
} from "../../../constants/localizedConstants";

import { getDateRange, formattedDate } from "../../../helpers/dateUtils";
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

const purpleText = (chunks: string[]) => (
  <span data-h2-font-color="b(lightpurple)">{...chunks}</span>
);

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
        <p data-h2-font-color="b(lightpurple)">{title}</p>
        <p>{getDateRange({ endDate, startDate, intl, locale })}</p>
        <p>{description}</p>
        <p>{details}</p>
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
          <span data-h2-font-color="b(lightpurple)"> {areaOfStudy} </span>
          {intl.formatMessage(
            {
              defaultMessage: " at {institution}",
              description: "Study at institution",
            },
            { institution },
          )}
        </p>
        <p>
          {" "}
          {type ? intl.formatMessage(getEducationType(type)) : ""}{" "}
          <span
            data-h2-font-color="b(lightpurple)"
            data-h2-font-style="b(italic)"
          >
            {" "}
            {status ? intl.formatMessage(getEducationStatus(status)) : ""}{" "}
          </span>
        </p>
        <p>
          {" "}
          {thesisTitle
            ? intl.formatMessage(
                {
                  defaultMessage: "Thesis: {thesisTitle}",
                  description: "Thesis, if applicable",
                },
                { thesisTitle },
              )
            : ""}{" "}
        </p>
        <p>{getDateRange({ endDate, startDate, intl, locale })}</p>
        <p> {details} </p>
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
              defaultMessage:
                "<purpleText>{title}</purpleText> issued by {issuedBy}",
              description: "The award title is issued by some group",
            },
            { issuedBy, title, purpleText },
          )}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Awarded to : ",
            description: "The award was given to",
          })}{" "}
          {awardedTo ? intl.formatMessage(getAwardedTo(awardedTo)) : ""}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Scope : ",
            description: "The scope of the award given",
          })}{" "}
          {awardedScope
            ? intl.formatMessage(getAwardedScope(awardedScope))
            : ""}
        </p>
        <p> {awardedDate && formattedDate(awardedDate, locale)}</p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}
        </p>
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
              defaultMessage:
                "<purpleText>{title}</purpleText> at {organization}",
              description: "Title at organization",
            },
            { organization, title, purpleText },
          )}
        </p>
        <p>{getDateRange({ endDate, startDate, intl, locale })}</p>
        <p>
          {" "}
          {intl.formatMessage(
            {
              defaultMessage: "Project: {project}",
              description: "Project Name",
            },
            { project },
          )}{" "}
        </p>
        <p>
          {" "}
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}{" "}
        </p>
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
              defaultMessage: "<purpleText>{role}</purpleText> at {division}",
              description: "Role at Team, Group or Division",
            },
            { division, role, purpleText },
          )}
        </p>
        <p>{organization}</p>
        <p>{getDateRange({ endDate, startDate, intl, locale })}</p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}
        </p>
      </>
    );
  };
  const renderWithExperience = () => {
    return experiences?.map((experience) => {
      return (
        <ul key={experience?.id}>
          <li>
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
          description: "The skill is not attached to any experience",
        })}
      </p>
    );
  };

  function renderDetail() {
    if (experiences != null && experiences.length > 0) {
      return renderWithExperience();
    }

    return renderNoExperience();
  }
  return (
    <Accordion
      title={`${name[locale]}`}
      data-testid="skill"
      context={
        experiences?.length === 1
          ? intl.formatMessage({
              defaultMessage: "1 Experience",
              description: "Pluralization for one experience",
            })
          : intl.formatMessage(
              {
                defaultMessage: "{experienceLength} Experiences",
                description: "Pluralization for zero or multiple experiences",
              },
              { experienceLength: experiences ? experiences.length : 0 },
            )
      }
    >
      <div data-h2-padding="b(left, l)" data-testid="detail">
        {renderDetail()}
      </div>
      <div data-h2-padding="b(left, l)" />
    </Accordion>
  );
};
export default SkillAccordion;
