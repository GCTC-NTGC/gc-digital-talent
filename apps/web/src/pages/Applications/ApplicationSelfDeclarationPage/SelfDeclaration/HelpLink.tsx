import React from "react";
import { useIntl } from "react-intl";

import { Link } from "@gc-digital-talent/ui";

import { wrapAbbr } from "~/utils/nameUtils";

const contactLink = (chunks: React.ReactNode) => (
  <Link
    color="secondary"
    external
    href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca"
  >
    {chunks}
  </Link>
);

const HelpLink = () => {
  const intl = useIntl();
  return (
    <p>
      {intl.formatMessage(
        {
          id: "pIiisf",
          defaultMessage:
            "If you are unsure about providing your information, or if you have any questions regarding the <abbreviation>IT</abbreviation> Apprenticeship Program for Indigenous Peoples, please <link>contact us</link> and we would be happy to meet with you.",
          description:
            "Text describing where to get help with the self-declaration form",
        },
        {
          link: contactLink,
          abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
        },
      )}
    </p>
  );
};

export default HelpLink;
