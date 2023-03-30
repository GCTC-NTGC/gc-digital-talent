import React, { ReactNode } from "react";
import { IntlShape } from "react-intl";

import { Locales } from "@gc-digital-talent/i18n";
import { CardFlatProps, CardLinkProps } from "@gc-digital-talent/ui";

interface GetFormLinkArgs {
  formName: React.ReactNode;
  files: { en: string; fr: string };
  intl: IntlShape;
}

const getFormLinks = ({
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
    },
  ];

  return intl.locale === "en" ? links : links.reverse();
};

export default getFormLinks;
