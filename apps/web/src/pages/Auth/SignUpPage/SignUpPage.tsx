import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import ChevronDoubleRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon";

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
import { useFeatureFlags } from "@gc-digital-talent/env";

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
import canadaLoginStep1 from "~/assets/img/canada_login_registration_step_1_light.webp";
import canadaLoginStep1Dark from "~/assets/img/canada_login_registration_step_1_dark.webp";
import canadaLoginStep2 from "~/assets/img/canada_login_registration_step_2_light.webp";
import canadaLoginStep2Dark from "~/assets/img/canada_login_registration_step_2_dark.webp";
import canadaLoginStep3 from "~/assets/img/canada_login_registration_step_3_light.webp";
import canadaLoginStep3Dark from "~/assets/img/canada_login_registration_step_3_dark.webp";
import canadaLoginStep4 from "~/assets/img/canada_login_registration_step_4_light.webp";
import canadaLoginStep4Dark from "~/assets/img/canada_login_registration_step_4_dark.webp";
import canadaLoginStep5 from "~/assets/img/canada_login_registration_step_5_light.webp";
import canadaLoginStep5Dark from "~/assets/img/canada_login_registration_step_5_dark.webp";
import canadaLoginStep6 from "~/assets/img/canada_login_registration_step_6_light.webp";
import canadaLoginStep6Dark from "~/assets/img/canada_login_registration_step_6_dark.webp";
import canadaLoginStep7 from "~/assets/img/canada_login_registration_step_7_light.webp";
import canadaLoginStep7Dark from "~/assets/img/canada_login_registration_step_7_dark.webp";
import canadaLoginStep8 from "~/assets/img/canada_login_registration_step_8_light.webp";
import canadaLoginStep8Dark from "~/assets/img/canada_login_registration_step_8_dark.webp";
import canadaLoginStep9 from "~/assets/img/canada_login_registration_step_9_light.webp";
import canadaLoginStep9Dark from "~/assets/img/canada_login_registration_step_9_dark.webp";
import Instructions from "~/components/Instructions";
import InstructionsStepCard, {
  InstructionsCardGrid,
} from "~/components/Instructions/RegisterInstructionStep";
import gckeyMessages from "~/messages/gckeyMessages";
import canadaLoginMessages from "~/messages/canadaLoginMessages";
import authMessages from "~/messages/authMessages";

const helpLink = (chunks: ReactNode, path: string) => (
  <Link href={path} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
);

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const [searchParams] = useSearchParams();
  const fromPath = searchParams.get("from");
  const fallbackPath = paths.applicantDashboard();
  const loginPath = apiPaths.login(fromPath ?? fallbackPath, getLocale(intl));

  // feature flag
  const featureFlags = useFeatureFlags();

  const pageTitle = featureFlags?.canadaLogin
    ? intl.formatMessage({
        defaultMessage: "Register using CanadaLogin",
        id: "O4O6Rn",
        description: "Page title for the registration page",
      })
    : intl.formatMessage({
        defaultMessage: "Sign up using GCKey",
        id: "e8SFXx",
        description:
          "Page title for the registration page for applicant profiles",
      });

  const breadcrumbLabel = featureFlags?.canadaLogin
    ? intl.formatMessage({
        defaultMessage: "Register",
        id: "BN4cj6",
        description: "Breadcrumb label for the Canada Login registration page",
      })
    : pageTitle;

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: breadcrumbLabel,
        url: paths.register(),
      },
    ],
  });

  // Feature Flag: Canada Login
  if (featureFlags?.canadaLogin) {
    return (
      <>
        <SEO title={pageTitle} />
        <Hero title={pageTitle} crumbs={crumbs} overlap={true} centered={true}>
          <div className="mt-0 rounded-md bg-white px-6 py-12 shadow-sm sm:mt-10 dark:bg-gray-600">
            <div className="px-2">
              <Heading
                level="h2"
                color="primary"
                icon={SparklesIcon}
                className="mt-0 font-normal"
              >
                {intl.formatMessage({
                  defaultMessage: "Welcome",
                  id: "qrd+vb",
                  description:
                    "Welcome heading at the top of the registration page",
                })}
              </Heading>
              <p className="pt-4 pl-2">
                {intl.formatMessage({
                  defaultMessage:
                    "You'll be leaving our site to register with CanadaLogin. We have prepared additional guidance in the next section to help.",
                  id: "xgrysZ",
                  description:
                    "Copy under welcome heading at the top of the registration page",
                })}
              </p>
              <div className="flex flex-col items-start gap-4 pt-6 pl-2 xs:flex-row xs:items-center">
                <Link
                  href={`${loginPath}&skipmigration=true`}
                  mode="solid"
                  color="primary"
                  utilityIcon={ChevronDoubleRightIcon}
                  external
                  className="xxs:px-3"
                >
                  {intl.formatMessage({
                    defaultMessage: "Proceed to CanadaLogin",
                    id: "KorMJQ",
                    description:
                      "CanadaLogin sign up link text on the registration page",
                  })}
                </Link>

                <p className="m-0 flex items-center pl-2">
                  <Link
                    href="#registrationInstructions"
                    mode="inline"
                    external
                    className="sm:ml-4"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Instructions on how to register",
                      id: "FnXbHv",
                      description:
                        "Heading for the instructions resource block on the registration page",
                    })}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Hero>

        <Container className="my-12">
          <div id="registrationInstructions" className="scroll-mt-20">
            <Heading
              level="h3"
              size="h4"
              className="mt-6 mb-4 text-center font-normal xs:text-left"
            >
              {intl.formatMessage({
                defaultMessage: "Part 1: Create a CanadaLogin account",
                id: "Su2+bZ",
                description:
                  "Heading for section of the registration page showing the create steps",
              })}
            </Heading>

            <InstructionsCardGrid columns={3}>
              <InstructionsStepCard
                className="rounded-t-md rounded-b-none pt-12 pb-7.5 xs:rounded-l-md xs:rounded-r-none"
                img={{
                  src: canadaLoginStep1,
                  darkSrc: canadaLoginStep1Dark,
                }}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Head to CanadaLogin.",
                    id: "sRUaI5",
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <p className="mt-4">
                  {intl.formatMessage({
                    defaultMessage: "Agree to the summary of terms.",
                    id: "qSNLSc",
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-2 mb-6.75">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-100">
                    {intl.formatMessage({
                      defaultMessage:
                        "If you've already used CanadaLogin on another service, you can enter your email and password and skip to step two.",
                      id: "h4BQ8C",
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </span>
                </div>
              </InstructionsStepCard>

              <InstructionsStepCard
                className="rounded-none pt-12 pb-7.5"
                background="darker"
                img={{
                  src: canadaLoginStep2,
                  darkSrc: canadaLoginStep2Dark,
                }}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Enter your first and last name.",
                    id: "FD+jX4",
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-2 mb-6.75">
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-100">
                    {intl.formatMessage({
                      defaultMessage:
                        "The name you use here will be on your GC Digital Talent profile.",
                      id: "8dctGM",
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </span>
                </div>
              </InstructionsStepCard>

              <InstructionsStepCard
                className="rounded-t-none rounded-b-md pt-12 pb-7.5 xs:rounded-l-none xs:rounded-r-md"
                includeArrow={false}
                img={{
                  src: canadaLoginStep3,
                  darkSrc: canadaLoginStep3Dark,
                }}
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Verify your personal email address.",
                    id: "Ip9S/o",
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <p className="mt-4">
                  {intl.formatMessage({
                    defaultMessage:
                      "Enter the code sent to your email into CanadaLogin.",
                    id: "XLJuh+",
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-2 mb-6.75">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-100">
                    {intl.formatMessage({
                      defaultMessage:
                        "Using a personal email address will help ensure you don't lose access if you change jobs.",
                      id: "OG/Fbe",
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </span>
                </div>
              </InstructionsStepCard>
            </InstructionsCardGrid>
          </div>
          <Heading
            level="h3"
            size="h4"
            className="mt-20 mb-3.5 text-center font-normal xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Part 2: Set up two-step verification",
              id: "OxuU1/",
              description:
                "Heading for section of the registration page showing the create steps",
            })}
          </Heading>
          <InstructionsCardGrid columns={3}>
            <InstructionsStepCard
              className="rounded-t-md rounded-b-none pt-12 pb-7.5 xs:rounded-l-md xs:rounded-r-none"
              img={{ src: canadaLoginStep4, darkSrc: canadaLoginStep4Dark }}
            >
              <div className="mb-6.75 space-y-4 text-center">
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Set up two-step verification.",
                    id: "D/Tcaj",
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <p className="mt-4">
                  {intl.formatMessage({
                    defaultMessage: "Enter your personal phone number.",
                    id: "XUt7q+",
                    description: "Text for first registration -> create step.",
                  })}
                </p>
                <div className="mt-4">
                  <p className="text-sm font-normal text-gray-500 dark:text-gray-100">
                    {intl.formatMessage({
                      defaultMessage:
                        "Using a personal phone number will help ensure you don't lose access if you change jobs.",
                      id: "QbJmAL",
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                </div>
              </div>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="rounded-none pt-12 pb-7.5"
              background="darker"
              img={{ src: canadaLoginStep5, darkSrc: canadaLoginStep5Dark }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "You will be sent a code to the number you provided.",
                  id: "QU8yQJ",
                  description: "Text for first registration -> create step.",
                })}
              </p>
              <p className="mt-4">
                {intl.formatMessage({
                  defaultMessage: "Enter the code into CanadaLogin.",
                  id: "pTOGhN",
                  description: "Text for first registration -> create step.",
                })}
              </p>
              <div className="mt-2 mb-6.75">
                <span className="text-sm font-normal text-gray-600 dark:text-gray-100">
                  {intl.formatMessage({
                    defaultMessage:
                      "This code will be sent by either text or phone call, and will expire after ten minutes.",
                    id: "As56gg",
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="rounded-t-none rounded-b-md pt-12 pb-7.5 xs:rounded-l-none xs:rounded-r-md"
              includeArrow={false}
              img={{ src: canadaLoginStep6, darkSrc: canadaLoginStep6Dark }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "You've successfully created your CanadaLogin.",
                  id: "To1Tf5",
                  description: "Text for first registration -> create step.",
                })}
              </p>
              <p className="mt-4 mb-6.75">
                {intl.formatMessage({
                  defaultMessage:
                    "You will be returned to the GC Digital Talent platform.",
                  id: "FJU6Pr",
                  description: "Text for first registration -> create step.",
                })}
              </p>
            </InstructionsStepCard>
          </InstructionsCardGrid>
          <Heading
            level="h3"
            size="h4"
            className="mt-20 mb-3.5 text-center font-normal xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Part 3: Access your account",
              id: "WsnfHy",
              description:
                "Heading for section of the registration page showing the create steps",
            })}
          </Heading>
          <InstructionsCardGrid columns={3}>
            <InstructionsStepCard
              className="rounded-t-md rounded-b-none pt-12 pb-7.5 xs:rounded-l-md xs:rounded-r-none"
              img={{ src: canadaLoginStep7, darkSrc: canadaLoginStep7Dark }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "View your details sent from CanadaLogin, linked to your GC Digital Talent profile.",
                  id: "IHcJGO",
                  description: "Text for first registration -> create step.",
                })}
              </p>
              <div className="mt-2 mb-6.75">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-100">
                  {intl.formatMessage({
                    defaultMessage:
                      "You can manage your CanadaLogin profile and security settings on the CanadaLogin website.",
                    id: "nup4Ey",
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="rounded-none pt-12 pb-7.5"
              background="darker"
              img={{ src: canadaLoginStep8, darkSrc: canadaLoginStep8Dark }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Verify your Government of Canada work email to unlock employee tools.",
                  id: "jrDcs6",
                  description: "Text for first registration -> create step.",
                })}
              </p>
              <div className="mt-2 mb-6.75">
                <span className="text-sm font-normal text-gray-600 dark:text-gray-100">
                  {intl.formatMessage({
                    defaultMessage:
                      "This feature is only available to current Government of Canada employees.",
                    id: "Bo2POt",
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="rounded-t-none rounded-b-md pt-12 pb-7.5 xs:rounded-l-none xs:rounded-r-md"
              includeArrow={false}
              img={{ src: canadaLoginStep9, darkSrc: canadaLoginStep9Dark }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Add your current work experience to your GC Digital Talent profile.",
                  id: "eg07u9",
                  description: "Text for first registration -> create step.",
                })}
              </p>
              <div className="mt-2 mb-6.75">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-100">
                  {intl.formatMessage({
                    defaultMessage:
                      "If you are a government employee this is the final step in order to unlock your employee tools.",
                    id: "3lu+JJ",
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>
          </InstructionsCardGrid>

          <Heading
            icon={InformationCircleIcon}
            color="primary"
            level="h3"
            size="h4"
            className="mt-12 mb-5 justify-center font-normal xs:justify-start"
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
            className="my-5 mt-4"
          >
            <Accordion.Item value="one">
              <Accordion.Trigger as="h4">
                {intl.formatMessage(canadaLoginMessages.haveCanadaLogin)}
              </Accordion.Trigger>
              <Accordion.Content>
                <p>
                  {intl.formatMessage(
                    canadaLoginMessages.haveCanadaLoginAnswer,
                  )}
                </p>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="two">
              <Accordion.Trigger as="h4">
                {intl.formatMessage(canadaLoginMessages.whatIsCanadaLogin)}
              </Accordion.Trigger>
              <Accordion.Content>
                <p className="mb-3">
                  {intl.formatMessage(
                    canadaLoginMessages.whatIsCanadaLoginAnswer,
                  )}
                </p>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="three">
              <Accordion.Trigger as="h4">
                {intl.formatMessage(canadaLoginMessages.contactCanadaLogin)}
              </Accordion.Trigger>
              <Accordion.Content>
                <p>
                  {intl.formatMessage(
                    canadaLoginMessages.answerContactCanadaLogin1,
                  )}
                </p>
                <p className="mt-4 mb-3">
                  <Link
                    color="black"
                    external
                    aria-label={intl.formatMessage(
                      canadaLoginMessages.answerContactCanadaLogin2,
                    )}
                    href={
                      intl.locale === "fr"
                        ? "https://connexion.canada.ca/fr/utilisateurs/nous-contacter/"
                        : "https://login.canada.ca/en/users/contact-us/"
                    }
                  >
                    {intl.formatMessage(
                      canadaLoginMessages.answerContactCanadaLogin2,
                    )}
                  </Link>
                </p>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
          <p className="mt-5">
            {intl.formatMessage(gckeyMessages.moreQuestions, {
              helpLink: (chunks: ReactNode) =>
                helpLink(chunks, paths.support()),
            })}
          </p>
        </Container>
      </>
    );
  }
  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <Container className="my-18">
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
        <Heading level="h3" size="h4" className="mt-20 mb-3.5 font-bold">
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
            description: "Subtitle for a section explaining the create steps",
          })}
        </Heading>
        <Instructions.List>
          <Instructions.Step
            img={{ src: createStep1Image, darkSrc: createStep1ImageDark }}
          >
            {intl.formatMessage({
              defaultMessage:
                "1. Select <strong>sign up</strong> on the welcome page. This is <strong>located after the sign in</strong> section.",
              id: "MUYJr1",
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
            description: "Subtitle for a section explaining why to set up mfa",
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
          className="my-6"
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
              {intl.formatMessage(gckeyMessages.questionAuthAlternative)}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>{intl.formatMessage(gckeyMessages.answerAuthAlternative)}</p>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="five">
            <Accordion.Trigger as="h3">
              {intl.formatMessage(gckeyMessages.questionExistingAccount)}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>{intl.formatMessage(gckeyMessages.answerExistingAccount)}</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <p className="mt-6">
          {intl.formatMessage(gckeyMessages.moreQuestions, {
            helpLink: (chunks: ReactNode) => helpLink(chunks, paths.support()),
          })}
        </p>
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
