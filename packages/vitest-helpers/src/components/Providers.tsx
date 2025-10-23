import { HelmetProvider } from "react-helmet-async";
import { IntlProvider, IntlConfig } from "react-intl";
import { BrowserRouter } from "react-router";
import { ReactNode } from "react";

const defaultRichTextElements = {
  strong: vi.fn(),
  hidden: vi.fn(),
  heavyPrimary: vi.fn(),
  primary: vi.fn(),
  heavySecondary: vi.fn(),
  secondary: vi.fn(),
  red: vi.fn(),
  heavyRed: vi.fn(),
  warning: vi.fn(),
  heavyWarning: vi.fn(),
  gray: vi.fn(),
  underline: vi.fn(),
  emphasize: vi.fn(),
  softHyphen: vi.fn(),
  cite: vi.fn(),
  italic: vi.fn(),
};

interface ProvidersProps {
  children: ReactNode;
  richTextElements?: IntlConfig["defaultRichTextElements"];
}

const Providers = ({ children, richTextElements }: ProvidersProps) => {
  window.history.pushState({}, "Test page", "/");

  return (
    <HelmetProvider>
      <IntlProvider
        locale="en"
        defaultRichTextElements={{
          ...defaultRichTextElements,
          ...richTextElements,
        }}
      >
        <BrowserRouter>{children}</BrowserRouter>
      </IntlProvider>
    </HelmetProvider>
  );
};

export default Providers;
