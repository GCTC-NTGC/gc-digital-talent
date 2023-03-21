import React from "react";
import { HelmetProvider } from "react-helmet-async";

import { AppInsightsProvider } from "@gc-digital-talent/app-insights";
import {
  AuthenticationProvider,
  AuthorizationProvider,
} from "@gc-digital-talent/auth";
import ClientProvider from "@gc-digital-talent/client";
import {
  LanguageProvider,
  LocaleProvider,
  Messages,
} from "@gc-digital-talent/i18n";

// Note: Commented out until we have dark mode styles properly implemented
import { ThemeProvider } from "@gc-digital-talent/theme";

export interface ContextContainerProps {
  messages: Messages;
  children: React.ReactNode;
}

const ContextContainer = ({ messages, children }: ContextContainerProps) => (
  <HelmetProvider>
    <LocaleProvider>
      <AuthenticationProvider>
        <LanguageProvider messages={messages}>
          <ThemeProvider>
            <ClientProvider>
              <AppInsightsProvider>
                <AuthorizationProvider>{children}</AuthorizationProvider>
              </AppInsightsProvider>
            </ClientProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthenticationProvider>
    </LocaleProvider>
  </HelmetProvider>
);

export default ContextContainer;
