import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { Link } from "@gc-digital-talent/ui";
import { getLocale, useLocale } from "@gc-digital-talent/i18n";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { useTheme } from "@gc-digital-talent/theme";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero/Hero";

const buildExternalLink = (path: string, chunks: React.ReactNode) => (
  <Link external href={path}>
    {chunks}
  </Link>
);

const RegisterPage = () => {
  const intl = useIntl();
  const localeState = useLocale();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const { applicantDashboard } = useFeatureFlags();
  const [searchParams] = useSearchParams();
  const { key: themeKey, setKey: setThemeKey } = useTheme();
  const fromPath = searchParams.get("from");
  const iapMode =
    fromPath === paths.iap() || searchParams.get("personality") === "iap";
  const fallbackPath = applicantDashboard
    ? paths.profileAndApplications()
    : paths.myProfile();
  const loginPath = apiPaths.login(fromPath ?? fallbackPath, getLocale(intl));

  const pageTitle = intl.formatMessage({
    defaultMessage: "Sign up using GCKey",
    id: "e8SFXx",
    description: "Page title for the registration page for applicant profiles",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.register(),
    },
  ]);

  useEffect(() => {
    if (iapMode && themeKey !== "iap") {
      setThemeKey("iap");
    }
  }, [iapMode, themeKey, setThemeKey]);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-container="base(center, small, x1) p-tablet(center, small, x2)">
          {!iapMode ? (
            <>
              {/* Standard copy */}
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "You can sign into your GC Digital Talent profile using your existing GCKey, even if you've never used this platform before.",
                  id: "2G3YI3",
                  description: "Instructions on how to sign in with GCKey",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "If you're unsure whether you have an existing GCKey account, continue to the website and try signing in. If you can't remember your password, you can also reset it there.",
                  id: "8diKHR",
                  description:
                    "Instructions on what to do if user doesn't know if they have a GCKey",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "<strong>Don't have a GCKey account?</strong> <a>Sign up for one</a>.",
                    id: "QsWizb",
                    description:
                      "Instruction on what to do if user does not have a GCKey",
                  },
                  {
                    a: (chunks: React.ReactNode) =>
                      buildExternalLink(loginPath, chunks),
                  },
                )}
              </p>
            </>
          ) : (
            <>
              {/* IAP copy */}
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "In order to get started on your profile with the IT Apprenticeship Program for Indigenous Peoples, you <strong>first have to sign up for the platform using GCKey</strong>.",
                  id: "6TKE1K",
                  description:
                    "Instructions on how to register with GCKey - IAP variant",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "GCKey is a service that allows you to sign into <a>many different government services</a> with a single username and password. The button below will take you to GCKey's website, where you'll be able to create an account if you don't already have one. Once you've signed up for GCKey, you'll be brought back here to complete your profile.",
                    id: "B/xPdU",
                    description:
                      "Instructions on how to register with GCKey paragraph 2- IAP variant",
                  },
                  {
                    a: (chunks: React.ReactNode) =>
                      buildExternalLink(
                        localeState.locale === "en"
                          ? "https://clegc-gckey.gc.ca/j/eng/ES-01?ReqID=s232921cb5fd612440c0bcab640d5432d02168eb26"
                          : "https://clegc-gckey.gc.ca/j/fra/ES-01?ReqID=s232921cb5fd612440c0bcab640d5432d02168eb26",
                        chunks,
                      ),
                  },
                )}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "<strong>Already have a GCKey account?</strong> <a>Sign in instead</a>.",
                    id: "7CtKdX",
                    description:
                      "Instruction on what to do if user already has a GCKey",
                  },
                  {
                    a: (chunks: React.ReactNode) =>
                      buildExternalLink(loginPath, chunks),
                  },
                )}
              </p>
              <p data-h2-margin="base(x1, 0, 0, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Heads up!</strong> Before we send you off to set up your GCKey credentials, we ask that you take another look at the program's eligibility criteria to ensure that you meet the requirements.",
                  id: "ow71P8",
                  description:
                    "A request for the user to review the IAP eligibility criteria",
                })}
              </p>
              <p data-h2-margin="base(x2, 0, 0, 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "If you have questions concerning this step, or if you are unsure about how to proceed, please feel free to reach out to our support team at <a>edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</a>.",
                    id: "ltzA7w",
                    description:
                      "How to get help from the support team - IAP variant",
                  },
                  {
                    a: (chunks: React.ReactNode) =>
                      buildExternalLink(
                        "mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca",
                        chunks,
                      ),
                  },
                )}
              </p>
            </>
          )}

          <hr data-h2-margin="base(x2, 0)" />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) l-tablet(row)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(space-between)"
          >
            <p>
              <Link href={loginPath} mode="inline" external>
                {intl.formatMessage({
                  defaultMessage: "Sign in instead",
                  id: "Ovlh3a",
                  description: "Sign in link text on the registration page.",
                })}
              </Link>
            </p>
            <p>
              <Link href={loginPath} mode="solid" color="primary" external>
                {intl.formatMessage({
                  defaultMessage: "Continue to GCKey and sign up",
                  id: "Nd1bIG",
                  description: "GCKey sign up link text on the sign up page",
                })}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
