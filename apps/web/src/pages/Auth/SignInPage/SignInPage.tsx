import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import ArrowRightCircleIcon from "@heroicons/react/24/solid/ArrowRightCircleIcon";

import { Heading, Link } from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useTheme } from "@gc-digital-talent/theme";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import step1Image from "~/assets/img/sign-in-steps-1.jpg";
import step2Image from "~/assets/img/sign-in-steps-2.jpg";
import step3Image from "~/assets/img/sign-in-steps-3.jpg";
import step4Image from "~/assets/img/sign-in-steps-4.jpg";

const buildExternalLink = (path: string, chunks: React.ReactNode) => (
  <Link external href={path}>
    {chunks}
  </Link>
);

export interface StepProps {
  image: string;
  children: React.ReactNode;
}

const Step = ({ image, children }: StepProps) => {
  return (
    <div data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
      {image && <img src={image} alt="" />}
      <div
        data-h2-flex-grow="base(1)"
        data-h2-padding="base(x1)"
        data-h2-flex="base(1)"
      >
        {children}
      </div>
    </div>
  );
};

const SignInPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const [searchParams] = useSearchParams();
  const { key: themeKey, setKey: setThemeKey } = useTheme();
  const fromPath = searchParams.get("from");
  const iapMode =
    fromPath === paths.iap() || searchParams.get("personality") === "iap";
  const fallbackPath = paths.profileAndApplications();
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
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-margin-bottom="base(x1)"
      >
        {!iapMode ? (
          <>
            {/* Standard copy */}
            <Heading Icon={SparklesIcon} color="warning" level="h2">
              {intl.formatMessage({
                defaultMessage: "Welcome back",
                id: "db3ZDX",
                description:
                  "Heading at the top of the sign in page for applicant profiles",
              })}
            </Heading>
            <p data-h2-margin="base(x1, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Just a reminder you'll be leaving our site to sign in with GCKey. If anything goes wrong, we have prepared additional guidance for you.",
                id: "ci1JMn",
                description:
                  "Instructions on what to do if user doesn't know if they have a GCKey",
              })}
            </p>
            <Link href={loginPath} mode="solid" color="secondary" external>
              {intl.formatMessage({
                defaultMessage: "Continue to GCKey and sign in",
                id: "4sLCWZ",
                description: "GCKey sign in link text on the sign in page",
              })}
            </Link>
            <Heading Icon={ArrowLeftOnRectangleIcon} color="primary" level="h3">
              {intl.formatMessage({
                defaultMessage: "Signing in to your account",
                id: "Wnid+N",
                description:
                  "Heading for section of the sign in page showing the sign in steps",
              })}
            </Heading>
            <h4 data-h2-margin="base(x1, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Steps to signing in with GCKey and completing two-factor authentication",
                id: "QNMqSh",
                description: "Subtitle for a section explaining sign in steps",
              })}
            </h4>
            <ol data-h2-flex-grid="base(flex-start, x2, x2)">
              <li data-h2-flex-item="base(1of2) p-tablet(1of4)">
                <Step image={step1Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Sign in with your username and password. Remember, <strong>your username is separate from your email address</strong>.",
                    id: "LIiJJ1",
                    description: "Text for first sign in step.",
                  })}
                </Step>
              </li>
              <li data-h2-flex-item="base(1of2) p-tablet(1of4)">
                <Step image={step2Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "<strong>Open the authenticator app</strong> on your device.",
                    id: "YrJFSw",
                    description: "Text for second sign in step.",
                  })}
                </Step>
              </li>
              <li data-h2-flex-item="base(1of2) p-tablet(1of4)">
                <Step image={step3Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Enter your <strong>unique one-time six-digit code</strong> from your <strong>authenticator app</strong> into the verification bar.",
                    id: "sQepi4",
                    description: "Text for third sign in step.",
                  })}
                </Step>
              </li>
              <li data-h2-flex-item="base(1of2) p-tablet(1of4)">
                <Step image={step4Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "Hooray! <strong>You've signed in with GCKey</strong> and will be returned to the <strong>GC Digital Talent platform</strong>.",
                    id: "TSZedg",
                    description: "Text for final sign in step.",
                  })}
                </Step>
              </li>
            </ol>
            <Heading Icon={InformationCircleIcon} color="error" level="h3">
              {intl.formatMessage({
                defaultMessage: "Frequently Asked Questions (FAQs)",
                id: "AUtIo9",
                description:
                  "Heading for Frequently Asked Questions section on sign in page",
              })}
            </Heading>
          </>
        ) : (
          <>
            {/* IAP copy */}
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You can sign in to your IT Apprenticeship Program for Indigenous Peoples profile using your existing GCKey, even if you've never used this platform before.",
                id: "6SfJEp",
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
            <Link href={paths.register()} mode="inline">
              {intl.formatMessage({
                defaultMessage: "Sign up instead",
                id: "aqkSW2",
                description: "Link text to register instead of signing in",
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
    </>
  );
};

export default SignInPage;
