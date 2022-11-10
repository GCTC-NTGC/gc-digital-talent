import { IntlShape } from "react-intl";
import { getPoolStream } from "../constants/localizedConstants";
import { Maybe, PoolStream, PoolAdvertisement } from "../api/generated";
import { getLocalizedName } from "./localize";

export interface formattedPoolPosterTitleProps {
  title: Maybe<string>;
  classification: Maybe<string>;
  stream: Maybe<PoolStream>;
  intl: IntlShape;
}

export const formattedPoolPosterTitle = ({
  title,
  classification,
  stream,
  intl,
}: formattedPoolPosterTitleProps): string => {
  const streamString = stream
    ? `${intl.formatMessage(getPoolStream(stream))}`
    : "";
  const genericTitle = `${classification ?? ""} ${streamString}`.trim();
  return `${title ? `${title}` : ""}${
    genericTitle ? ` (${genericTitle})` : "" // Wrap genericTitle in parentheses if it exists
  }`.trim();
};

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

export const transformPoolToPosterTitle = (
  intl: IntlShape,
  pool: Pick<PoolAdvertisement, "name" | "classifications" | "stream">,
  defaultTitle = "", // allow a fallback if name, classifications and stream are all empty
): string => {
  const formattedTitle = formattedPoolPosterTitle({
    title: getLocalizedName(pool.name, intl),
    classification: pool?.classifications?.[0] // TODO: If a pool has multiple classifications, only the first will be shown.
      ? formatClassificationString(pool?.classifications?.[0])
      : null,
    stream: pool.stream,
    intl,
  });
  return formattedTitle || defaultTitle;
};

export const getFullPoolAdvertisementTitle = (
  intl: IntlShape,
  poolAdvertisement: Maybe<PoolAdvertisement>,
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
  const genericTitle = getLocalizedName(poolAdvertisement.name, intl);

  return `${genericTitle ? `${genericTitle} ` : ""}(${classificationSuffix}${
    poolAdvertisement.stream
      ? ` ${intl.formatMessage(getPoolStream(poolAdvertisement.stream))}`
      : ""
  })`;
};
