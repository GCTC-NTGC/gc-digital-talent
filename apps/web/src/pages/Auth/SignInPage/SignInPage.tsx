import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { Link } from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { useTheme } from "@gc-digital-talent/theme";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

const buildExternalLink = (path: string, chunks: React.ReactNode) => (
  <Link external href={path}>
    {chunks}
  </Link>
);

const SignInPage = () => {
  const intl = useIntl();
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
    defaultMessage: "Sign in using GCKey",
    id: "vkAhEM",
    description: "Page title for the sign in page for applicant profiles",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.login(),
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
                    "You can log into your IT Apprenticeship Program for Indigenous Peoples profile using your existing GCKey, even if you've never used this platform before.",
                  id: "0UeJoO",
                  description:
                    "Instructions on how to sign in with GCKey - IAP variant",
                })}
              </p>
              <p data-h2-margin="base(x.5, 0, 0, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "If you're unsure of whether you have an existing GCKey account, continue to the website and try signing in. If you can't remember your password, you can also reset it there.",
                  id: "Z+gi2d",
                  description:
                    "Instructions on what to do if user doesn't know if they have a GCKey - IAP variant",
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
              <Link href={!iapMode ? paths.home() : paths.iap()} mode="inline">
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  id: "OT0QP3",
                  description:
                    "Link text to cancel logging in and return to talent search home.",
                })}
              </Link>
            </p>
            <p>
              <Link href={loginPath} mode="solid" color="primary" external>
                {intl.formatMessage({
                  defaultMessage: "Continue to GCKey and sign in",
                  id: "4sLCWZ",
                  description: "GCKey sign in link text on the sign in page",
                })}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
