import React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import { Link, ExternalLink } from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { wrapAbbr } from "~/utils/nameUtils";

const keyRegistrationLink = (path: string, chunks: React.ReactNode) => (
  <a href={path}>{chunks}</a>
);

const LoginPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const { applicantDashboard } = useFeatureFlags();
  const [searchParams] = useSearchParams();
  const fallbackPath = applicantDashboard
    ? paths.dashboard()
    : paths.myProfile();
  const loginPath = apiPaths.login(
    searchParams.get("from") ?? fallbackPath,
    getLocale(intl),
  );

  const abbreviation = (text: React.ReactNode) => wrapAbbr(text, intl);

  const seoTitle = intl.formatMessage({
    defaultMessage: "Login using GC Key",
    id: "4RXJ4p",
    description: "Seo title for the login page for applicant profiles.",
  });

  const pageTitle = intl.formatMessage(
    {
      defaultMessage: "Login using <abbreviation>GC</abbreviation> Key",
      id: "iNFweP",
      description: "Page title for the login page for applicant profiles.",
    },
    {
      abbreviation,
    },
  );

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.login(),
    },
  ]);

  return (
    <>
      <SEO title={seoTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <div data-h2-padding="base(x3, 0)">
        <div data-h2-container="base(center, small, x1) p-tablet(center, small, x2)">
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "You can log into your Digital Talent profile using your existing <abbreviation>GC</abbreviation> Key, even if you’ve never used this platform before.",
                id: "lgsXDg",
                description: "Instructions on how to login with GC Key.",
              },
              {
                abbreviation,
              },
            )}
          </p>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "If you’re unsure whether you have an existing <abbreviation>GC</abbreviation> Key account, continue to the website and try logging in. If you can’t remember your password, you can also reset it there.",
                id: "kJdLk3",
                description:
                  "Instructions on what to do if user doesn't know if they have a GC Key",
              },
              {
                abbreviation,
              },
            )}
          </p>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "<strong>Don't have a <abbreviation>GC</abbreviation> Key account?</strong> <a>Register for one.</a>",
                id: "veXICB",
                description:
                  "Instruction on what to do if user does not have a GC Key.",
              },
              {
                a: (chunks: React.ReactNode) =>
                  keyRegistrationLink(loginPath, chunks),
                abbreviation,
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
              <Link
                href={paths.home()}
                mode="inline"
                color="secondary"
                type="button"
              >
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  id: "OT0QP3",
                  description:
                    "Link text to cancel logging in and return to talent search home.",
                })}
              </Link>
            </p>
            <p>
              <ExternalLink
                href={loginPath}
                mode="solid"
                type="button"
                color="primary"
              >
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Continue to <abbreviation>GC</abbreviation> Key and Login",
                    id: "78J7jF",
                    description: "GC Key login link text on the login page.",
                  },
                  {
                    abbreviation,
                  },
                )}
              </ExternalLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
