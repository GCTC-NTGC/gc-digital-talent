import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import { Button } from "@common/components";
import {
  AwardExperience,
  CommunityExperience,
  EducationExperience,
  PersonalExperience,
  WorkExperience,
  Skill,
} from "../../api/generated";

export interface AccordionProps {
  anExperience: {
    experienceType?: string;
    // closed accordion info and repeated fields
    title?: string;
    awardedDate?: string;
    issuedBy?: string;
    role?: string;
    organization?: string;
    areaOfStudy?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    details?: string;
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
    experienceSkills: { name: string; description: string }[];
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
    areaOfStudy,
    institution,
    startDate,
    endDate,
    details,
    awardedTo,
    awardedScope,
    project,
    type,
    status,
    thesisTitle,
    description,
    division,
    experienceSkills,
  } = anExperience;

  // experience type is required with 5 possibilities, build different accordion around which type it is
  let experienceInstance;
  if (experienceType === "AwardExperience") {
    // create unordered list element of skills DOM Element
    const skillsList = experienceSkills.map((skill, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ul key={index}>
        <li>
          <p>
            {skill.name}
            <br />
            {skill.description}
          </p>
        </li>
      </ul>
    ));
    // create the main accordion DOM Element with appropriate formatting
    experienceInstance = (
      <Accordion
        title={`${title || ""} - ${issuedBy || ""}`}
        subtitle={`Since: ${awardedDate || ""}`}
        context={
          experienceSkills?.length === 1
            ? `1 Skill`
            : `${experienceSkills?.length} Skills`
        }
        Icon={BriefCaseIcon}
      >
        <div data-h2-padding="b(left, l)">
          <p>
            {title} issued by {issuedBy}
          </p>
          <p>Awarded to: {awardedTo}</p>
          <p>Scope: {awardedScope}</p>
        </div>
        <hr />
        <div data-h2-padding="b(left, l)">{skillsList}</div>
        <div data-h2-padding="b(left, l)">
          <p>{`Additional information: ${details || "None"}`}</p>
        </div>
        <div data-h2-padding="b(left, l)">
          <Button color="primary" mode="outline">
            Edit Experience
          </Button>
        </div>
      </Accordion>
    );
  } else if (experienceType === "CommunityExperience") {
    const skillsList = experienceSkills.map((skill, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ul key={index}>
        <li>
          <p>
            {skill.name}
            <br />
            {skill.description}
          </p>
        </li>
      </ul>
    ));
    experienceInstance = (
      <Accordion
        title={`${role || ""} at ${organization || ""}`}
        subtitle={
          endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : `Since: ${startDate || ""}`
        }
        context={
          experienceSkills?.length === 1
            ? `1 Skill`
            : `${experienceSkills?.length} Skills`
        }
        Icon={BriefCaseIcon}
      >
        {" "}
        <div data-h2-padding="b(left, l)">
          <p>
            {role} at {organization}
          </p>
          <p>{project}</p>
        </div>
        <hr />
        <div data-h2-padding="b(left, l)">{skillsList}</div>
        <div data-h2-padding="b(left, l)">
          <p>{`Additional information: ${details || "None"}`}</p>
        </div>
        <div data-h2-padding="b(left, l)">
          <Button color="primary" mode="outline">
            Edit Experience
          </Button>
        </div>
      </Accordion>
    );
  } else if (experienceType === "EducationExperience") {
    const skillsList = experienceSkills.map((skill, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ul key={index}>
        <li>
          <p>
            {skill.name}
            <br />
            {skill.description}
          </p>
        </li>
      </ul>
    ));
    experienceInstance = (
      <Accordion
        title={`${areaOfStudy || ""} at ${institution || ""}`}
        subtitle={
          endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : `Since: ${startDate || ""}`
        }
        context={
          experienceSkills?.length === 1
            ? `1 Skill`
            : `${experienceSkills?.length} Skills`
        }
        Icon={BriefCaseIcon}
      >
        <div data-h2-padding="b(left, l)">
          <p>
            {type} {status}
          </p>
          <p>
            {areaOfStudy} at {institution}
          </p>
          <p>{thesisTitle ? `Thesis: ${thesisTitle}` : ""}</p>
        </div>
        <hr />
        <div data-h2-padding="b(left, l)">{skillsList}</div>
        <div data-h2-padding="b(left, l)">
          <p>{`Additional information: ${details || "None"}`}</p>
        </div>
        <div data-h2-padding="b(left, l)">
          <Button color="primary" mode="outline">
            Edit Experience
          </Button>
        </div>
      </Accordion>
    );
  } else if (experienceType === "PersonalExperience") {
    const skillsList = experienceSkills.map((skill, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ul key={index}>
        <li>
          <p>
            {skill.name}
            <br />
            {skill.description}
          </p>
        </li>
      </ul>
    ));
    experienceInstance = (
      <Accordion
        title={title || ""}
        subtitle={
          endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : `Since: ${startDate || ""}`
        }
        context={
          experienceSkills?.length === 1
            ? `1 Skill`
            : `${experienceSkills?.length} Skills`
        }
        Icon={BriefCaseIcon}
      >
        <div data-h2-padding="b(left, l)">
          <p>{description}</p>
        </div>
        <hr />
        <div data-h2-padding="b(left, l)">{skillsList}</div>
        <div data-h2-padding="b(left, l)">
          <p>{`Additional information: ${details || "None"}`}</p>
        </div>
        <div data-h2-padding="b(left, l)">
          <Button color="primary" mode="outline">
            Edit Experience
          </Button>
        </div>
      </Accordion>
    );
  } else if (experienceType === "WorkExperience") {
    const skillsList = experienceSkills.map((skill, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <ul key={index}>
        <li>
          <p>
            {skill.name}
            <br />
            {skill.description}
          </p>
        </li>
      </ul>
    ));
    experienceInstance = (
      <Accordion
        title={`${role || ""} at ${organization || ""}`}
        subtitle={
          endDate
            ? `${startDate || ""} - ${endDate || ""}`
            : `Since: ${startDate || ""}`
        }
        context={
          experienceSkills?.length === 1
            ? `1 Skill`
            : `${experienceSkills?.length} Skills`
        }
        Icon={BriefCaseIcon}
      >
        <div data-h2-padding="b(left, l)">
          <p>
            {role} at {division}
          </p>
          <p>{organization}</p>
        </div>
        <hr />
        <div data-h2-padding="b(left, l)">{skillsList}</div>
        <div data-h2-padding="b(left, l)">
          <p>{`Additional information: ${details || "None"}`}</p>
        </div>
        <div data-h2-padding="b(left, l)">
          <Button color="primary" mode="outline">
            Edit Experience
          </Button>
        </div>
      </Accordion>
    );
  } else {
    // not one of the 5 experience types
    experienceInstance = (
      <Accordion title={`Unknown experience: ${experienceType}`} />
    );
  }

  return <div>{experienceInstance}</div>;
};

export default ExperienceAccordion;
