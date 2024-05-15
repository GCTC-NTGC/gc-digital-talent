import * as React from "react";
import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { richTextElements } from "@gc-digital-talent/i18n";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  window.history.pushState({}, "Test page", "/");

  return (
    <HelmetProvider>
      <IntlProvider locale="en" defaultRichTextElements={richTextElements}>
        <BrowserRouter>{children}</BrowserRouter>
      </IntlProvider>
    </HelmetProvider>
  );
};

export default Providers;
