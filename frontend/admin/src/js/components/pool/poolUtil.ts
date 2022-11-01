import { getPoolStream } from "@common/constants/localizedConstants";
import { IntlShape } from "react-intl";
import { Maybe, PoolStream } from "../../api/generated";

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
