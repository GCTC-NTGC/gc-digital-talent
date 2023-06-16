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

const keyRegistrationLink = (path: string, chunks: React.ReactNode) => (
  <Link external href={path}>
    {chunks}
  </Link>
);

const LoginPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const { applicantDashboard } = useFeatureFlags();
  const [searchParams] = useSearchParams();
  const { key: themeKey, setKey: setThemeKey } = useTheme();
  const fromPath = searchParams.get("from");
  const isFromIap = fromPath === paths.iap();
  const fallbackPath = applicantDashboard
    ? paths.dashboard()
    : paths.myProfile();
  const loginPath = apiPaths.login(fromPath ?? fallbackPath, getLocale(intl));

  const seoTitle = intl.formatMessage({
    defaultMessage: "Login using GCKey",
    id: "VWU6bj",
    description: "SEO title for the login page for applicant profiles.",
  });

  const pageTitle = intl.formatMessage({
    defaultMessage: "Login using GCKey",
    id: "LVSun4",
    description: "Page title for the login page for applicant profiles",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.login(),
    },
  ]);

  useEffect(() => {
    if (isFromIap && themeKey !== "iap") {
      setThemeKey("iap");
    }
  }, [isFromIap, themeKey, setThemeKey]);

  return (
    <>
      <SEO title={seoTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-container="base(center, small, x1) p-tablet(center, small, x2)">
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
                  keyRegistrationLink(loginPath, chunks),
              },
            )}
          </p>
          <hr data-h2-margin="base(x2, 0)" />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) l-tablet(row)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(space-between)"
          >
            <p>
              <Link href={paths.home()} mode="inline">
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
                  defaultMessage: "Continue to GCKey and Login",
                  id: "eYcQ6h",
                  description: "GCKey login link text on the login page",
                })}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
