import React from "react";
import { Accordion } from "@common/components/accordion/Accordion";
import BriefCaseIcon from "@heroicons/react/solid/BriefcaseIcon";
import { Button } from "@common/components";
import {
  awardedToMessages,
  awardedScopeMessages,
} from "@common/constants/localizedConstants";
import { AwardExperience } from "../../../api/generated";

const AwardAccordion: React.FunctionComponent<AwardExperience> = ({
  title,
  awardedDate,
  issuedBy,
  details,
  awardedTo,
  awardedScope,
  experienceSkills,
}) => {
  // create unordered list element of skills DOM Element
  const skillsList = experienceSkills
    ? experienceSkills.map((skill, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul key={index}>
          <li>
            <p>
              {skill?.skill.name.en}
              <br />
              {skill?.details}
            </p>
          </li>
        </ul>
      ))
    : "";

  // turning enums into messages
  let awardedToLocalized;
  if (awardedTo === "ME") {
    awardedToLocalized = awardedToMessages.ME.defaultMessage;
  }
  if (awardedTo === "MY_ORGANIZATION") {
    awardedToLocalized = awardedToMessages.MY_ORGANIZATION.defaultMessage;
  }
  if (awardedTo === "MY_PROJECT") {
    awardedToLocalized = awardedToMessages.MY_PROJECT.defaultMessage;
  }
  if (awardedTo === "MY_TEAM") {
    awardedToLocalized = awardedToMessages.MY_TEAM.defaultMessage;
  }

  let awardedScopeLocalized;
  if (awardedScope === "COMMUNITY") {
    awardedScopeLocalized = awardedScopeMessages.INTERNATIONAL.defaultMessage;
  }
  if (awardedScope === "INTERNATIONAL") {
    awardedScopeLocalized = awardedScopeMessages.INTERNATIONAL.defaultMessage;
  }
  if (awardedScope === "LOCAL") {
    awardedScopeLocalized = awardedScopeMessages.INTERNATIONAL.defaultMessage;
  }
  if (awardedScope === "NATIONAL") {
    awardedScopeLocalized = awardedScopeMessages.INTERNATIONAL.defaultMessage;
  }
  if (awardedScope === "ORGANIZATIONAL") {
    awardedScopeLocalized = awardedScopeMessages.INTERNATIONAL.defaultMessage;
  }
  if (awardedScope === "PROVINCIAL") {
    awardedScopeLocalized = awardedScopeMessages.INTERNATIONAL.defaultMessage;
  }
  if (awardedScope === "SUB_ORGANIZATIONAL") {
    awardedScopeLocalized = awardedScopeMessages.INTERNATIONAL.defaultMessage;
  }

  return (
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
        <p>Awarded to: {awardedToLocalized}</p>
        <p>Scope: {awardedScopeLocalized}</p>
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
};

export default AwardAccordion;
