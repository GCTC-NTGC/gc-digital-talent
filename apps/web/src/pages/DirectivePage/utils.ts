import React from "react";
import { IntlShape } from "react-intl";

import { CardFlatProps } from "@gc-digital-talent/ui";

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

export default getFormLinks;
