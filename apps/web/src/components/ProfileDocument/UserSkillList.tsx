import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getBehaviouralSkillLevel,
  getLocalizedName,
  getTechnicalSkillLevel,
} from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";
import { UserSkill } from "@gc-digital-talent/graphql";

interface UserSkillListProps {
  technical: UserSkill[];
  behavioural: UserSkill[];
}

const UserSkillList = ({ technical, behavioural }: UserSkillListProps) => {
  const intl = useIntl();

  return (
    <>
      <Heading level="h6" data-h2-font-weight="base(700)">
        {intl.formatMessage({
          defaultMessage: "Behavioural skills",
          id: "Ih9aGC",
          description: "Heading for a list of users behavioural skills",
        })}
      </Heading>
      {behavioural.length > 0 ? (
        <ol>
          {behavioural?.map((userSkill) => (
            <li key={userSkill.id}>
              {getLocalizedName(userSkill.skill.name, intl)}
              {intl.formatMessage(commonMessages.dividingColon)}
              {intl.formatMessage(
                userSkill.skillLevel
                  ? getBehaviouralSkillLevel(userSkill.skillLevel)
                  : commonMessages.unspecified,
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p>{intl.formatMessage(commonMessages.notProvided)}</p>
      )}

      <Heading level="h6" data-h2-font-weight="base(700)">
        {intl.formatMessage({
          defaultMessage: "Technical skills",
          id: "5DsB2D",
          description: "Heading for a list of users technical skills",
        })}
      </Heading>

      {technical.length > 0 ? (
        <ol>
          {technical.map((userSkill) => (
            <li key={userSkill.id}>
              {getLocalizedName(userSkill.skill.name, intl)}
              {intl.formatMessage(commonMessages.dividingColon)}
              {intl.formatMessage(
                userSkill.skillLevel
                  ? getTechnicalSkillLevel(userSkill.skillLevel)
                  : commonMessages.unspecified,
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p>{intl.formatMessage(commonMessages.notProvided)}</p>
      )}
    </>
  );
};

export default UserSkillList;
