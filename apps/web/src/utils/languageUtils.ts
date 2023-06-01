import { MessageDescriptor } from "react-intl";

import { Applicant, Pool, PoolLanguage } from "@gc-digital-talent/graphql";

// Is the user missing the "looking for bilingual" profile option for this bilingual pool?
export const isMissingLookingForBilingual = (
  applicant?: Applicant,
  pool?: Pool | null,
): boolean => {
  const userLookingForBilingual = !!applicant?.lookingForBilingual;
  const poolNeedsBilingual =
    pool?.language === PoolLanguage.BilingualIntermediate ||
    pool?.language === PoolLanguage.BilingualAdvanced;

  if (poolNeedsBilingual && !userLookingForBilingual) return true;

  return false;
};

// Get a list of missing language requirement error message descriptors
export const getMissingLanguageRequirements = (
  applicant?: Applicant,
  pool?: Pool | null,
): Array<MessageDescriptor> => {
  const errorMessages: Array<MessageDescriptor> = [];

  if (isMissingLookingForBilingual(applicant, pool))
    errorMessages.push({
      defaultMessage: "Bilingual positions (English and French)",
      id: "Mu+1pI",
      description: "Message for the bilingual positions option",
    });

  return errorMessages;
};

export default {
  isMissingLookingForBilingual,
  isMissingLanguageRequirements: getMissingLanguageRequirements,
};
