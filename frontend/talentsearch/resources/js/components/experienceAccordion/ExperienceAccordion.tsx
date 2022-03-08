import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
} from "../../api/generated";

export interface AccordionProps {
  anExperience: {
    experienceType: string;
    // closed accordion info and repeated fields
    title?: string;
    awardedDate?: string;
    issuedBy?: string;
    role?: string;
    organization?: string;
    areaStudy?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    // opened accordion info
    // awards
    awardedTo?: string;
    awardedScope?: string;
    // community
    project?: string;
    // education
    type?: string;
    status?: string;
    thesisTitle?: string;
    // personal
    description?: string;
    // work
    division?: string;
    // linked skills
    experienceSkills?: [];
  };
}

const ExperienceAccordion: React.FunctionComponent<AccordionProps> = ({
  anExperience,
}) => {
  // destructuring required due to linting?
  const {
    experienceType,
    title,
    awardedDate,
    issuedBy,
    role,
    organization,
    areaStudy,
    institution,
    startDate,
    endDate,
    awardedTo,
    awardedScope,
    project,
    type,
    status,
    thesisTitle,
    description,
    division,
  } = anExperience;

  // experience type is required with 5 possibilities, build different accordion around which type it is
  let experienceInstance;
  if (experienceType === "AwardExperience") {
    experienceInstance = (
      <Accordion
        title={`${title || ""} - ${issuedBy || ""}`}
        subtitle={`Since: ${awardedDate || ""}`}
        context="skills count"
        Icon={BriefCaseIcon}
      >
        <div>
          <p>
            {title} issued by {issuedBy}
          </p>
          <p>Awarded to: {awardedTo}</p>
          <p>Scope: {awardedScope}</p>
        </div>
      </Accordion>
    );
  } else if (experienceType === "CommunityExperience") {
    experienceInstance = (
      <Accordion
        title={`${role || ""} at ${organization || ""}`}
        subtitle={
          endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : `Since: ${startDate || ""}`
        }
        context="skills count"
        Icon={BriefCaseIcon}
      >
        {" "}
        <div>
          <p>
            {role} at {organization}
          </p>
          <p>{project}</p>
        </div>
      </Accordion>
    );
  } else if (experienceType === "EducationExperience") {
    experienceInstance = (
      <Accordion
        title={`${areaStudy || ""} at ${institution || ""}`}
        subtitle={
          endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : `Since: ${startDate || ""}`
        }
        context="skills count"
        Icon={BriefCaseIcon}
      >
        <div>
          <p>
            {type} {status}
          </p>
          <p>
            {areaStudy} at {institution}
          </p>
          <p>{thesisTitle ? `Thesis: ${thesisTitle}` : ""}</p>
        </div>
      </Accordion>
    );
  } else if (experienceType === "PersonalExperience") {
    experienceInstance = (
      <Accordion
        title={title || ""}
        subtitle={
          endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : `Since: ${startDate || ""}`
        }
        context="skills count"
        Icon={BriefCaseIcon}
      >
        <div>
          <p>{description}</p>
        </div>
      </Accordion>
    );
  } else {
    // work experience only one left
    experienceInstance = (
      <Accordion
        title={`${role || ""} at ${organization || ""}`}
        subtitle={
          endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : `Since: ${startDate || ""}`
        }
        context="skills count"
        Icon={BriefCaseIcon}
      >
        <div>
          <p>
            {role} at {division}
          </p>
          <p>{organization}</p>
        </div>
      </Accordion>
    );
  }

  return <div>{experienceInstance}</div>;
};

export default ExperienceAccordion;
