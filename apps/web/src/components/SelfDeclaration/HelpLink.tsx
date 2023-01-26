import React from "react";
import { useIntl } from "react-intl";

const contactLink = (chunks: React.ReactNode) => (
  <a
    data-h2-color="base(primary)"
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
          id: "YZ/ZhG",
          defaultMessage:
            "If you are unsure about providing your information, or if you have any questions regarding the IT Apprenticeship Program for Indigenous Peoples, please <link>contact us</link> and we would be happy to meet with you.",
          description:
            "Text describing where to get help with the self-declaration form",
        },
        {
          link: contactLink,
        },
      )}
    </p>
  );
};

export default HelpLink;
