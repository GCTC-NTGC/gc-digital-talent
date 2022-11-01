import { IntlShape } from "react-intl";
import { getPoolStream } from "../constants/localizedConstants";
import { Maybe, PoolStream } from "../api/generated";

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
