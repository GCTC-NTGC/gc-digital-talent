import React from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { getLocalizedName, getSkillLevelName } from "@gc-digital-talent/i18n";
import { CardRepeater, useCardRepeaterContext } from "@gc-digital-talent/ui";
import {
  UpdateUserSkillRankingsInput,
  Skill,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { useAuthorization } from "@gc-digital-talent/auth";

import { FormValues as SkillBrowserDialogFormValues } from "~/components/SkillBrowser/types";

import RemoveDialog from "./RemoveDialog";
import { UpdateUserSkillRankings_Mutation } from "../operations";

type SkillShowcaseCardProps = {
  index: number;
  item: SkillBrowserDialogFormValues;
  skills: Skill[];
  // which user-skill ranking are we updating with this card
  userSkillRanking: keyof UpdateUserSkillRankingsInput;
};

const SkillShowcaseCard = ({
  index,
  item,
  skills,
  userSkillRanking,
}: SkillShowcaseCardProps) => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const [, updateUserSkillRankingsMutation] = useMutation(
    UpdateUserSkillRankings_Mutation,
  );
  const { items } = useCardRepeaterContext();

  const getSkill = (skillId: string | undefined) =>
    skills.find((skill) => skill.id === skillId);

  // the mutation has be done at the card level.  If done in the parent the card is unmounted and dialog is lost if there is an error.
  const handleRemove = (): Promise<void> => {
    const copyOfItems = [...(items || [])];
    copyOfItems.splice(index, 1);
    return updateUserSkillRankingsMutation({
      userId: userAuthInfo?.id,
      userSkillRanking: {
        [userSkillRanking]: [
          ...copyOfItems.map((userSkill) => userSkill.skill),
        ],
      },
    }).then((res) => {
      if (res.data?.updateUserSkillRankings) {
        return;
      }
      throw new Error("No data returned");
    });
  };

  return (
    <CardRepeater.Card
      index={index}
      remove={<RemoveDialog index={index} onRemove={handleRemove} />}
    >
      <div
        className="flex"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5)"
        data-h2-margin-top="base(x.5)"
      >
        <span
          className="flex"
          data-h2-justify-content="base(space-between)"
          role="presentation"
        >
          <span className="font-bold">
            {getLocalizedName(getSkill(item.skill)?.name ?? undefined, intl)}
          </span>
          <span
            data-h2-font-weight="base(400)"
            data-h2-color="base(black.light)"
          >
            {item.skillLevel
              ? intl.formatMessage(
                  getSkillLevelName(
                    item.skillLevel,
                    item.category === SkillCategory.Behavioural
                      ? SkillCategory.Behavioural
                      : SkillCategory.Technical,
                  ),
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
