import React from "react";
import { useIntl } from "react-intl";
import { getITAbbrHtml } from "~/../../../frontend/common/src/helpers/nameUtils";

const contactLink = (chunks: React.ReactNode) => (
  <a
    data-h2-color="base(ia-primary)"
    href="mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca"
  >
    {chunks}
  </a>
);

const HelpLink = () => {
  const intl = useIntl();
  return (
    <p>
      {intl.formatMessage(
        {
          id: "UQiCgi",
          defaultMessage:
            "If you are unsure about providing your information, or if you have any questions regarding the {ITAbbr} Apprenticeship Program for Indigenous Peoples, please <link>contact us</link> and we would be happy to meet with you.",
          description:
            "Text describing where to get help with the self-declaration form",
        },
        {
          link: contactLink,
          ITAbbr: getITAbbrHtml(intl),
        },
      )}
    </p>
  );
};

export default HelpLink;
