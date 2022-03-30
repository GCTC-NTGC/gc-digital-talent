/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from "react";
import { getLocale, Locales } from "@common/helpers/localize";
import Accordion from "@common/components/accordion";
import { IntlShape, useIntl } from "react-intl";
import {
  getAwardedScope,
  getAwardedTo,
  getEducationStatus,
  getEducationType,
} from "@common/constants/localizedConstants";

import { Scalars } from "@common/api/generated";
import {
  Skill,
  PersonalExperience,
  WorkExperience,
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  Maybe,
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

function formatDate(date: Scalars["Date"], locale: Locales) {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
  });
  return formatter.format(new Date(date));
}

function getDateRange({
  endDate,
  startDate,
  intl,
  locale,
}: {
  endDate: Maybe<Scalars["Date"]>;
  startDate: Maybe<Scalars["Date"]>;
  intl: IntlShape;
  locale: Locales;
}): React.ReactNode {
  if (!startDate) return null;
  const d1 = formatDate(startDate, locale);
  if (!endDate)
    return intl.formatMessage(
      {
        defaultMessage: "Since: {d1}",
        description: "Since",
      },
      { d1 },
    );
  const d2 = formatDate(endDate, locale);
  return endDate
    ? `${d1} - ${d2}`
    : intl.formatMessage(
        {
          defaultMessage: "Since: {d1}",
          description: "Since",
        },
        { d1 },
      );
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
      <div>
        <p data-h2-font-color="b(lightpurple)"> {title} </p>
        <p>{getDateRange({ endDate, startDate, intl, locale })}</p>
        <p> {description} </p>
        <p> {details} </p>
      </div>
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
      <div>
        <p>
          <span data-h2-font-color="b(lightpurple)" title="award">
            {" "}
            {title}{" "}
          </span>
          {intl.formatMessage(
            {
              defaultMessage: " issued by {issuedBy}",
              description: "The award title is issued by some group",
            },
            { issuedBy },
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
        <p> {awardedDate && formatDate(awardedDate, locale)}</p>
        <p>
          {intl.formatMessage(
            {
              defaultMessage: "Additional information: {details}",
              description: "Additional information if provided",
            },
            { details },
          )}
        </p>
      </div>
    );
  };

  const getCommunityExperience = (experience: CommunityExperience) => {
    const { startDate, endDate, project, organization, details, title } =
      experience;
    return (
      <div>
        <p>
          <span data-h2-font-color="b(lightpurple)"> {title} </span>
          {intl.formatMessage(
            {
              defaultMessage: " at {organization}",
              description: "Title at organization",
            },
            { organization },
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
      </div>
    );
  };

  const getWorkExperience = (experience: WorkExperience) => {
    const { startDate, endDate, role, division, organization, details } =
      experience;
    return (
      <div>
        <p>
          <span data-h2-font-color="b(lightpurple)" title="work">
            {role}{" "}
          </span>
          {intl.formatMessage(
            {
              defaultMessage: " at {division}",
              description: "Role at Team, Group or Division",
            },
            { division },
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
      </div>
    );
  };
  const renderWithExperience = () => {
    return experiences?.map((experience) => {
      return (
        <ul key={experience?.id}>
          <li>
            <p>
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
              {isWorkExperience(experience!)
                ? getWorkExperience(experience)
                : ""}
            </p>
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
              { experienceLength: experiences?.length },
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
