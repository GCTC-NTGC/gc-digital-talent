import { MessageDescriptor } from "react-intl";

import { User, Pool, PoolLanguage } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<User, "lookingForBilingual">;

// Is the user missing the "looking for bilingual" profile option for this bilingual pool?
const isMissingLookingForBilingual = (
  user?: PartialUser,
  pool?: Pool | null,
): boolean => {
  const userLookingForBilingual = !!user?.lookingForBilingual;
  const poolNeedsBilingual =
    pool?.language?.value === PoolLanguage.BilingualIntermediate ||
    pool?.language?.value === PoolLanguage.BilingualAdvanced;

  if (poolNeedsBilingual && !userLookingForBilingual) return true;

  return false;
};

// Get a list of missing language requirement error message descriptors
export const getMissingLanguageRequirements = (
  user?: PartialUser,
  pool?: Pool | null,
): Array<MessageDescriptor> => {
  const errorMessages: Array<MessageDescriptor> = [];

  if (isMissingLookingForBilingual(user, pool))
    errorMessages.push({
      defaultMessage: "Bilingual positions (English and French)",
      id: "6eCvv1",
      description: "Bilingual Positions message",
    });

  return errorMessages;
};
