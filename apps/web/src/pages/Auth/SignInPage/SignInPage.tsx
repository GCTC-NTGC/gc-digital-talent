import { ReactNode, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import ArrowLeftEndOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftEndOnRectangleIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

import { appInsights } from "@gc-digital-talent/app-insights";
import {
  Accordion,
  Container,
  Heading,
  Link,
  Separator,
} from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useTheme } from "@gc-digital-talent/theme";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import step1Image from "~/assets/img/sign-in-step-1-light.webp";
import step2Image from "~/assets/img/sign-in-step-2-light.webp";
import step3Image from "~/assets/img/sign-in-step-3-light.webp";
import step4Image from "~/assets/img/sign-in-step-4-light.webp";
import step1ImageDark from "~/assets/img/sign-in-step-1-dark.webp";
import step2ImageDark from "~/assets/img/sign-in-step-2-dark.webp";
import step3ImageDark from "~/assets/img/sign-in-step-3-dark.webp";
import step4ImageDark from "~/assets/img/sign-in-step-4-dark.webp";
import Instructions from "~/components/Instructions";
import gckeyMessages from "~/messages/gckeyMessages";

const helpLink = (chunks: ReactNode, path: string) => (
  <Link href={path} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
);

const buildExternalLink = (path: string, chunks: ReactNode) => (
  <Link external href={path}>
    {chunks}
  </Link>
);

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const [searchParams] = useSearchParams();
  const { key: themeKey, setKey: setThemeKey } = useTheme();
  const fromPath = searchParams.get("from");
  const iapMode =
    fromPath === paths.iap() || searchParams.get("personality") === "iap";
  const fallbackPath = paths.applicantDashboard();
  const loginPath = apiPaths.login(fromPath ?? fallbackPath, getLocale(intl));

  const pageTitle = intl.formatMessage({
    defaultMessage: "Sign in using GCKey",
    id: "vkAhEM",
    description: "Page title for the sign in page for applicant profiles",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.login(),
      },
    ],
  });

  useEffect(() => {
    if (iapMode && themeKey !== "iap") {
      setThemeKey("iap");
    }
  }, [iapMode, themeKey, setThemeKey]);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <Container className="my-18">
        {!iapMode ? (
          <>
            {/* Standard copy */}
            <Heading
              icon={SparklesIcon}
              color="warning"
              level="h2"
              size="h3"
              className="mt-0 mb-6 font-normal"
            >
              {intl.formatMessage({
                defaultMessage: "Welcome back",
                id: "db3ZDX",
                description:
                  "Heading at the top of the sign in page for applicant profiles",
              })}
            </Heading>
            <p className="my-6">
              {intl.formatMessage({
                defaultMessage:
                  "Just a reminder you'll be leaving our site to sign in with GCKey. If anything goes wrong, we have prepared additional guidance for you.",
                id: "ci1JMn",
                description:
                  "Instructions on what to do if user doesn't know if they have a GCKey",
              })}
            </p>
            <Link
              href={loginPath}
              mode="solid"
              color="primary"
              external
              onClick={() => {
                if (appInsights) {
                  const userId = appInsights.context?.user?.id;
                  appInsights.trackEvent(
                    { name: "GCKey Login Initiated" },
                    {
                      aiUserId: userId,
                      pageUrl: window.location.href,
                      path: window.location.pathname,
                      timestamp: new Date().toISOString(),
                      userAgent: navigator.userAgent,
                      referrer: document.referrer || "none",
                      gcKeyStatus: "initiated",
                    },
                  );
                }
              }}
            >
              {intl.formatMessage({
                defaultMessage: "Continue to GCKey and sign in",
                id: "4sLCWZ",
                description: "GCKey sign in link text on the sign in page",
              })}
            </Link>
            <Heading
              icon={ArrowLeftEndOnRectangleIcon}
              color="secondary"
              level="h2"
              size="h3"
              className="mt-18 mb-6 font-normal"
            >
              {intl.formatMessage({
                defaultMessage: "Signing in to your account",
                id: "Wnid+N",
                description:
                  "Heading for section of the sign in page showing the sign in steps",
              })}
            </Heading>
            <Heading level="h3" size="h6" className="mt-12 mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage:
                  "Steps to signing in with GCKey and completing two-factor authentication",
                id: "QNMqSh",
                description: "Subtitle for a section explaining sign in steps",
              })}
            </Heading>
            <Instructions.List>
              <Instructions.Step
                img={{
                  src: step1Image,
                  darkSrc: step1ImageDark,
                }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "1. Sign in with your username and password. Remember, <strong>your username is separate from your email address</strong>.",
                  id: "oR+6vE",
                  description: "Text for first sign in step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                img={{
                  src: step2Image,
                  darkSrc: step2ImageDark,
                }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "2. <strong>Open the authenticator app</strong> on your device.",
                  id: "QuHfUJ",
                  description: "Text for second sign in step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                img={{
                  src: step3Image,
                  darkSrc: step3ImageDark,
                }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "3. Enter your <strong>unique one-time six-digit code</strong> from your <strong>authenticator app</strong> into the verification bar.",
                  id: "oacrTu",
                  description: "Text for third sign in step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                includeArrow={false}
                img={{
                  src: step4Image,
                  darkSrc: step4ImageDark,
                }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "4. Hooray! <strong>You've signed in with GCKey</strong> and will be returned to the <strong>GC Digital Talent platform</strong>.",
                  id: "eO9buR",
                  description: "Text for final sign in step.",
                })}
              </Instructions.Step>
            </Instructions.List>
            <Heading
              icon={InformationCircleIcon}
              color="error"
              level="h2"
              size="h3"
              className="mt-18 mb-6 font-normal"
            >
              {intl.formatMessage({
                defaultMessage: "Frequently Asked Questions (FAQs)",
                id: "AUtIo9",
                description:
                  "Heading for Frequently Asked Questions section on sign in page",
              })}
            </Heading>
            <Accordion.Root
              type="single"
              size="sm"
              mode="card"
              collapsible
              className="my-6"
            >
              <Accordion.Item value="one">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(gckeyMessages.questionRecoveryCodes)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerRecoveryCodes, {
                      helpLink: (chunks: ReactNode) =>
                        helpLink(chunks, paths.support()),
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="two">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(gckeyMessages.questionRemove2FA)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerRemove2FA, {
                      helpLink: (chunks: ReactNode) =>
                        helpLink(chunks, paths.support()),
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="three">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(gckeyMessages.questionAuthCodes)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerAuthCodes, {
                      helpLink: (chunks: ReactNode) =>
                        helpLink(chunks, paths.support()),
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="four">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(gckeyMessages.questionExistingAccount)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerExistingAccount)}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="five">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(gckeyMessages.questionWhatGCKey)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>{intl.formatMessage(gckeyMessages.answerWhatGCKey)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="six">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(gckeyMessages.questionContactGCkey)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerContactGCkey1)}
                  </p>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerContactGCkey2)}
                  </p>
                  <p className="mb-3">
                    <Link
                      color="black"
                      external
                      href="tel:1-855-438-1102"
                      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                      aria-label="1 8 5 5 4 3 8 1 1 0 2"
                      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                    >
                      1-855-438-1102
                    </Link>
                  </p>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerContactGCkey3)}
                  </p>
                  <p className="mb-3">
                    <Link
                      color="black"
                      external
                      href="tel:1-855-438-1103"
                      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                      aria-label="1 8 5 5 4 3 8 1 1 0 3"
                      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                    >
                      1-855-438-1103
                    </Link>
                  </p>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerContactGCkey4)}
                  </p>
                  <p className="mb-3">
                    <Link
                      color="black"
                      external
                      href="tel:1-800-2318-6290"
                      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                      aria-label="1 8 0 0 2 3 1 8 6 2 9 0"
                      // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                    >
                      1-800-2318-6290
                    </Link>
                  </p>
                  <p>{intl.formatMessage(gckeyMessages.answerContactGCkey5)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="seven">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(gckeyMessages.questionAuthApp)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>{intl.formatMessage(gckeyMessages.answerAuthApp)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="eight">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(gckeyMessages.questionAuthAlternative)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerAuthAlternative)}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            <p className="mt-6">
              {intl.formatMessage(gckeyMessages.moreQuestions, {
                helpLink: (chunks: ReactNode) =>
                  helpLink(chunks, paths.support()),
              })}
            </p>
          </>
        ) : (
          <>
            {/* IAP copy */}
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "You can sign in to your IT Apprenticeship Program for Indigenous Peoples profile using your existing GCKey, even if you've never used this platform before.",
                id: "6SfJEp",
                description:
                  "Instructions on how to sign in with GCKey - IAP variant",
              })}
            </p>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "If you're unsure of whether you have an existing GCKey account, continue to the website and try signing in. If you can't remember your password, you can also reset it there.",
                id: "Z+gi2d",
                description:
                  "Instructions on what to do if user doesn't know if they have a GCKey - IAP variant",
              })}
            </p>
            <p className="mb-3">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>Don't have a GCKey account?</strong> <a>Sign up for one</a>.",
                  id: "QsWizb",
                  description:
                    "Instruction on what to do if user does not have a GCKey",
                },
                {
                  a: (chunks: ReactNode) =>
                    buildExternalLink(loginPath, chunks),
                },
              )}
            </p>
            <p className="mb-12">
              {intl.formatMessage({
                defaultMessage:
                  "<strong>Heads up!</strong> Before we send you off to set up your GCKey credentials, we ask that you take another look at the program's eligibility criteria to ensure that you meet the requirements.",
                id: "ow71P8",
                description:
                  "A request for the user to review the IAP eligibility criteria",
              })}
            </p>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "If you have questions concerning this step, or if you are unsure about how to proceed, please feel free to reach out to our support team at <a>edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca</a>.",
                  id: "ltzA7w",
                  description:
                    "How to get help from the support team - IAP variant",
                },
                {
                  a: (chunks: ReactNode) =>
                    buildExternalLink(
                      "mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca",
                      chunks,
                    ),
                },
              )}
            </p>
          </>
        )}
        <Separator />
        <div className="flex items-center gap-6">
          <Link
            href={loginPath}
            mode="solid"
            color="primary"
            external
            onClick={() => {
              if (appInsights) {
                const userId = appInsights.context?.user?.id;
                appInsights.trackEvent(
                  { name: "GCKey Login Initiated" },
                  {
                    aiUserId: userId,
                    pageUrl: window.location.href,
                    path: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer || "none",
                    gcKeyStatus: "initiated",
                  },
                );
              }
            }}
          >
            {intl.formatMessage({
              defaultMessage: "Continue to GCKey and sign in",
              id: "4sLCWZ",
              description: "GCKey sign in link text on the sign in page",
            })}
          </Link>
          <Link href={paths.register()} mode="inline">
            {intl.formatMessage({
              defaultMessage: "Sign up instead",
              id: "aqkSW2",
              description: "Link text to register instead of signing in",
            })}
          </Link>
        </div>
      </Container>
    </>
  );
};

Component.displayName = "SignInPage";

export default Component;
