import React from "react";
import { IntlShape } from "react-intl";

import { CardFlatProps, ExternalLinkProps } from "@gc-digital-talent/ui";

interface GetFormLinkArgs {
  formName: React.ReactNode;
  files: { en: string; fr: string };
  intl: IntlShape;
}

/**
 * Gets English and French form link props and reverses
 * them so the active language is the first item
 * in an array and injects form name in the link as hidden
 * text
 *
 * @returns CardFlatProps["links"] A tuple of the link props
 */
export const getFormLinks = ({
  formName,
  files,
  intl,
}: GetFormLinkArgs): CardFlatProps["links"] => {
  const links: CardFlatProps["links"] = [
    {
      label: intl.formatMessage(
        {
          defaultMessage: "Download <hidden>{formName} </hidden>form (EN)",
          id: "YDJiAT",
          description: "Link text for an English form download",
        },
        { formName },
      ),
      href: files.en,
      mode: intl.locale === "en" ? "solid" : "inline",
      "data-h2-padding": "base(x.5, x1)",
      download: true,
      external: true,
      naturalKey: `${formName}EN${files.en}`,
    },
    {
      label: intl.formatMessage(
        {
          defaultMessage: "Download <hidden>{formName} </hidden>form (FR)",
          id: "000m9d",
          description: "Link text for an French form download",
        },
        { formName },
      ),
      href: files.fr,
      mode: intl.locale === "en" ? "inline" : "solid",
      "data-h2-padding": "base(x.5, x1)",
      download: true,
      external: true,
      naturalKey: `${formName}FR${files.fr}`,
    },
  ];

  return intl.locale === "en" ? links : links.reverse();
};

interface GetGenericLinksArgs {
  labels: {
    en: React.ReactNode;
    fr: React.ReactNode;
  };
  files: { en: string; fr: string };
  intl: IntlShape;
}

// add a natural key since mocked files do not have unique hrefs
type GenericLinkType = ExternalLinkProps & { naturalKey?: string };

/**
 * Gets English and French link props and reverses
 * them so the active language is the first item
 * in an array
 *
 * @returns Array<ExternalLinkProps> A tuple of the link props
 */
export const getGenericLinks = ({
  labels,
  files,
  intl,
}: GetGenericLinksArgs) => {
  const links: Array<GenericLinkType> = [
    {
      children: labels.en,
      href: files.en,
      mode: intl.locale === "en" ? "solid" : "inline",
      "data-h2-padding": "base(x.5, x1)",
      download: true,
      naturalKey: `${labels.en}${files.en}`,
    },
    {
      children: labels.fr,
      href: files.fr,
      mode: intl.locale === "en" ? "inline" : "solid",
      "data-h2-padding": "base(x.5, x1)",
      download: true,
      naturalKey: `${labels.fr}${files.fr}`,
    },
  ];

  return intl.locale === "en" ? links : links.reverse();
};
