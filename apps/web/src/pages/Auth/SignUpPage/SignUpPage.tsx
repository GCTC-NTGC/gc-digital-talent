import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import ShieldCheckIcon from "@heroicons/react/24/outline/ShieldCheckIcon";

import { Accordion, Heading, Link } from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useTheme } from "@gc-digital-talent/theme";

import Hero from "~/components/Hero/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import createStep1Image from "~/assets/img/sign-up-create-step-1.webp";
import createStep2Image from "~/assets/img/sign-up-create-step-2.webp";
import createStep3Image from "~/assets/img/sign-up-create-step-3.webp";
import createStep4Image from "~/assets/img/sign-up-create-step-4.webp";
import mfaStep1Image from "~/assets/img/sign-up-mfa-step-1.webp";
import mfaStep2Image from "~/assets/img/sign-up-mfa-step-2.webp";
import mfaStep3Image from "~/assets/img/sign-up-mfa-step-3.webp";
import mfaStep4Image from "~/assets/img/sign-up-mfa-step-4.webp";
import Instructions from "~/components/Instructions";

const buildLink = (path: string, chunks: React.ReactNode) => (
  <Link href={path} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
);

const buildExternalLink = (path: string, chunks: React.ReactNode) => (
  <Link external href={path}>
    {chunks}
  </Link>
);

const SignUpPage = () => {
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
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          {!iapMode ? (
            <>
              {/* Standard copy */}
              <Heading
                Icon={MapIcon}
                color="primary"
                level="h2"
                data-h2-font-weight="base(400)"
                data-h2-margin="base(0, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "What to expect when creating an account",
                  id: "mV1/kq",
                  description:
                    "Heading at the top of the sign up page for applicant profiles",
                })}
              </Heading>
              <ul
                data-h2-margin="base(x1, 0)"
                data-h2-padding-left="base(x1)"
                data-h2-list-style="base(inside)"
              >
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "To sign up (or authenticate) with GC Digital Talent, we require that you use GCKey.",
                    id: "Dqsq+M",
                    description: "A _what to expect_ point on the sign up page",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "GCKey is a Government of Canada credential that allows you to securely conduct online business with various governmental programs and services.",
                    id: "XkA6s1",
                    description: "A _what to expect_ point on the sign up page",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "In addition to GCKey, you will need to set up a two-factor authenticator app for an added layer of security. (See setting up two-factor authentication for details)",
                    id: "RalbOM",
                    description: "A _what to expect_ point on the sign up page",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Expect to spend approximately 20 minutes to set up GCKey and the authenticator app.",
                    id: "BfrCXV",
                    description: "A _what to expect_ point on the sign up page",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "We have prepared additional guidance In the next section to help.",
                    id: "UpwY5+",
                    description: "A _what to expect_ point on the sign up page",
                  })}
                </li>
              </ul>
              <Link href={loginPath} mode="solid" color="primary" external>
                {intl.formatMessage({
                  defaultMessage: "Continue to GCKey and sign up",
                  id: "Nd1bIG",
                  description: "GCKey sign up link text on the sign up page",
                })}
              </Link>
              <Heading
                level="h3"
                data-h2-font-weight="base(400)"
                data-h2-margin="base(x2, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Part 1: Creating a GCKey account",
                  id: "u98IOx",
                  description:
                    "Heading for section of the sign up page showing the create steps",
                })}
              </Heading>
              <Heading
                level="h4"
                size="h6"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x2, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Steps to create your GCKey account",
                  id: "lZwkcR",
                  description:
                    "Subtitle for a section explaining the create steps",
                })}
              </Heading>
              <Instructions.List>
                <Instructions.Step image={createStep1Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "1. Select <strong>sign up</strong> on the welcome page. This is <strong>located after the sign in</strong> section. ",
                    id: "+rZvoD",
                    description: "Text for first sign up -> create step.",
                  })}
                </Instructions.Step>
                <Instructions.Step image={createStep2Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "2. Create a username and password. Don’t forget to <strong>save your username</strong> separately from your <strong>email address</strong>.",
                    id: "Jp/oeD",
                    description: "Text for second sign up -> create step.",
                  })}
                </Instructions.Step>
                <Instructions.Step image={createStep3Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "3. Complete your <strong>recovery questions</strong>. You are required to use a memorable <strong>person</strong> and <strong>date</strong>.",
                    id: "3GkMHE",
                    description: "Text for third sign up -> create step.",
                  })}
                </Instructions.Step>
                <Instructions.Step
                  image={createStep4Image}
                  includeArrow={false}
                >
                  {intl.formatMessage({
                    defaultMessage:
                      "4. Complete the email verification process. <strong>A unique one time code</strong> will be emailed to you to enter into GCKey.",
                    id: "LbtstO",
                    description: "Text for fourth sign up -> create step.",
                  })}
                </Instructions.Step>
              </Instructions.List>
              <Heading
                level="h3"
                data-h2-font-weight="base(400)"
                data-h2-margin="base(x2, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Part 2: Setting up two-factor authentication",
                  id: "wf3e6C",
                  description:
                    "Heading for section of the sign up page showing the mfa steps",
                })}
              </Heading>
              <Heading
                level="h4"
                size="h6"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x2, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "Why set up a two-factor authentication?",
                  id: "mjUxjN",
                  description:
                    "Subtitle for a section explaining why to set up mfa",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Think of the sign in as a security door to your account that can only be opened with a key (your password) and a secret code (from your two-factor authentication app). Even if someone finds or copies your key, they still won’t be able to get in because they don’t have your secret code.",
                  id: "1/LVZf",
                  description: "Copy explaining why to set up mfa",
                })}
              </p>
              <Heading
                level="h4"
                size="h6"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x2, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage: "You will need an authenticator app.",
                  id: "/WLsRj",
                  description: "Subtitle for a section explaining mfa apps",
                })}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "If you don’t already have an authenticator app you will need to download one. Digital vendors, like Google Authenticator and Microsoft Authenticator,  provide authenticator apps. Whichever app you choose, ensure that it comes from a reputable vendor.",
                  id: "lr6PWk",
                  description: "Copy explaining mfa apps",
                })}
              </p>
              <Heading
                level="h4"
                size="h6"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x2, 0, x1, 0)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Setting up your two-factor authentication app",
                  id: "eamuiH",
                  description:
                    "Subtitle for a section explaining setting up mfa",
                })}
              </Heading>
              <Instructions.List>
                <Instructions.Step image={mfaStep1Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "1. <strong>Prepare your device</strong> by downloading your preferred two-factor authentication app.",
                    id: "D6f8hs",
                    description: "Text for first sign up -> mfa step.",
                  })}
                </Instructions.Step>
                <Instructions.Step image={mfaStep2Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "2. <strong>Scan the QR code</strong> or <strong>enter your secret code</strong> using your two-factor authenticator app.",
                    id: "mVqKm+",
                    description: "Text for second sign up -> mfa step.",
                  })}
                </Instructions.Step>
                <Instructions.Step image={mfaStep3Image}>
                  {intl.formatMessage({
                    defaultMessage:
                      "3. <strong>Enter</strong> the code generated <strong>from your authenticator app</strong> into the verification bar.",
                    id: "W5vrNy",
                    description: "Text for third sign up -> mfa step.",
                  })}
                </Instructions.Step>
                <Instructions.Step image={mfaStep4Image} includeArrow={false}>
                  {intl.formatMessage({
                    defaultMessage:
                      "4. Hooray! You’ve completed your GCKey account and will be <strong>returned to the GC Digital Talent platform</strong>.",
                    id: "d0EUOF",
                    description: "Text for fourth sign up -> mfa step.",
                  })}
                </Instructions.Step>
              </Instructions.List>
              <Heading
                Icon={InformationCircleIcon}
                color="tertiary"
                level="h2"
                data-h2-font-weight="base(400)"
                data-h2-margin="base(x3, 0, x1, 0)"
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
                collapsible
                data-h2-margin="base(x1 0)"
              >
                <Accordion.Item value="one">
                  <Accordion.Trigger as="h4">
                    {intl.formatMessage({
                      defaultMessage: "What is a GCKey?",
                      id: "rrKF85",
                      description:
                        "First of the Frequently Asked Questions for sign up",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "A GCKey is a central credential not managed by the GC Digital Talent team. The Government of Canada offers it as a way for you to communicate securely with many online-enabled Government programs and services.",
                        id: "N+rELF",
                        description:
                          "First answer of the Frequently Asked Questions for sign up",
                      })}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="two">
                  <Accordion.Trigger as="h4">
                    {intl.formatMessage({
                      defaultMessage:
                        "Who do I contact if I have questions about GCKey?",
                      id: "WJM32F",
                      description:
                        "Second of the Frequently Asked Questions for sign up",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p data-h2-margin-bottom="base(x0.5)">
                      {intl.formatMessage({
                        defaultMessage:
                          "If you have questions about GCKey, please contact the GCKey team at:",
                        id: "yEYCHL",
                        description:
                          "Second answer of the Frequently Asked Questions for sign up, contact info",
                      })}
                    </p>
                    <p>
                      {intl.formatMessage({
                        defaultMessage: "Canada and the United States",
                        id: "11HdYI",
                        description:
                          "Second answer of the Frequently Asked Questions for sign up, contact info",
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
                        id: "s2OefW",
                        description:
                          "Second answer of the Frequently Asked Questions for sign up, contact info",
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
                        id: "aVILlG",
                        description:
                          "Second answer of the Frequently Asked Questions for sign up, contact info",
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
                        id: "vm0KOb",
                        description:
                          "Second answer of the Frequently Asked Questions for sign up, contact info",
                      })}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="three">
                  <Accordion.Trigger as="h4">
                    {intl.formatMessage({
                      defaultMessage:
                        "Which authenticator app should I install?",
                      id: "00tsn/",
                      description:
                        "Third of the Frequently Asked Questions for sign up",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "As the Government of Canada we cannot recommend any specific third-party vendors or apps. Well known digital vendors, like Google Authenticator and Microsoft Authenticator, provide authenticator apps. Whichever app you choose, ensure that it comes from a reputable vendor.",
                        id: "ByposT",
                        description:
                          "Third answer of the Frequently Asked Questions for sign up",
                      })}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="four">
                  <Accordion.Trigger as="h4">
                    {intl.formatMessage({
                      defaultMessage:
                        "What if I deleted the app or changed phone and I don’t have the recovery codes?",
                      id: "Jd/ZvJ",
                      description:
                        "Fourth of the Frequently Asked Questions for sign up",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "Although your login cannot be recovered, you can contact our <link>Help Desk</link>, and they can help you recover your account.",
                          id: "foidJi",
                          description:
                            "Fourth answer of the Frequently Asked Questions for sign up",
                        },
                        {
                          link: (chunks: React.ReactNode) =>
                            buildLink(paths.support(), chunks),
                        },
                      )}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="five">
                  <Accordion.Trigger as="h4">
                    {intl.formatMessage({
                      defaultMessage:
                        "Can I use SMS or email authentication instead of an app?",
                      id: "utILRB",
                      description:
                        "Fifth of the Frequently Asked Questions for sign up",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Currently, our site only supports authentication through an authenticator app.",
                        id: "Oajyw/",
                        description:
                          "Fifth answer of the Frequently Asked Questions for sign up",
                      })}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="six">
                  <Accordion.Trigger as="h4">
                    {intl.formatMessage({
                      defaultMessage:
                        "Can you remove the two-factor authentication from my account so I can reset it?",
                      id: "EqHa4y",
                      description:
                        "Sixth of the Frequently Asked Questions for sign up",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "We cannot remove the two factor authentication from your account, but you can contact our <link>Help Desk</link> and they can assist you with account recovery.",
                          id: "w79+Ww",
                          description:
                            "Sixth answer of the Frequently Asked Questions for sign up",
                        },
                        {
                          link: (chunks: React.ReactNode) =>
                            buildLink(paths.support(), chunks),
                        },
                      )}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="seven">
                  <Accordion.Trigger as="h4">
                    {intl.formatMessage({
                      defaultMessage:
                        "What can I do if my authenticator codes are no longer being accepted?",
                      id: "e1KnGs",
                      description:
                        "Seventh of the Frequently Asked Questions for sign up",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "Please contact our <link>Help Desk</link>, and they can help you recover your account.",
                          id: "ZwvgeK",
                          description:
                            "Seventh answer of the Frequently Asked Questions for sign up",
                        },
                        {
                          link: (chunks: React.ReactNode) =>
                            buildLink(paths.support(), chunks),
                        },
                      )}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="eight">
                  <Accordion.Trigger as="h4">
                    {intl.formatMessage({
                      defaultMessage: "Already have a GCKey account?",
                      id: "1qLpE3",
                      description:
                        "Eighth of the Frequently Asked Questions for sign up",
                    })}
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "If you already have a GCKey account you can sign in to your GC Digital Talent profile using your existing GCKey, even if you've never used this platform before. If you're unsure whether you have an existing GCKey account, continue to the website and try signing in. If you can't remember your password, you can also reset it there.",
                        id: "p4KrU2",
                        description:
                          "Eighth answer of the Frequently Asked Questions for sign up",
                      })}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
              <p data-h2-margin-top="base(x1)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Read all the FAQ’s and still stuck? <link>Contact our team for help</link>",
                    id: "TY7KLv",
                    description:
                      "Seventh answer of the Frequently Asked Questions for sign up",
                  },
                  {
                    link: (chunks: React.ReactNode) =>
                      buildLink(paths.support(), chunks),
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
          <hr
            data-h2-margin="base(x3, 0)"
            data-h2-border="base(none)"
            data-h2-height="base(1px)"
            data-h2-background-color="base(gray)"
          />
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) l-tablet(row)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(space-between)"
            data-h2-gap="base(x1)"
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

export default SignUpPage;
