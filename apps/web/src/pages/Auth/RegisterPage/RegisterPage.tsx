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
    ? paths.dashboard()
    : paths.myProfile();
  const loginPath = apiPaths.login(fromPath ?? fallbackPath, getLocale(intl));

  const seoTitle = intl.formatMessage({
    defaultMessage: "Register using GCKey",
    id: "yxx7np",
    description: "SEO title for the registration page for applicant profiles",
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Register using GCKey",
    id: "vZntuH",
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
      <SEO title={seoTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-container="base(center, small, x1) p-tablet(center, small, x2)">
          {!iapMode ? (
            <>
              {/* Standard copy */}
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "You can log into your GC Digital Talent profile using your existing GCKey, even if you've never used this platform before.",
                  id: "NcB+TT",
                  description: "Instructions on how to login with GCKey",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "If you're unsure whether you have an existing GCKey account, continue to the website and try logging in. If you can't remember your password, you can also reset it there.",
                  id: "NuGNEF",
                  description:
                    "Instructions on what to do if user doesn't know if they have a GCKey",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "<strong>Don't have a GCKey account?</strong> <a>Register for one</a>.",
                    id: "q53yRm",
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
                    "In order to get started on your profile with the IT Indigenous Apprenticeship Program, you <strong>first have to register for the platform using GCKey</strong>.",
                  id: "LVPNZ3",
                  description:
                    "Instructions on how to register with GCKey - IAP variant",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "GCKey is a service that allows you to log into <a>many different government services</a> with a single username and password. The button below will take you to GCKey’s website, where you’ll be able to create an account if you don’t already have one. Once you’ve registered for GCKey, you’ll be brought back here to complete your profile.",
                    id: "cPgH94",
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
                      "<strong>Already have a GCKey account?</strong> <a>Login instead</a>.",
                    id: "xfYpNf",
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
                  defaultMessage: "Log in instead",
                  id: "rUFZwt",
                  description: "Login link text on the registration page.",
                })}
              </Link>
            </p>
            <p>
              <Link href={loginPath} mode="solid" color="primary" external>
                {intl.formatMessage({
                  defaultMessage: "Continue to GCKey and Register",
                  id: "vNvh0G",
                  description:
                    "GCKey registration link text on the registration page",
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
