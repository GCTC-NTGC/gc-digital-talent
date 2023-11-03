import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";

import { Accordion, Heading, Link } from "@gc-digital-talent/ui";
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
import Instructions from "~/components/Instructions";

const buildExternalLink = (path: string, chunks: React.ReactNode) => (
  <Link external href={path}>
    {chunks}
  </Link>
);

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

  const helpLink = (chunks: React.ReactNode) => (
    <Link href={paths.support()} state={{ referrer: window.location.href }}>
      {chunks}
    </Link>
  );

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
            <Heading
              Icon={SparklesIcon}
              color="warning"
              level="h2"
              data-h2-font-weight="base(400)"
            >
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
            <Heading
              Icon={ArrowLeftOnRectangleIcon}
              color="primary"
              level="h3"
              size="h4"
              data-h2-font-weight="base(700)"
              data-h2-margin-top="base(x2.5)"
            >
              {intl.formatMessage({
                defaultMessage: "Signing in to your account",
                id: "Wnid+N",
                description:
                  "Heading for section of the sign in page showing the sign in steps",
              })}
            </Heading>
            <Heading level="h4" size="h5" data-h2-margin="base(x1, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Steps to signing in with GCKey and completing two-factor authentication",
                id: "QNMqSh",
                description: "Subtitle for a section explaining sign in steps",
              })}
            </Heading>
            <Instructions.List>
              <Instructions.Step image={step1Image}>
                {intl.formatMessage({
                  defaultMessage:
                    "1. Sign in with your username and password. Remember, <strong>your username is separate from your email address</strong>.",
                  id: "oR+6vE",
                  description: "Text for first sign in step.",
                })}
              </Instructions.Step>
              <Instructions.Step image={step2Image}>
                {intl.formatMessage({
                  defaultMessage:
                    "2. <strong>Open the authenticator app</strong> on your device.",
                  id: "QuHfUJ",
                  description: "Text for second sign in step.",
                })}
              </Instructions.Step>
              <Instructions.Step image={step3Image}>
                {intl.formatMessage({
                  defaultMessage:
                    "3. Enter your <strong>unique one-time six-digit code</strong> from your <strong>authenticator app</strong> into the verification bar.",
                  id: "oacrTu",
                  description: "Text for third sign in step.",
                })}
              </Instructions.Step>
              <Instructions.Step image={step4Image} includeArrow={false}>
                {intl.formatMessage({
                  defaultMessage:
                    "4. Hooray! <strong>You've signed in with GCKey</strong> and will be returned to the <strong>GC Digital Talent platform</strong>.",
                  id: "eO9buR",
                  description: "Text for final sign in step.",
                })}
              </Instructions.Step>
            </Instructions.List>
            <Heading
              Icon={InformationCircleIcon}
              color="error"
              level="h3"
              size="h4"
              data-h2-font-weight="base(700)"
              data-h2-margin-top="base(x2.5)"
            >
              {intl.formatMessage({
                defaultMessage: "Frequently Asked Questions (FAQs)",
                id: "AUtIo9",
                description:
                  "Heading for Frequently Asked Questions section on sign in page",
              })}
            </Heading>
            <Accordion.Root type="single" collapsible>
              <Accordion.Item value="one">
                <Accordion.Trigger as="h4" size="sm">
                  {intl.formatMessage({
                    defaultMessage:
                      "What if I deleted the app or changed phone and I don't have the recovery codes?",
                    id: "m+IDnG",
                    description:
                      "First of the Frequently Asked Questions for logging in",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "Although your login cannot be recovered, you can contact our <helpLink>Help Desk</helpLink>, and they can help you recover your account.",
                        id: "KpR9l5",
                        description:
                          "First answer of the Frequently Asked Questions for logging in",
                      },
                      {
                        helpLink,
                      },
                    )}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="two">
                <Accordion.Trigger as="h4" size="sm">
                  {intl.formatMessage({
                    defaultMessage:
                      "Can you remove the two-factor authentication from my account so I can reset it?",
                    id: "Val79M",
                    description:
                      "Second of the Frequently Asked Questions for logging in",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "We cannot remove the two factor authentication from your account, but you can contact our <helpLink>Help Desk</helpLink> and they can assist you with account recovery.",
                        id: "G1bgOX",
                        description:
                          "First answer of the Frequently Asked Questions for logging in",
                      },
                      {
                        helpLink,
                      },
                    )}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="three">
                <Accordion.Trigger as="h4" size="sm">
                  {intl.formatMessage({
                    defaultMessage:
                      "What can I do if my authenticator codes are no longer being accepted?",
                    id: "5myYda",
                    description:
                      "Third of the Frequently Asked Questions for logging in",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "Please contact our <helpLink>Help Desk</helpLink>, and they can help you recover your account.",
                        id: "qQgtWZ",
                        description:
                          "Third answer of the Frequently Asked Questions for logging in",
                      },
                      {
                        helpLink,
                      },
                    )}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="four">
                <Accordion.Trigger as="h4" size="sm">
                  {intl.formatMessage({
                    defaultMessage: "Already have a GCKey account?",
                    id: "ACa+rP",
                    description:
                      "Fourth of the Frequently Asked Questions for logging in",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p data-h2-margin-bottom="base(x0.5)">
                    {intl.formatMessage({
                      defaultMessage:
                        "If you already have a GCKey account you can sign in to your GC Digital Talent profile using your existing GCKey, even if you've never used this platform before.",
                      id: "3/YwR9",
                      description:
                        "Fourth answer of the Frequently Asked Questions for logging in - paragraph 1",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "If you're unsure whether you have an existing GCKey account, continue to the website and try signing in. If you can't remember your password, you can also reset it there.",
                      id: "n4eLy+",
                      description:
                        "Fourth answer of the Frequently Asked Questions for logging in - paragraph 2",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="five">
                <Accordion.Trigger as="h4" size="sm">
                  {intl.formatMessage({
                    defaultMessage: "What is a GCKey?",
                    id: "w3vO23",
                    description:
                      "Fifth of the Frequently Asked Questions for logging in",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "A GCKey is a central credential not managed by the GC Digital Talent team. The Government of Canada offers it as a way for you to communicate securely with many online-enabled Government programs and services.",
                      id: "1NliRt",
                      description:
                        "Fifth answer of the Frequently Asked Questions for logging in",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="six">
                <Accordion.Trigger as="h4" size="sm">
                  {intl.formatMessage({
                    defaultMessage:
                      "Who do I contact if I have questions about GCKey?",
                    id: "13Cbkq",
                    description:
                      "Sixth of the Frequently Asked Questions for logging in",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p data-h2-margin-bottom="base(x0.5)">
                    {intl.formatMessage({
                      defaultMessage:
                        "If you have questions about GCKey, please contact the GCKey team at:",
                      id: "gw/WSP",
                      description:
                        "Sixth answer of the Frequently Asked Questions for logging in - intro sentence",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Canada and the United States",
                      id: "8NNqcv",
                      description:
                        "Sixth answer of the Frequently Asked Questions for logging in - valid area for phone number",
                    })}
                  </p>
                  <Link
                    color="black"
                    external
                    href="tel:1-855-438-1102"
                    aria-label="1 8 5 5 4 3 8 1 1 0 2"
                    data-h2-margin-top="base(x0.5)"
                  >
                    1-855-438-1102
                  </Link>
                  <p data-h2-margin-top="base(x0.5)">
                    {intl.formatMessage({
                      defaultMessage: "Text Telephone (TTY/TDD)",
                      id: "g1MMTj",
                      description:
                        "Sixth answer of the Frequently Asked Questions for logging in - second way to 'contact us'",
                    })}
                  </p>
                  <Link
                    color="black"
                    external
                    href="tel:1-855-438-1103"
                    aria-label="1 8 5 5 4 3 8 1 1 0 3"
                    data-h2-margin-top="base(x0.5)"
                  >
                    1-855-438-1103
                  </Link>
                  <p data-h2-margin-top="base(x0.5)">
                    {intl.formatMessage({
                      defaultMessage: "Outside Canada and the United States",
                      id: "ConlR5",
                      description:
                        "Sixth answer of the Frequently Asked Questions for logging in - valid area for phone number",
                    })}
                  </p>
                  <Link
                    color="black"
                    external
                    href="tel:1-800-2318-6290"
                    aria-label="1 8 0 0 2 3 1 8 6 2 9 0"
                    data-h2-margin-top="base(x0.5)"
                  >
                    1-800-2318-6290
                  </Link>
                  <p data-h2-margin-top="base(x0.5)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Customer Service Representatives are available to assist you by phone, year round, 24 hours a day, 7 days a week.",
                      id: "HqQzy1",
                      description:
                        "Sixth answer of the Frequently Asked Questions for logging in - final sentence",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="seven">
                <Accordion.Trigger as="h4" size="sm">
                  {intl.formatMessage({
                    defaultMessage: "Which authenticator app should I install?",
                    id: "YWxGL/",
                    description:
                      "Seventh of the Frequently Asked Questions for logging in",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "As the Government of Canada we cannot recommend any specific third-party vendors or apps. Well known digital vendors, like Google Authenticator and Microsoft Authenticator, provide authenticator apps. Whichever app you choose, ensure that it comes from a reputable vendor.",
                      id: "DL/hpF",
                      description:
                        "Seventh answer of the Frequently Asked Questions for logging in",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="eight">
                <Accordion.Trigger as="h4" size="sm">
                  {intl.formatMessage({
                    defaultMessage:
                      "Can I use SMS or email authentication instead of an app?",
                    id: "ClrNAj",
                    description:
                      "Eighth of the Frequently Asked Questions for logging in",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Currently, our site only supports authentication through an authenticator app.",
                      id: "CIkGjy",
                      description:
                        "Eighth answer of the Frequently Asked Questions for logging in",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            <p data-h2-margin-top="base(x1)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Read all the FAQ's and still stuck? <helpLink>Contact our team for help</helpLink>",
                  id: "3M1/4Y",
                  description:
                    "Sentence following the Frequently Asked Questions about logging in",
                },
                {
                  helpLink,
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
          data-h2-gap="base(x1)"
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
