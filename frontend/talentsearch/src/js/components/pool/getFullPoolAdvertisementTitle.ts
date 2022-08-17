import { getLocalizedName } from "@common/helpers/localize";
import type { IntlShape } from "react-intl";
import { PoolAdvertisement } from "../../api/generated";

const getFullPoolAdvertisementTitle = (
  intl: IntlShape,
  advertisement: PoolAdvertisement,
): string => {
  const classification = advertisement.classifications
    ? advertisement.classifications[0]
    : null;
  const genericTitle = classification?.genericJobTitles?.length
    ? classification.genericJobTitles[0]
    : null;
  const localizedClassificationName = getLocalizedName(
    classification?.name,
    intl,
  );
  const classificationSuffix = `${classification?.group}-0${classification?.level}`;
  const localizedTitle = getLocalizedName(genericTitle?.name, intl);
  return `${localizedClassificationName} ${localizedTitle} (${classificationSuffix})`;
};

export default getFullPoolAdvertisementTitle;
