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

type AnExperience =
  | AwardExperience
  | CommunityExperience
  | EducationExperience
  | PersonalExperience
  | WorkExperience;

export interface AccordionProps {
  anExperience: AnExperience;
}
const determineIfAward = (
  anExperience: AnExperience,
): anExperience is AwardExperience => {
  //
  if (anExperience as AwardExperience) {
    return true;
  }
  return false;
};

const determineIfCommunity = (
  anExperience: AnExperience,
): anExperience is CommunityExperience => {
  //
  if (anExperience as CommunityExperience) {
    return true;
  }
  return false;
};

const determineIfEducation = (
  anExperience: AnExperience,
): anExperience is EducationExperience => {
  //
  if (anExperience as EducationExperience) {
    return true;
  }
  return false;
};
const determineIfPersonal = (
  anExperience: AnExperience,
): anExperience is PersonalExperience => {
  //
  if (anExperience as PersonalExperience) {
    return true;
  }
  return false;
};

const determineIfWork = (
  anExperience: AnExperience,
): anExperience is WorkExperience => {
  //
  if (anExperience as WorkExperience) {
    return true;
  }
  return false;
};

const ExperienceAccordion: React.FunctionComponent<AccordionProps> = ({
  anExperience,
}) => {
  // experience type is required with 5 possibilities, build different accordion around which type it is
  let experienceInstance;
  if (determineIfAward(anExperience)) {
    const {
      title,
      awardedDate,
      issuedBy,
      details,
      awardedTo,
      awardedScope,
      experienceSkills = [],
    } = anExperience;

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
  } else if (determineIfCommunity(anExperience)) {
    const {
      role,
      organization,
      startDate,
      endDate,
      details,
      project,
      experienceSkills = [],
    } = anExperience;

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
  } else if (determineIfEducation(anExperience)) {
    const {
      areaOfStudy,
      institution,
      startDate,
      endDate,
      details,
      type,
      status,
      thesisTitle,
      experienceSkills = [],
    } = anExperience;

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
  } else if (determineIfPersonal(anExperience)) {
    const {
      title,
      startDate,
      endDate,
      details,
      description,
      experienceSkills = [],
    } = anExperience;

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
  } else if (determineIfWork(anExperience)) {
    const {
      role,
      organization,
      startDate,
      endDate,
      details,
      division,
      experienceSkills = [],
    } = anExperience;

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
    experienceInstance = <Accordion title="Unknown experience" />;
  }

  return <div>{experienceInstance}</div>;
};

export default ExperienceAccordion;
