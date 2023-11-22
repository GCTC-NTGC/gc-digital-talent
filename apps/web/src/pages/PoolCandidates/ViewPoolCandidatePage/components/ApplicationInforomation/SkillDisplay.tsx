import React from "react";
import { useIntl } from "react-intl";

import { Experience, Skill } from "@gc-digital-talent/graphql";

import SkillTree from "~/components/SkillTree/SkillTree";

interface SkillDisplayProps {
  skills: Skill[];
  experiences: Experience[];
}

const SkillDisplay = ({ skills, experiences }: SkillDisplayProps) => {
  const intl = useIntl();

  return (
    <>
      <p>
        {intl.formatMessage({
          defaultMessage: "Represented by the following experiences:",
          id: "mDowK/",
          description:
            "Lead in text for experiences that represent the users skills",
        })}
      </p>
      {skills.map((skill) => (
        <SkillTree
          key={skill.id}
          skill={skill}
          experiences={experiences}
          showDisclaimer
          hideConnectButton
          hideEdit
          disclaimerMessage={
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "There are no experiences attached to this skill.",
                id: "XrfkBm",
                description:
                  "Message displayed when no experiences have been attached to a skill",
              })}
            </p>
          }
        />
      ))}
    </>
  );
};

export default SkillDisplay;
