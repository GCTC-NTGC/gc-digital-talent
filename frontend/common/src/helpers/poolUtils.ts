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
    : null;
  const genericTitle = `${classification} ${streamString}`.trim();
  return `${title ? `${title} ` : ""}${
    genericTitle ? ` (${genericTitle})` : "" // Wrap genericTitle in parentheses if it exists
  }`;
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
  pool: Pick<PoolAdvertisement, "name" | "classifications" | "stream">,
  intl: IntlShape,
): string => {
  // TODO: If a pool has multiple classifications, only the first will be shown.
  return formattedPoolPosterTitle({
    title: getLocalizedName(pool.name, intl),
    classification: pool?.classifications?.[0]
      ? formatClassificationString(pool?.classifications?.[0])
      : null,
    stream: pool.stream,
    intl,
  });
};
