import React from "react";
import { IntlShape } from "react-intl";

import { CardFlatProps, ExternalLinkProps } from "@gc-digital-talent/ui";

interface GetFormLinkArgs {
  formName: React.ReactNode;
  files: { en: string; fr: string };
  intl: IntlShape;
}

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

export const getGenericLinks = ({
  labels,
  files,
  intl,
}: GetGenericLinksArgs) => {
  const links: Array<ExternalLinkProps> = [
    {
      children: labels.en,
      href: files.en,
      mode: intl.locale === "en" ? "solid" : "inline",
      "data-h2-padding": "base(x.5, x1)",
    },
    {
      children: labels.fr,
      href: files.fr,
      mode: intl.locale === "en" ? "inline" : "solid",
      "data-h2-padding": "base(x.5, x1)",
    },
  ];

  return intl.locale === "en" ? links : links.reverse();
};
