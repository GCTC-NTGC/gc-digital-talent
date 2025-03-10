import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router";
import { ReactNode } from "react";

import { richTextElements } from "@gc-digital-talent/i18n";

interface ProvidersProps {
  children: ReactNode;
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
