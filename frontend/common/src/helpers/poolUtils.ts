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

export const getFullPoolAdvertisementTitle = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): string => {
  const fallbackTitle =
    options?.defaultTitle ??
    intl.formatMessage({
      id: "D91nGW",
      defaultMessage: "Job title not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

  if (poolAdvertisement === null || poolAdvertisement === undefined)
    return fallbackTitle;

  const formattedClassification = poolAdvertisement?.classifications?.[0] // TODO: If a pool has multiple classifications, only the first will be shown.
    ? formatClassificationString(poolAdvertisement?.classifications?.[0])
    : null;

  const specificTitle = getLocalizedName(poolAdvertisement.name, intl);

  const formattedTitle = formattedPoolPosterTitle({
    title: specificTitle,
    classification: formattedClassification,
    stream: poolAdvertisement.stream,
    intl,
  });
  return formattedTitle ?? fallbackTitle;
};
