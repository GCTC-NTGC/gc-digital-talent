import React from "react";
import { useIntl } from "react-intl";

import Well from "@gc-digital-talent/ui/src/components/Well";

import { Experience, Skill } from "~/api/generated";
import SkillTree from "~/components/SkillTree/SkillTree";
import { getExperiencesSkillIds } from "~/utils/skillUtils";

interface AssetSkillsFilteredProps {
  poolAssetSkills: Skill[];
  experiences: Experience[];
}

const AssetSkillsFiltered = ({
  poolAssetSkills,
  experiences,
}: AssetSkillsFilteredProps) => {
  const intl = useIntl();

  const experiencesSkillIds = getExperiencesSkillIds(experiences);
  const usedAssetsSkills = poolAssetSkills.filter((assetSkill) =>
    experiencesSkillIds.includes(assetSkill.id),
  );

  return usedAssetsSkills.length > 0 ? (
    <>
      <p>
        {intl.formatMessage({
          defaultMessage: "Represented by the following experiences:",
          id: "mDowK/",
          description:
            "Lead in text for experiences that represent the users skills",
        })}
      </p>
      {usedAssetsSkills.map((optionalTechnicalSkill) => (
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
  ) : (
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

export default AssetSkillsFiltered;
