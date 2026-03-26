import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { MotionConfig, LazyMotion, domAnimation } from "motion/react";
import { ReactNode } from "react";
import ReactDOM from "react-dom";

import { AppInsightsProvider } from "@gc-digital-talent/app-insights";
import {
  AuthenticationProvider,
  AuthorizationProvider,
} from "@gc-digital-talent/auth";
import ClientProvider from "@gc-digital-talent/client";
import { FeatureFlagProvider } from "@gc-digital-talent/env";
import { LanguageProvider } from "@gc-digital-talent/i18n";
import { Announcer } from "@gc-digital-talent/ui";
import { ThemeProvider } from "@gc-digital-talent/theme";
import Toast from "@gc-digital-talent/toast";

import frMessages from "~/lang/frCompiled.json";

import NavContextProvider from "../NavContext/NavContextProvider";

const ToastPortal = () => ReactDOM.createPortal(<Toast />, document.body);

interface ContextContainerProps {
  children: ReactNode;
}

const ContextContainer = ({ children }: ContextContainerProps) => (
  <FeatureFlagProvider>
    <HelmetProvider>
      <AuthenticationProvider>
        <LanguageProvider messages={frMessages}>
          <ToastPortal />
          <ThemeProvider>
            <ClientProvider>
              <AppInsightsProvider>
                <AuthorizationProvider>
                  <NavContextProvider>
                    <LazyMotion features={domAnimation}>
                      <MotionConfig reducedMotion="user">
                        <Announcer>{children}</Announcer>
                      </MotionConfig>
                    </LazyMotion>
                  </NavContextProvider>
                </AuthorizationProvider>
              </AppInsightsProvider>
            </ClientProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthenticationProvider>
    </HelmetProvider>
  </FeatureFlagProvider>
);

export default ContextContainer;
