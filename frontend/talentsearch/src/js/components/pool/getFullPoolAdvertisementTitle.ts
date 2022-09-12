import { getLocalizedName } from "@common/helpers/localize";
import type { IntlShape } from "react-intl";
import { Maybe, PoolAdvertisement } from "../../api/generated";

const getFullPoolAdvertisementTitle = (
  intl: IntlShape,
  advertisement: Maybe<PoolAdvertisement>,
): string => {
  if (advertisement === null || advertisement === undefined)
    return intl.formatMessage({
      id: "D91nGW",
      defaultMessage: "Job title not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

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
