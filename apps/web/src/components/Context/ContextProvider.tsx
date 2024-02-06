import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";

import { AppInsightsProvider } from "@gc-digital-talent/app-insights";
import {
  AuthenticationProvider,
  AuthorizationProvider,
} from "@gc-digital-talent/auth";
import ClientProvider from "@gc-digital-talent/client";
import { FeatureFlagProvider } from "@gc-digital-talent/env";
import {
  LanguageProvider,
  LocaleProvider,
  Messages,
} from "@gc-digital-talent/i18n";
import { Announcer } from "@gc-digital-talent/ui";
import { ThemeProvider } from "@gc-digital-talent/theme";
import Toast from "@gc-digital-talent/toast";

interface ContextContainerProps {
  messages: Messages;
  children: React.ReactNode;
}

const ContextContainer = ({ messages, children }: ContextContainerProps) => (
  <FeatureFlagProvider>
    <HelmetProvider>
      <LocaleProvider>
        <AuthenticationProvider>
          <LanguageProvider messages={messages}>
            <Toast />
            <ThemeProvider>
              <ClientProvider>
                <AppInsightsProvider>
                  <AuthorizationProvider>
                    <MotionConfig reducedMotion="user">
                      <Announcer>{children}</Announcer>
                    </MotionConfig>
                  </AuthorizationProvider>
                </AppInsightsProvider>
              </ClientProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthenticationProvider>
      </LocaleProvider>
    </HelmetProvider>
  </FeatureFlagProvider>
);

export default ContextContainer;
