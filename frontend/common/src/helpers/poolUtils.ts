import { IntlShape } from "react-intl";
import { getPoolStream } from "../constants/localizedConstants";
import { Maybe, PoolAdvertisement } from "../api/generated";
import { getLocalizedName } from "./localize";

export interface formatClassificationStringProps {
  group: string;
  level: number;
}

export const formatClassificationString = ({
  group,
  level,
}: formatClassificationStringProps): string => {
  return `${group}-0${level}`;
};

export const getFullPoolAdvertisementTitle = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
): string => {
  if (poolAdvertisement === null || poolAdvertisement === undefined)
    return intl.formatMessage({
      id: "D91nGW",
      defaultMessage: "Job title not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

  const classification = poolAdvertisement.classifications
    ? poolAdvertisement.classifications[0]
    : null;

  let classificationSuffix = ""; // type wrangling the complex type into a string
  if (classification) {
    classificationSuffix = formatClassificationString({
      group: classification?.group,
      level: classification?.level,
    });
  }
  const specificTitle = getLocalizedName(poolAdvertisement.name, intl);

  return `${specificTitle ? `${specificTitle} ` : ""}(${classificationSuffix}${
    poolAdvertisement.stream
      ? ` ${intl.formatMessage(getPoolStream(poolAdvertisement.stream))}`
      : ""
  })`;
};
