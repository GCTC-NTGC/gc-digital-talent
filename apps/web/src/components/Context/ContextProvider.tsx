import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";

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
import { Announcer } from "@gc-digital-talent/ui";
import { ThemeProvider } from "@gc-digital-talent/theme";

interface ContextContainerProps {
  messages: Messages;
  children: React.ReactNode;
}

const ContextContainer = ({ messages, children }: ContextContainerProps) => (
  <MotionConfig reducedMotion="user">
    <HelmetProvider>
      <LocaleProvider>
        <AuthenticationProvider>
          <LanguageProvider messages={messages}>
            <ThemeProvider>
              <ClientProvider>
                <AppInsightsProvider>
                  <AuthorizationProvider>
                    <Announcer>{children}</Announcer>
                  </AuthorizationProvider>
                </AppInsightsProvider>
              </ClientProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthenticationProvider>
      </LocaleProvider>
    </HelmetProvider>
  </MotionConfig>
);

export default ContextContainer;
