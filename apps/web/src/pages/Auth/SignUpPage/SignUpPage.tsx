import { ReactNode, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import MapIcon from "@heroicons/react/24/outline/MapIcon";

import {
  Accordion,
  Container,
  Heading,
  Link,
  Separator,
  Ul,
} from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useTheme } from "@gc-digital-talent/theme";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import createStep1Image from "~/assets/img/sign-up-step-1-light.webp";
import createStep2Image from "~/assets/img/sign-up-step-2-light.webp";
import createStep3Image from "~/assets/img/sign-up-step-3-light.webp";
import createStep4Image from "~/assets/img/sign-up-step-4-light.webp";
import createStep1ImageDark from "~/assets/img/sign-up-step-1-dark.webp";
import createStep2ImageDark from "~/assets/img/sign-up-step-2-dark.webp";
import createStep3ImageDark from "~/assets/img/sign-up-step-3-dark.webp";
import createStep4ImageDark from "~/assets/img/sign-up-step-4-dark.webp";
import mfaStep1Image from "~/assets/img/mfa-step-1-light.webp";
import mfaStep2Image from "~/assets/img/mfa-step-2-light.webp";
import mfaStep3Image from "~/assets/img/mfa-step-3-light.webp";
import mfaStep4Image from "~/assets/img/mfa-step-4-light.webp";
import mfaStep1ImageDark from "~/assets/img/mfa-step-1-dark.webp";
import mfaStep2ImageDark from "~/assets/img/mfa-step-2-dark.webp";
import mfaStep3ImageDark from "~/assets/img/mfa-step-3-dark.webp";
import mfaStep4ImageDark from "~/assets/img/mfa-step-4-dark.webp";
import Instructions from "~/components/Instructions";
import gckeyMessages from "~/messages/gckeyMessages";
import authMessages from "~/messages/authMessages";

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
    defaultMessage: "Sign up using GCKey",
    id: "e8SFXx",
    description: "Page title for the registration page for applicant profiles",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.register(),
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
              icon={MapIcon}
              color="secondary"
              level="h2"
              size="h3"
              className="mt-0 mb-6 font-normal"
            >
              {intl.formatMessage({
                defaultMessage: "What to expect when creating an account",
                id: "mV1/kq",
                description:
                  "Heading at the top of the sign up page for applicant profiles",
              })}
            </Heading>
            <Ul className="my-6" space="md" noIndent>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "To sign up (or authenticate) with GC Digital Talent, we require that you use GCKey.",
                  id: "Dqsq+M",
                  description: "A _what to expect_ point on the sign up page",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "GCKey is a Government of Canada credential that allows you to securely conduct online business with various governmental programs and services.",
                  id: "XkA6s1",
                  description: "A _what to expect_ point on the sign up page",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "In addition to GCKey, you will need to set up a two-factor authenticator app for an added layer of security. (See setting up two-factor authentication for details)",
                  id: "RalbOM",
                  description: "A _what to expect_ point on the sign up page",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "Expect to spend approximately 20 minutes to set up GCKey and the authenticator app.",
                  id: "BfrCXV",
                  description: "A _what to expect_ point on the sign up page",
                })}
              </li>
              <li>
                {intl.formatMessage({
                  defaultMessage:
                    "We have prepared additional guidance In the next section to help.",
                  id: "UpwY5+",
                  description: "A _what to expect_ point on the sign up page",
                })}
              </li>
            </Ul>
            <Link href={loginPath} mode="solid" color="primary" external>
              {intl.formatMessage({
                defaultMessage: "Sign up with GCKey",
                id: "4LMyAD",
                description: "GCKey sign up link text on the sign up page",
              })}
            </Link>
            <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage: "Part 1: Creating a GCKey account",
                id: "u98IOx",
                description:
                  "Heading for section of the sign up page showing the create steps",
              })}
            </Heading>
            <Heading level="h4" size="h6" className="mt-12 mb-3 font-bold">
              {intl.formatMessage({
                defaultMessage: "Steps to create your GCKey account",
                id: "lZwkcR",
                description:
                  "Subtitle for a section explaining the create steps",
              })}
            </Heading>
            <Instructions.List>
              <Instructions.Step
                img={{ src: createStep1Image, darkSrc: createStep1ImageDark }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "1. Select <strong>sign up</strong> on the welcome page. This is <strong>located after the sign in</strong> section. ",
                  id: "+rZvoD",
                  description: "Text for first sign up -> create step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                img={{ src: createStep2Image, darkSrc: createStep2ImageDark }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "2. Create a username and password. Don’t forget to <strong>save your username</strong> separately from your <strong>email address</strong>.",
                  id: "Jp/oeD",
                  description: "Text for second sign up -> create step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                img={{ src: createStep3Image, darkSrc: createStep3ImageDark }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "3. Complete your <strong>recovery questions</strong>. You are required to use a memorable <strong>person</strong> and <strong>date</strong>.",
                  id: "3GkMHE",
                  description: "Text for third sign up -> create step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                includeArrow={false}
                img={{ src: createStep4Image, darkSrc: createStep4ImageDark }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "4. Complete the email verification process. <strong>A unique one time code</strong> will be emailed to you to enter into GCKey.",
                  id: "LbtstO",
                  description: "Text for fourth sign up -> create step.",
                })}
              </Instructions.Step>
            </Instructions.List>
            <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
              {intl.formatMessage({
                defaultMessage: "Part 2: Setting up two-factor authentication",
                id: "wf3e6C",
                description:
                  "Heading for section of the sign up page showing the mfa steps",
              })}
            </Heading>
            <Heading level="h4" size="h6" className="mt-12 mb-3 font-bold">
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
            <Heading level="h4" size="h6" className="mt-12 mb-3 font-bold">
              {intl.formatMessage({
                defaultMessage: "You will need an authenticator app.",
                id: "/WLsRj",
                description: "Subtitle for a section explaining mfa apps",
              })}
            </Heading>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "If you don’t already have an authenticator app you will need to download one. Digital vendors, like Google Authenticator and Microsoft Authenticator, provide authenticator apps. Whichever app you choose, ensure that it comes from a reputable vendor.",
                id: "mF1IpF",
                description: "Copy explaining mfa apps",
              })}
            </p>
            <Heading level="h4" size="h6" className="mt-12 mb-3 font-bold">
              {intl.formatMessage({
                defaultMessage: "Setting up your two-factor authentication app",
                id: "eamuiH",
                description: "Subtitle for a section explaining setting up mfa",
              })}
            </Heading>
            <Instructions.List>
              <Instructions.Step
                img={{
                  src: mfaStep1Image,
                  darkSrc: mfaStep1ImageDark,
                  lazy: true,
                  width: 700,
                  height: 507,
                }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "1. <strong>Prepare your device</strong> by downloading your preferred two-factor authentication app.",
                  id: "D6f8hs",
                  description: "Text for first sign up -> mfa step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                img={{
                  src: mfaStep2Image,
                  darkSrc: mfaStep2ImageDark,
                  lazy: true,
                  width: 700,
                  height: 507,
                }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "2. <strong>Scan the QR code</strong> or <strong>enter your secret code</strong> using your two-factor authenticator app.",
                  id: "mVqKm+",
                  description: "Text for second sign up -> mfa step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                img={{
                  src: mfaStep3Image,
                  darkSrc: mfaStep3ImageDark,
                  lazy: true,
                  width: 700,
                  height: 507,
                }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "3. <strong>Enter</strong> the code generated <strong>from your authenticator app</strong> into the verification bar.",
                  id: "W5vrNy",
                  description: "Text for third sign up -> mfa step.",
                })}
              </Instructions.Step>
              <Instructions.Step
                includeArrow={false}
                img={{
                  src: mfaStep4Image,
                  darkSrc: mfaStep4ImageDark,
                  lazy: true,
                  width: 700,
                  height: 507,
                }}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "4. Hooray! You’ve completed your GCKey account and will be <strong>returned to the GC Digital Talent platform</strong>.",
                  id: "d0EUOF",
                  description: "Text for fourth sign up -> mfa step.",
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
              className="my-16"
            >
              <Accordion.Item value="one">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionWhatGCKey)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>{intl.formatMessage(gckeyMessages.answerWhatGCKey)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="two">
                <Accordion.Trigger as="h3">
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
              <Accordion.Item value="three">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionAuthApp)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>{intl.formatMessage(gckeyMessages.answerAuthApp)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="four">
                <Accordion.Trigger as="h3">
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
              <Accordion.Item value="five">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionAuthAlternative)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerAuthAlternative)}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="six">
                <Accordion.Trigger as="h3">
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
              <Accordion.Item value="seven">
                <Accordion.Trigger as="h3">
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
              <Accordion.Item value="eight">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionExistingAccount)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(gckeyMessages.answerExistingAccount)}
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
            <p className="mb-6">
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
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Link href={loginPath} mode="solid" color="primary" external>
            {intl.formatMessage({
              defaultMessage: "Sign up with GCKey",
              id: "4LMyAD",
              description: "GCKey sign up link text on the sign up page",
            })}
          </Link>
          <Link href={loginPath} mode="inline" external>
            {intl.formatMessage(authMessages.signIn)}
          </Link>
        </div>
      </Container>
    </>
  );
};

Component.displayName = "SignUpPage";

export default Component;
