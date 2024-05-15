import * as React from "react";
import { IntlShape } from "react-intl";

import { CardFlatProps } from "@gc-digital-talent/ui";

interface GetFormLinkArgs {
  formName: React.ReactNode;
  files: { en: string; fr: string };
  intl: IntlShape;
}

/**
 * Gets English and French form link props
 * and injects form name in the link as hidden text
 *
 * @returns CardFlatProps["links"] A tuple of the link props
 */
const getFormLinks = ({
  formName,
  files,
  intl,
}: GetFormLinkArgs): CardFlatProps["links"] => {
  const links: CardFlatProps["links"] = [
    {
      label: intl.formatMessage(
        {
          defaultMessage: "Download <hidden>{formName} </hidden>form",
          id: "RA6v6+",
          description: "Link text for form download",
        },
        { formName },
      ),
      href: intl.locale === "en" ? files.en : files.fr,
      mode: "solid",
      "data-h2-padding": "base(x.5, x1)",
      download: true,
      external: true,
    },
  ];

  return links;
};

export default getFormLinks;
