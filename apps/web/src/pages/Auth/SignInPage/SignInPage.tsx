import { ReactNode, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import ArrowLeftEndOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftEndOnRectangleIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import { FormProvider, useForm } from "react-hook-form";
import ChevronDoubleRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon";
import MapIcon from "@heroicons/react/24/outline/MapIcon";

import { appInsights } from "@gc-digital-talent/app-insights";
import {
  Accordion,
  Container,
  Heading,
  Link,
  Notice,
  Separator,
} from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useTheme } from "@gc-digital-talent/theme";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { RadioGroup } from "@gc-digital-talent/forms";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import InstructionsStepCard, {
  InstructionsCardGrid,
} from "~/components/Instructions/RegisterInstructionStep";
import canadaLoginStep2a from "~/assets/img/canada_login_step_2a_light.webp";
import canadaLoginStep2aDark from "~/assets/img/canada_login_step_2a_dark.webp";
import canadaLoginStep2b from "~/assets/img/canada_login_step_2b_light.webp";
import canadaLoginStep2bDark from "~/assets/img/canada_login_step_2b_dark.webp";
import canadaLoginStep2c from "~/assets/img/canada_login_step_2c_light.webp";
import canadaLoginStep2cDark from "~/assets/img/canada_login_step_2c_dark.webp";
import canadaLoginStep3 from "~/assets/img/canada_login_step_3_light.webp";
import canadaLoginStep3Dark from "~/assets/img/canada_login_step_3_dark.webp";
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

  // feature flag
  const featureFlags = useFeatureFlags();

  const pageTitle = featureFlags?.canadaLogin
    ? intl.formatMessage({
        defaultMessage: "Sign in using CanadaLogin",
        id: "q9LrNV", // TODO
        description: "Page title for the sign in page using CanadaLogin",
      })
    : intl.formatMessage({
        defaultMessage: "Sign in using GCKey",
        id: "vkAhEM",
        description: "Page title for the sign in page for applicant profiles",
      });

  const breadcrumbLabel = featureFlags?.canadaLogin
    ? intl.formatMessage({
        defaultMessage: "Sign in",
        id: "s8eL7k", // TODO
        description: "Breadcrumb label for the Canada Login sign in page",
      })
    : pageTitle;

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: breadcrumbLabel,
        url: paths.login(),
      },
    ],
  });

  const methods = useForm({
    defaultValues: {
      signInMethod: featureFlags.canadaLogin ? "canadaLogin" : "gckey",
    },
  });

  const selectedMethod = methods.watch("signInMethod");

  useEffect(() => {
    if (iapMode && themeKey !== "iap") {
      setThemeKey("iap");
    }
  }, [iapMode, themeKey, setThemeKey]);

  // Feature Flag: Canada Login
  if (featureFlags?.canadaLogin) {
    return (
      <>
        <SEO title={pageTitle} />
        <Hero title={pageTitle} crumbs={crumbs} overlap={true} centered={true}>
          <div className="mt-0 rounded-md bg-white px-6 py-12 shadow-sm sm:mt-10 dark:bg-gray-600">
            {!iapMode && (
              <div className="px-2">
                <Heading
                  level="h2"
                  color="primary"
                  icon={SparklesIcon}
                  className="mt-0 font-normal"
                >
                  {intl.formatMessage({
                    defaultMessage: "Welcome back",
                    id: "nmBkRg", // TODO
                    description:
                      "Welcome heading at the top of the sign in page",
                  })}
                </Heading>
                <p className="pt-2 pl-2">
                  {intl.formatMessage({
                    defaultMessage:
                      "We're upgrading from GCKey sign in experience to the government's new central account system called CanadaLogin.",
                    id: "OgTBmm", // TODO
                    description:
                      "Copy under welcome heading at the top of the sign in page",
                  })}
                </p>
                <p className="pt-4 pl-2">
                  {intl.formatMessage({
                    defaultMessage:
                      "You'll be leaving our site to sign in with CanadaLogin. If anything goes wrong, we have prepared additional guidance for you.",
                    id: "vC8yrC", // TODO
                    description:
                      "Copy under welcome heading at the top of the sign in page",
                  })}
                </p>

                <p className="pt-6 pl-2">
                  {intl.formatMessage({
                    defaultMessage: "How did you last sign in?",
                    id: "CIDrn4", // TODO
                    description:
                      "Heading for the section asking users how they last signed in on the sign in page",
                  })}
                </p>

                <div className="pl-2">
                  <FormProvider {...methods}>
                    <RadioGroup
                      idPrefix="signin-method"
                      name="signInMethod"
                      legend=""
                      columns={1}
                      items={[
                        {
                          value: "canadaLogin",
                          label: "CanadaLogin",
                          contentBelow: featureFlags.canadaLogin ? (
                            <p>
                              {intl.formatMessage({
                                defaultMessage:
                                  "Your last sign in was recent and used your email to create a CanadaLogin account",
                                id: "KG4nJL", //TODO
                                description:
                                  "Message shown under CanadaLogin option on sign in page",
                              })}
                            </p>
                          ) : null,
                        },
                        {
                          value: "gckey",
                          label: "GCKey",
                          contentBelow: (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {intl.formatMessage({
                                defaultMessage:
                                  "Your last sign in was before April 2026 and used a GCKey username",
                                id: "5V6IMt", // TODO
                                description:
                                  "Message shown under GCKey option on sign in page",
                              })}
                            </p>
                          ),
                        },
                      ]}
                    />
                  </FormProvider>
                </div>
              </div>
            )}
            {selectedMethod && (
              <div className="px-4">
                <Notice.Root
                  mode="inline"
                  color={selectedMethod === "gckey" ? "warning" : "primary"}
                  className="mt-4"
                >
                  <Notice.Title>
                    {selectedMethod === "gckey"
                      ? intl.formatMessage({
                          defaultMessage: "GCKey is being replaced",
                          id: "AHlRZt",
                          description: "Title for important update notice",
                        })
                      : intl.formatMessage({
                          defaultMessage: "Use CanadaLogin",
                          id: "299Vg4",
                          description:
                            "Confirmation notice for CanadaLogin selection",
                        })}
                  </Notice.Title>
                  <Notice.Content>
                    {selectedMethod === "gckey"
                      ? intl.formatMessage({
                          defaultMessage:
                            "We'll help you with a one-time switch from GCKey to CanadaLogin",
                          id: "ScdEWz",
                          description:
                            "Copy under welcome heading at the top of the sign in page",
                        })
                      : intl.formatMessage({
                          defaultMessage:
                            "If you're unsure or have completed the transition, select CanadaLogin.",
                          id: "kUOZ8e",
                          description: "Redirect notice text",
                        })}

                    {selectedMethod === "gckey" && (
                      <ul className="list-none space-y-1">
                        <li className="relative pl-2 before:absolute before:left-0 before:content-['-']">
                          {intl.formatMessage({
                            defaultMessage: "Create a CanadaLogin account",
                            id: "faKH/0", // TODO
                            description: "First note about GCKey migration",
                          })}
                        </li>
                        <li className="relative pl-2 before:absolute before:left-0 before:content-['-']">
                          {intl.formatMessage({
                            defaultMessage:
                              "Link your GCKey to your CanadaLogin",
                            id: "B+y8nm", // TODO
                            description: "Second note about GCKey migration",
                          })}
                        </li>
                        <li className="relative pl-2 before:absolute before:left-0 before:content-['-']">
                          {intl.formatMessage({
                            defaultMessage:
                              "Continue signing in to GC Digital Talent",
                            id: "YjHOkG", // TODO
                            description: "Third note about GCKey migration",
                          })}
                        </li>
                      </ul>
                    )}
                  </Notice.Content>
                </Notice.Root>
              </div>
            )}
            <div className="flex flex-col items-start gap-4 pt-6 pl-4 xs:flex-row xs:items-center">
              <Link
                href={paths.registrationExperience()} // TODO
                mode="solid"
                color="primary"
                utilityIcon={ChevronDoubleRightIcon}
                external
              >
                {intl.formatMessage({
                  defaultMessage: "Get started",
                  id: "ci28W3", // TODO
                  description:
                    "CanadaLogin sign up link text on the sign in page",
                })}
              </Link>
              <p className="m-0 flex items-center lg:pl-4">
                <Link
                  href={paths.registrationExperience()} // TODO
                  mode="inline"
                  external
                  className="lg:ml-2"
                >
                  {intl.formatMessage({
                    defaultMessage: "I need help",
                    id: "+G1WRn", // TODO
                    description:
                      "Heading for the instructions resource block on the sign in page",
                  })}
                </Link>
              </p>
            </div>
          </div>
        </Hero>

        <Container className="my-10">
          {!iapMode ? (
            <>
              <Heading
                color="primary"
                level="h3"
                size="h4"
                className="mt-6 font-normal"
                icon={MapIcon}
              >
                {intl.formatMessage({
                  defaultMessage: "Your account transition journey",
                  id: "2b7CQ/", // TODO
                  description:
                    "Heading for the account transition journey section on the sign in page",
                })}
              </Heading>
              <Heading level="h3" size="h4" className="mt-6 mb-4 font-normal">
                {intl.formatMessage({
                  defaultMessage: "Step 1: Create a CanadaLogin or sign in",
                  id: "p2LOIV", // TODO
                  description:
                    "Heading for section of the sign in page showing the create steps",
                })}
              </Heading>

              <InstructionsCardGrid columns={3}>
                <InstructionsStepCard
                  className="rounded-t-md rounded-b-none xs:rounded-l-md xs:rounded-r-none"
                  img={{
                    src: canadaLoginStep2a,
                    darkSrc: canadaLoginStep2aDark,
                  }} // TODO: update with correct image
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Head to CanadaLogin.",
                      id: "sRUaI5", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <p className="mt-4">
                    {intl.formatMessage({
                      defaultMessage: "Agree to the summary of terms.",
                      id: "qSNLSc", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>

                  <div className="mt-4">
                    <span className="text-base font-normal text-gray-500 dark:text-gray-200">
                      {intl.formatMessage({
                        defaultMessage:
                          "If you've already used CanadaLogin on another service, you can enter your email and password and skip to step 2.",
                        id: "fqX7jB", // TODO
                        description:
                          "Text for first registration -> create step.",
                      })}
                    </span>
                  </div>
                </InstructionsStepCard>
                <InstructionsStepCard
                  className="rounded-none bg-gray-100/40 dark:bg-gray-600/70"
                  img={{
                    src: canadaLoginStep2b,
                    darkSrc: canadaLoginStep2bDark,
                  }} // TODO: update with correct image
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Enter your first and last name.",
                      id: "FD+jX4", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <div className="mt-4">
                    <span className="text-base font-normal text-gray-500 dark:text-gray-200">
                      {intl.formatMessage({
                        defaultMessage:
                          "The name you use here will be on your GC Digital Talent profile.",
                        id: "8dctGM", // TODO
                        description:
                          "Text for first registration -> create step.",
                      })}
                    </span>
                  </div>
                </InstructionsStepCard>

                <InstructionsStepCard
                  className="rounded-t-none rounded-b-md xs:rounded-l-none xs:rounded-r-md"
                  includeArrow={false}
                  img={{
                    src: canadaLoginStep2c,
                    darkSrc: canadaLoginStep2cDark,
                  }} // TODO: update with correct image
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Verify your personal email address.",
                      id: "Ip9S/o", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <p className="mt-4">
                    {intl.formatMessage({
                      defaultMessage:
                        "Enter the code sent to your email into CanadaLogin.",
                      id: "XLJuh+", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <div className="mt-4">
                    <span className="text-base font-normal text-gray-500 dark:text-gray-200">
                      {intl.formatMessage({
                        defaultMessage:
                          "Using a personal email address will help ensure you don't lose access if you change jobs.",
                        id: "OG/Fbe", // TODO
                        description:
                          "Text for first registration -> create step.",
                      })}
                    </span>
                  </div>
                </InstructionsStepCard>
              </InstructionsCardGrid>
              <InstructionsCardGrid columns={3}>
                <InstructionsStepCard
                  className="rounded-t-md rounded-b-none bg-gray-100/40 xs:rounded-l-md xs:rounded-r-none dark:bg-gray-600/70"
                  img={{
                    src: canadaLoginStep2a,
                    darkSrc: canadaLoginStep2aDark,
                  }} // TODO: update with correct image
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Set up two-step verification.",
                      id: "D/Tcaj", //TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <p className="mt-10">
                    {intl.formatMessage({
                      defaultMessage: "Enter your personal phone number.",
                      id: "XUt7q+", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <div className="mt-6">
                    <span className="text-base font-normal text-gray-500 dark:text-gray-200">
                      {intl.formatMessage({
                        defaultMessage:
                          "Using a personal phone number will help ensure you don't lose access if you change jobs.",
                        id: "QbJmAL", // TODO
                        description:
                          "Text for first registration -> create step.",
                      })}
                    </span>
                  </div>
                </InstructionsStepCard>
                <InstructionsStepCard
                  className="rounded-none"
                  img={{
                    src: canadaLoginStep2a,
                    darkSrc: canadaLoginStep2aDark,
                  }} // TODO: update with correct image
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You will be sent a code to the number you provided.",
                      id: "QU8yQJ", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <p className="mt-4">
                    {intl.formatMessage({
                      defaultMessage: "Enter the code into CanadaLogin.",
                      id: "pTOGhN", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <div className="mt-6">
                    <span className="text-base font-normal text-gray-500 dark:text-gray-200">
                      {intl.formatMessage({
                        defaultMessage:
                          "This code will be sent by either text or phone call, and will expire after ten minutes.",
                        id: "As56gg", // TODO
                        description:
                          "Text for first registration -> create step.",
                      })}
                    </span>
                  </div>
                </InstructionsStepCard>

                <InstructionsStepCard
                  className="rounded-t-none rounded-b-md bg-gray-100/40 xs:rounded-l-none xs:rounded-r-md dark:bg-gray-600/70"
                  includeArrow={false}
                  img={{
                    src: canadaLoginStep2a,
                    darkSrc: canadaLoginStep2aDark,
                  }} // TODO: update with correct image
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "You've successfully created your CanadaLogin.",
                      id: "To1Tf5", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <p className="mt-4">
                    {intl.formatMessage({
                      defaultMessage: "Proceed to step two.",
                      id: "UwU+X9", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                  <div className="mt-6">
                    <span className="text-base font-normal text-gray-500 dark:text-gray-200">
                      {intl.formatMessage({
                        defaultMessage:
                          "CanadaLogin can be used to access various Government of Canada accounts.",
                        id: "LTd4Kw", // TODO
                        description:
                          "Text for first registration -> create step.",
                      })}
                    </span>
                  </div>
                </InstructionsStepCard>
              </InstructionsCardGrid>

              <Heading level="h3" size="h4" className="mt-6 mb-4 font-normal">
                {intl.formatMessage({
                  defaultMessage: "Step 2: Link your GCKey",
                  id: "hvGIMU", // TODO
                  description:
                    "Heading for section of the sign in page showing the create steps",
                })}
              </Heading>

              <InstructionsCardGrid columns={3}>
                <InstructionsStepCard
                  className="rounded-t-md rounded-b-none xs:rounded-l-md xs:rounded-r-none"
                  img={{
                    src: canadaLoginStep2a,
                    darkSrc: canadaLoginStep2aDark,
                  }}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "Sign into your GCKey account.",
                      id: "HtGRCY", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>

                  <div className="mt-4">
                    <span className="text-base font-normal text-gray-500 dark:text-gray-200">
                      {intl.formatMessage({
                        defaultMessage:
                          "This is the username and password you usually sign into GC Digital Talent with.",
                        id: "gZkxYf", // TODO
                        description:
                          "Text for first registration -> create step.",
                      })}
                    </span>
                  </div>
                </InstructionsStepCard>
                <InstructionsStepCard
                  className="rounded-none bg-gray-100/40 dark:bg-gray-600/70"
                  img={{
                    src: canadaLoginStep2b,
                    darkSrc: canadaLoginStep2bDark,
                  }}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Open the authenticator app on your device.",
                      id: "+8iMIo", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                </InstructionsStepCard>

                <InstructionsStepCard
                  className="rounded-t-none rounded-b-md xs:rounded-l-none xs:rounded-r-md"
                  includeArrow={false}
                  img={{
                    src: canadaLoginStep2c,
                    darkSrc: canadaLoginStep2cDark,
                  }}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Enter the code from your authenticator app into GCKey.",
                      id: "+n9I+U", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                </InstructionsStepCard>
              </InstructionsCardGrid>

              <Heading level="h3" size="h4" className="mt-14 mb-4 font-normal">
                {intl.formatMessage({
                  defaultMessage: "Step 3: Access your existing account",
                  id: "GEI2Be", // TODO
                  description:
                    "Heading for section of the signin page showing the create steps",
                })}
              </Heading>
              <InstructionsCardGrid columns={2}>
                <InstructionsStepCard
                  className="rounded-t-md rounded-b-none xs:rounded-l-md xs:rounded-r-none"
                  img={{
                    src: canadaLoginStep3,
                    darkSrc: canadaLoginStep3Dark,
                  }}
                >
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Hooray! You've completed your account transition journey and will be brought back to your GC Digital Talent account.",
                      id: "MmzsE6", // TODO
                      description:
                        "Text for first registration -> create step.",
                    })}
                  </p>
                </InstructionsStepCard>
              </InstructionsCardGrid>

              <Heading
                icon={InformationCircleIcon}
                color="primary"
                level="h3"
                size="h4"
                className="mt-12 font-normal"
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
                className="my-16 mt-8"
              >
                <Accordion.Item value="one">
                  <Accordion.Trigger as="h3"></Accordion.Trigger>
                  <Accordion.Content>
                    <p></p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="two">
                  <Accordion.Trigger as="h3"></Accordion.Trigger>
                  <Accordion.Content>
                    <p className="mb-3"></p>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="three">
                  <Accordion.Trigger as="h3"></Accordion.Trigger>
                  <Accordion.Content>
                    <p></p>
                    <p className="mb-3">
                      <Link
                        color="black"
                        external
                        href="https://login.canada.ca/en/users/contact-us/"
                        // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                        aria-label="Contact CanadaLogin"
                      ></Link>
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
        </Container>
      </>
    );
  }

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
                defaultMessage: "Sign in with GCKey",
                id: "oQNunm",
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
              <Accordion.Item value="two">
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
              <Accordion.Item value="three">
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
              <Accordion.Item value="four">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionExistingAccount)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p className="mb-3">
                    {intl.formatMessage(gckeyMessages.answerExistingAccount)}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="five">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionWhatGCKey)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>{intl.formatMessage(gckeyMessages.answerWhatGCKey)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="six">
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
              <Accordion.Item value="seven">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage(gckeyMessages.questionAuthApp)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>{intl.formatMessage(gckeyMessages.answerAuthApp)}</p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="eight">
                <Accordion.Trigger as="h3">
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
              defaultMessage: "Sign in with GCKey",
              id: "oQNunm",
              description: "GCKey sign in link text on the sign in page",
            })}
          </Link>
          <Link href={paths.register()} mode="inline">
            {intl.formatMessage({
              defaultMessage: "Sign up",
              id: "MFjl68",
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
