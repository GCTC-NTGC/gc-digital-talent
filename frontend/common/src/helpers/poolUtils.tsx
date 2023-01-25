import React from "react";
import { IntlShape } from "react-intl";
import { getPoolStream } from "../constants/localizedConstants";
import {
  Maybe,
  PoolStream,
  PoolAdvertisement,
  Classification,
} from "../api/generated";
import { getLocalizedName } from "./localize";
import { getClassificationAbbvHtml } from "./nameUtils";

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

export interface formattedPoolPosterTitleProps {
  title: Maybe<string>;
  classification: Maybe<Classification>;
  stream: Maybe<PoolStream>;
  intl: IntlShape;
}

export const formattedPoolPosterTitle = ({
  title,
  classification,
  stream,
  intl,
}: formattedPoolPosterTitleProps): {
  html: React.ReactNode;
  label: string;
  ariaLabel: string;
} => {
  const streamString = stream
    ? `${intl.formatMessage(getPoolStream(stream))}`
    : "";

  const genericTitle = `${
    classification ? formatClassificationString(classification) : null ?? ""
  } ${streamString}`.trim();

  const genericTitleAria = `${
    classification
      ? `${classification.group.split("").join(" ")} ${classification.level}`
      : null ?? ""
  } ${streamString}`.trim();

  return {
    html: (
      <>
        {`${title ? `${title}` : ""}`} (
        {getClassificationAbbvHtml(
          intl,
          getLocalizedName(classification?.name, intl),
          classification?.group,
          classification?.level,
        )}{" "}
        {streamString ? ` ${streamString}` : ""})
      </>
    ),
    label: `${title ? `${title}` : ""} ${
      genericTitle ? ` (${genericTitle})` : ""
    }`.trim(),
    ariaLabel: `${title ? `${title}` : ""} ${
      genericTitleAria ? ` (${genericTitleAria})` : ""
    }`.trim(),
  };
};

export const fullPoolAdvertisementTitle = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): { html: React.ReactNode; label: string; ariaLabel: string } => {
  const fallbackTitle =
    options?.defaultTitle ??
    intl.formatMessage({
      id: "D91nGW",
      defaultMessage: "Job title not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

  if (poolAdvertisement === null || poolAdvertisement === undefined)
    return {
      html: fallbackTitle,
      label: fallbackTitle,
      ariaLabel: fallbackTitle,
    };

  const specificTitle = getLocalizedName(poolAdvertisement.name, intl);

  const formattedTitle = formattedPoolPosterTitle({
    title: specificTitle,
    classification: poolAdvertisement?.classifications?.[0],
    stream: poolAdvertisement.stream,
    intl,
  });

  return {
    html: formattedTitle.html ?? fallbackTitle,
    label: formattedTitle.label ?? fallbackTitle,
    ariaLabel: formattedTitle.ariaLabel ?? fallbackTitle,
  };
};

export const getFullPoolAdvertisementTitleHtml = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): React.ReactNode =>
  fullPoolAdvertisementTitle(intl, poolAdvertisement, options).html;

export const getFullPoolAdvertisementTitleLabel = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): string => fullPoolAdvertisementTitle(intl, poolAdvertisement, options).label;

export const getFullPoolAdvertisementTitleAriaLabel = (
  intl: IntlShape,
  poolAdvertisement: Maybe<
    Pick<PoolAdvertisement, "name" | "classifications" | "stream">
  >,
  options?: { defaultTitle?: string },
): string =>
  fullPoolAdvertisementTitle(intl, poolAdvertisement, options).ariaLabel;
