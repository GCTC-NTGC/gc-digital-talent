import React from "react";
import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";

const HomePage = () => {
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Managers community",
    id: "Izo/vB",
    description: "Page title for the managers homepage",
  });

  return <SEO title={pageTitle} />;
};

export default HomePage;
