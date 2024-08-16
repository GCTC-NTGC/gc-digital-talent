import { HelmetProvider } from "react-helmet-async";
import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";
import { ReactNode } from "react";

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

import NavProvider from "../Nav/NavProvider";

interface ContextContainerProps {
  messages: Messages;
  children: ReactNode;
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
                    <NavProvider>
                      <LazyMotion features={domAnimation}>
                        <MotionConfig reducedMotion="user">
                          <Announcer>{children}</Announcer>
                        </MotionConfig>
                      </LazyMotion>
                    </NavProvider>
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
