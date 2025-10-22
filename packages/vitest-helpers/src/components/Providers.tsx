import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router";
import { ReactNode } from "react";
import { vi } from "vitest";

const richTextElements = {
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
