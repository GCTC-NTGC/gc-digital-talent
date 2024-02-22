import React from "react";
import { useIntl } from "react-intl";

import {
  getLocalizedName,
  getBehaviouralSkillLevel,
  getTechnicalSkillLevel,
} from "@gc-digital-talent/i18n";
import { CardRepeater, useCardRepeaterContext } from "@gc-digital-talent/ui";

import { Skill, SkillCategory } from "~/api/generated";
import { FormValues as SkillBrowserDialogFormValues } from "~/components/SkillBrowser/types";

import RemoveDialog from "./RemoveDialog";

type SkillShowcaseCardProps = {
  index: number;
  item: SkillBrowserDialogFormValues;
  onMove: (fromIndex: number, toIndex: number) => void;
  skills: Skill[];
};

const SkillShowcaseCard = ({
  index,
  item,
  onMove,
  skills,
}: SkillShowcaseCardProps) => {
  const intl = useIntl();
  const { move, remove: removeFromRepeater } = useCardRepeaterContext();

  const getSkill = (skillId: string | undefined) =>
    skills.find((skill) => skill.id === skillId);

  const handleMove = (from: number, to: number) => {
    console.debug("Card moving");
    move(from, to);
    onMove(from, to);
  };

  const handleRemove = (removeIndex: number) => removeFromRepeater(removeIndex);

  return (
    <CardRepeater.Card
      index={index}
      onMove={handleMove} // immediately fire event
      remove={
        <RemoveDialog index={index} onRemove={() => handleRemove(index)} />
      }
    >
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5)"
        data-h2-margin-top="base(x.5)"
      >
        <span
          data-h2-display="base(flex)"
          data-h2-justify-content="base(space-between)"
          role="presentation"
        >
          <span data-h2-font-weight="base(700)">
            {getLocalizedName(getSkill(item.skill)?.name ?? undefined, intl)}
          </span>
          <span
            data-h2-font-weight="base(400)"
            data-h2-color="base(black.light)"
          >
            {item.skillLevel
              ? intl.formatMessage(
                  item.category === SkillCategory.Behavioural
                    ? getBehaviouralSkillLevel(item.skillLevel)
                    : getTechnicalSkillLevel(item.skillLevel),
                )
              : getLocalizedName(null, intl)}
          </span>
        </span>

        <div>
          <p>
            {getLocalizedName(
              getSkill(item.skill)?.description ?? undefined,
              intl,
            )}
          </p>
        </div>
      </div>
    </CardRepeater.Card>
  );
};

export default SkillShowcaseCard;
