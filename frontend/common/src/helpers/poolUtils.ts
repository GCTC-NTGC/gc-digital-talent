import { IntlShape } from "react-intl";
import { getPoolStream } from "../constants/localizedConstants";
import { Maybe, PoolAdvertisement, PoolStream } from "../api/generated";
import { getLocalizedName } from "./localize";

export interface formattedPoolPosterTitleProps {
  title: Maybe<string>;
  classification: string;
  stream: PoolStream | null;
  intl: IntlShape;
}

export const formattedPoolPosterTitle = ({
  title,
  classification,
  stream,
  intl,
}: formattedPoolPosterTitleProps): string => {
  return `${title ? `${title} ` : ""}(${classification}${
    stream ? ` ${intl.formatMessage(getPoolStream(stream))}` : ""
  })`;
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

export interface getFullPoolAdvertisementTitleProps {
  intl: IntlShape;
  advertisement: Maybe<PoolAdvertisement>;
}

export const getFullPoolAdvertisementTitle = ({
  intl,
  advertisement,
}: getFullPoolAdvertisementTitleProps): string => {
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

  let classificationSuffix = ""; // type wrangling the complex type into a string
  if (classification) {
    classificationSuffix = formatClassificationString({
      group: classification?.group,
      level: classification?.level,
    });
  }
  const genericTitle = getLocalizedName(advertisement.name, intl);

  return `${genericTitle ? `${genericTitle} ` : ""}(${classificationSuffix}${
    advertisement.stream
      ? ` ${intl.formatMessage(getPoolStream(advertisement.stream))}`
      : ""
  })`;
};
