import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { commonMessages, getSkillLevelName } from "@gc-digital-talent/i18n";
import { CardRepeater, useCardRepeaterContext } from "@gc-digital-talent/ui";
import type {
  FragmentType,
  UpdateUserSkillRankingsInput,
} from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { useAuthorization } from "@gc-digital-talent/auth";

import type { FormValues as SkillBrowserDialogFormValues } from "~/components/SkillBrowser/types";

import RemoveDialog from "./RemoveDialog";
import { UpdateUserSkillRankings_Mutation } from "../operations";

export const SkillShowcaseCardSkill_Fragment = graphql(/* GraphQL */ `
  fragment SkillShowcaseCardSkill on Skill {
    id
    name {
      localized
    }
    description {
      localized
    }
  }
`);

interface SkillShowcaseCardProps {
  index: number;
  item: SkillBrowserDialogFormValues;
  query: FragmentType<typeof SkillShowcaseCardSkill_Fragment>[];
  // which user-skill ranking are we updating with this card
  userSkillRanking: keyof UpdateUserSkillRankingsInput;
}

const SkillShowcaseCard = ({
  index,
  item,
  query,
  userSkillRanking,
}: SkillShowcaseCardProps) => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const [, updateUserSkillRankingsMutation] = useMutation(
    UpdateUserSkillRankings_Mutation,
  );
  const { items } = useCardRepeaterContext();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const skill = getFragment(SkillShowcaseCardSkill_Fragment, query).find(
    (currentSkill) => currentSkill.id === item.skill,
  );

  // the mutation has be done at the card level.  If done in the parent the card is unmounted and dialog is lost if there is an error.
  const handleRemove = async (): Promise<void> => {
    const copyOfItems = [...(items ?? [])] as SkillBrowserDialogFormValues[];
    copyOfItems.splice(index, 1);
    const res = await updateUserSkillRankingsMutation({
      userId: userAuthInfo?.id ?? "",
      userSkillRanking: {
        [userSkillRanking]: [
          ...copyOfItems.map((userSkill) => userSkill.skill),
        ],
      },
    });
    if (res.data?.updateUserSkillRankings) {
      return;
    }
    throw new Error("No data returned");
  };

  return (
    <CardRepeater.Card
      index={index}
      remove={<RemoveDialog index={index} onRemove={handleRemove} />}
    >
      <div className="mt-3 flex flex-col gap-3">
        <span className="flex justify-between" role="presentation">
          <span className="font-bold">
            {skill?.name?.localized ?? notAvailable}
          </span>
          <span className="text-gray-600 dark:text-gray-200">
            {item.skillLevel
              ? intl.formatMessage(
                  getSkillLevelName(
                    item.skillLevel,
                    item.category === SkillCategory.Behavioural
                      ? SkillCategory.Behavioural
                      : SkillCategory.Technical,
                  ),
                )
              : notAvailable}
          </span>
        </span>

        <div>
          <p>{skill?.description?.localized ?? notAvailable}</p>
        </div>
      </div>
    </CardRepeater.Card>
  );
};

export default SkillShowcaseCard;
