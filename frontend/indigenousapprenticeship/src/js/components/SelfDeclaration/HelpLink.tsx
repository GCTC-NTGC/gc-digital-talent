import React from "react";
import { useIntl } from "react-intl";

import { ExternalLink } from "@common/components/Link";
import useLocale from "@common/hooks/useLocale";
import { Locales } from "@common/helpers/localize";

const contactLink = (chunks: React.ReactNode, locale: Locales) => (
  <ExternalLink data-h2-color="base(ia-primary)" href={`/${locale}/support`}>
    {chunks}
  </ExternalLink>
);

const HelpLink = () => {
  const intl = useIntl();
  const { locale } = useLocale();
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
          link: (chunks: React.ReactNode) => contactLink(chunks, locale),
        },
      )}
    </p>
  );
};

export default HelpLink;
