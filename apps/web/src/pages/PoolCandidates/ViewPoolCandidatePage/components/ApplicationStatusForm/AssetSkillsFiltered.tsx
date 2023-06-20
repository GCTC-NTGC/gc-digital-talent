import React from "react";
import { useIntl } from "react-intl";

import { Experience, Skill } from "@gc-digital-talent/graphql";
import Well from "@gc-digital-talent/ui/src/components/Well";

import SkillTree from "~/pages/Applications/ApplicationSkillsPage/components/SkillTree";
import { getExperiencesSkillIds } from "~/utils/skillUtils";

export interface AssetSkillsFilteredProps {
  poolAssetSkills: Skill[];
  experiences: Experience[];
}

const AssetSkillsFiltered = ({
  poolAssetSkills,
  experiences,
}: AssetSkillsFilteredProps) => {
  const intl = useIntl();

  // conditional rendering function, dependent on input array length
  const renderAssetsSkillTree = (assetSkills: Skill[]) => {
    if (assetSkills.length > 0) {
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
          {assetSkills.map((optionalTechnicalSkill) => (
            <SkillTree
              key={optionalTechnicalSkill.id}
              skill={optionalTechnicalSkill}
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
    }

    return (
      <Well>
        {intl.formatMessage({
          defaultMessage: "There are no asset skills attached.",
          id: "VeiXJP",
          description:
            "Informing that a section is empty of any associated asset skills.",
        })}
      </Well>
    );
  };

  const experiencesSkillIds = getExperiencesSkillIds(experiences);
  const usedAssetsSkills = poolAssetSkills.filter((assetSkill) =>
    experiencesSkillIds.includes(assetSkill.id),
  );

  return <>{renderAssetsSkillTree(usedAssetsSkills)}</>;
};

export default AssetSkillsFiltered;
