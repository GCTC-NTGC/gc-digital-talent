import type { ReactNode } from "react";
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
  Chip,
} from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { RadioGroup } from "@gc-digital-talent/forms";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import InstructionsStepCard, {
  InstructionsCardGrid,
} from "~/components/Instructions/RegisterInstructionStep";
import canadaLoginStep1 from "~/assets/img/canada_login_registration_step_1_light.webp";
import canadaLoginStep1Dark from "~/assets/img/canada_login_registration_step_1_dark.webp";
import canadaLoginStep2b from "~/assets/img/canada_login_registration_step_2_light.webp";
import canadaLoginStep2bDark from "~/assets/img/canada_login_registration_step_2_dark.webp";
import canadaLoginStep2c from "~/assets/img/canada_login_registration_step_3_light.webp";
import canadaLoginStep2cDark from "~/assets/img/canada_login_registration_step_3_dark.webp";
import canadaLoginStep4 from "~/assets/img/canada_login_registration_step_4_light.webp";
import canadaLoginStep4Dark from "~/assets/img/canada_login_registration_step_4_dark.webp";
import canadaLoginStep5 from "~/assets/img/canada_login_registration_step_5_light.webp";
import canadaLoginStep5Dark from "~/assets/img/canada_login_registration_step_5_dark.webp";
import canadaLoginStep6 from "~/assets/img/canada_login_registration_step_6_light.webp";
import canadaLoginStep6Dark from "~/assets/img/canada_login_registration_step_6_dark.webp";
import canadaLoginStep2a from "~/assets/img/canada_login_registration_light_1.webp";
import canadaLoginStep2aDark from "~/assets/img/canada_login_registration_dark_1.webp";
import canadaLoginStep3 from "~/assets/img/canada_login_banner_light.webp";
import canadaLoginStep3Dark from "~/assets/img/canada_login_banner_dark.webp";
import canadaLoginStep3Mobile from "~/assets/img/canada_login_banner_mobile_light.webp";
import canadaLoginStep3MobileDark from "~/assets/img/canada_login_banner_mobile_dark.webp";
import canadaLoginStepAuthenticator from "~/assets/img/canada_login_registration_light_2.webp";
import canadaLoginStepAuthenticatorDark from "~/assets/img/canada_login_registration_dark_2.webp";
import canadaLoginEnterCode from "~/assets/img/canada_login_registration_light_3.webp";
import canadaLoginEnterCodeDark from "~/assets/img/canada_login_registration_dark_3.webp";
import canadaLoginStep1Image from "~/assets/img/sign-in-step-1-light.webp";
import canadaLoginStep1ImageDark from "~/assets/img/sign-in-step-1-dark.webp";
import step1Image from "~/assets/img/canada-login-sign-in-step-1-light.webp";
import canadaLoginStep1bImage from "~/assets/img/sign-in-step-1b-light.webp";
import canadaLoginStep1cImage from "~/assets/img/sign-in-step-1c-light.webp";
import step2Image from "~/assets/img/sign-in-step-2-light.webp";
import step4Image from "~/assets/img/sign-in-step-4-light.webp";
import step1ImageDark from "~/assets/img/canada-login-sign-in-step-1-dark.webp";
import canadaLoginStep1bImageDark from "~/assets/img/sign-in-step-1b-dark.webp";
import canadaLoginStep1cImageDark from "~/assets/img/sign-in-step-1c-dark.webp";
import step2ImageDark from "~/assets/img/sign-in-step-2-dark.webp";
import step3Image from "~/assets/img/sign-in-step-3-light.webp";
import step3ImageDark from "~/assets/img/sign-in-step-3-dark.webp";
import step4ImageDark from "~/assets/img/sign-in-step-4-dark.webp";
import Instructions from "~/components/Instructions";
import gckeyMessages from "~/messages/gckeyMessages";
import canadaLoginMessages from "~/messages/canadaLoginMessages";

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
        defaultMessage: "Sign in using CanadaLogin",
        id: "q9LrNV",
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
        id: "4ljE/r",
        description: "Message displayed to users to sign in to the application",
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
      signInMethod: "gckey",
    },
  });

  const selectedMethod = methods.watch("signInMethod");

  // Fires when a user initiates sign-in, just before the external redirect to
  // the IdP. Shared by both the CanadaLogin and legacy GCKey layouts so the two
  // can't drift apart.
  const trackLoginInitiated = () => {
    if (!appInsights) return;

    appInsights.trackEvent(
      { name: "Auth Login Initiated" },
      {
        aiUserId: appInsights.context?.user?.id,
        pageUrl: window.location.href,
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || "none",
        loginStatus: "initiated",
      },
    );
    // The click triggers a full-page navigation off-site, so flush the buffer
    // to avoid the event being dropped on unload.
    appInsights.flush();
  };

  const InstructionCards = () => {
    if (selectedMethod === "canadaLogin") {
      return (
        <>
          <Heading
            level="h3"
            size="h4"
            className="mt-6 mb-4 text-center font-normal xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Sign into CanadaLogin",
              id: "Q/ROAL",
              description:
                "Heading for section of the sign in page showing the create steps",
            })}
          </Heading>

          <InstructionsCardGrid columns={3}>
            <InstructionsStepCard
              className="rounded-t-md rounded-b-none pt-12 pb-7.5 xs:rounded-l-md xs:rounded-r-none"
              img={{
                src: canadaLoginStep1Image,
                darkSrc: canadaLoginStep1ImageDark,
              }}
            >
              <p className="mt-8 mb-6.75">
                {intl.formatMessage({
                  defaultMessage: "Sign in with your CanadaLogin email.",
                  id: "IVba2H",
                  description: "Text for first registration -> create step.",
                })}
              </p>
            </InstructionsStepCard>
            <InstructionsStepCard
              className="rounded-none pt-12 pb-7.5"
              background="darker"
              img={{
                src: canadaLoginStep1bImage,
                darkSrc: canadaLoginStep1bImageDark,
              }}
            >
              <p className="mt-8 mb-6.75">
                {intl.formatMessage({
                  defaultMessage: "Enter your CanadaLogin password.",
                  id: "JsPXch",
                  description: "Text for first registration -> create step.",
                })}
              </p>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="rounded-t-none rounded-b-md pt-12 pb-7.5 xs:rounded-l-none xs:rounded-r-md"
              includeArrow={false}
              img={{
                src: canadaLoginStep1cImage,
                darkSrc: canadaLoginStep1cImageDark,
              }}
            >
              <p className="mt-8 mb-6.75">
                {intl.formatMessage({
                  defaultMessage: "Enter the six-digit code from your phone.",
                  id: "DcABwS",
                  description: "Text for first registration -> create step.",
                })}
              </p>
            </InstructionsStepCard>
          </InstructionsCardGrid>

          <Heading
            level="h3"
            size="h4"
            className="mt-18 mb-3.5 text-center font-normal xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Access your existing account",
              id: "1OOvpY",
              description:
                "Heading for section of the signin page showing the create steps",
            })}
          </Heading>
          <InstructionsCardGrid columns={1}>
            <InstructionsStepCard
              className="rounded-t-md rounded-b-none xs:rounded-l-md xs:rounded-r-none lg:p-10"
              img={{
                src: canadaLoginStep3,
                darkSrc: canadaLoginStep3Dark,
                sources: {
                  xxs: canadaLoginStep3Mobile,
                },
                darkSources: {
                  xxs: canadaLoginStep3MobileDark,
                },
                className: "xxs:max-w-[400px] sm:max-w-[700px] mx-auto w-full",
                width: 700,
                height: 200,
              }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Hooray! You've signed in with CanadaLogin and will be returned to the GC Digital Talent platform.",
                  id: "jOjLtT",
                  description: "Text for first registration -> create step.",
                })}
              </p>
            </InstructionsStepCard>
          </InstructionsCardGrid>
        </>
      );
    } else if (selectedMethod === "gckey") {
      return (
        <>
          <Heading
            color="primary"
            level="h3"
            className="mt-6 justify-center font-normal xs:justify-start"
            icon={MapIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Your account transition journey",
              id: "2b7CQ/",
              description:
                "Heading for the account transition journey section on the sign in page",
            })}
          </Heading>
          <Heading
            level="h4"
            size="h4"
            className="mt-13.5 mb-3.5 text-center font-normal xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Step 1: Create a CanadaLogin or sign in",
              id: "p2LOIV",
              description:
                "Heading for section of the sign in page showing the create steps",
            })}
          </Heading>

          <InstructionsCardGrid columns={6}>
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
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="rounded-none pt-12 pb-7.5"
              background="darker"
              img={{
                src: canadaLoginStep2b,
                darkSrc: canadaLoginStep2bDark,
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
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="rounded-t-none rounded-b-md pt-12 pb-7.5 xs:rounded-l-none xs:rounded-r-md"
              includeArrow={false}
              img={{
                src: canadaLoginStep2c,
                darkSrc: canadaLoginStep2cDark,
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
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="!rounded-t-none !rounded-b-none rounded-b-md pt-12 pb-7.5 xs:rounded-l-md xs:rounded-r-none"
              background="darker"
              img={{
                src: canadaLoginStep4,
                darkSrc: canadaLoginStep4Dark,
              }}
            >
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

              <div className="mt-2 mb-6.75">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-100">
                  {intl.formatMessage({
                    defaultMessage:
                      "Using a personal phone number will help ensure you don't lose access if you change jobs.",
                    id: "QbJmAL",
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>
            <InstructionsStepCard
              className="rounded-none pt-12 pb-7.5"
              img={{
                src: canadaLoginStep5,
                darkSrc: canadaLoginStep5Dark,
              }}
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
              className="!rounded-t-none rounded-b-md pt-12 pb-7.5 xs:rounded-l-none xs:rounded-r-md"
              background="darker"
              includeArrow={false}
              img={{
                src: canadaLoginStep6,
                darkSrc: canadaLoginStep6Dark,
              }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "You've successfully created your CanadaLogin.",
                  id: "To1Tf5",
                  description: "Text for first registration -> create step.",
                })}
              </p>
              <p className="mt-4">
                {intl.formatMessage({
                  defaultMessage: "Proceed to step two.",
                  id: "UwU+X9",
                  description: "Text for first registration -> create step.",
                })}
              </p>

              <div className="mt-2 mb-6.75">
                <span className="text-sm font-normal text-gray-600 dark:text-gray-100">
                  {intl.formatMessage({
                    defaultMessage:
                      "CanadaLogin can be used to access various Government of Canada accounts.",
                    id: "LTd4Kw",
                    description: "Text for first registration -> create step.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>
          </InstructionsCardGrid>

          <Heading
            level="h4"
            size="h4"
            className="mt-18 mb-3.5 text-center font-normal xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Step 2: Link your GCKey",
              id: "hvGIMU",
              description:
                "Heading for section of the sign in page showing the create steps",
            })}
          </Heading>

          <InstructionsCardGrid columns={3}>
            <InstructionsStepCard
              className="rounded-t-md rounded-b-none pt-12 pb-7.5 xs:rounded-l-md xs:rounded-r-none"
              img={{
                src: canadaLoginStep2a,
                darkSrc: canadaLoginStep2aDark,
              }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage: "Sign into your GCKey account.",
                  id: "KCQ2es",
                  description: "Text for step two link your GCKey account.",
                })}
              </p>

              <div className="mt-2 mb-6.75">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-100">
                  {intl.formatMessage({
                    defaultMessage:
                      "This is the username and password you usually sign into GC Digital Talent with.",
                    id: "+2z44i",
                    description: "Text for step two link your GCKey account.",
                  })}
                </span>
              </div>
            </InstructionsStepCard>
            <InstructionsStepCard
              className="rounded-none pt-12 pb-15"
              background="darker"
              img={{
                src: canadaLoginStepAuthenticator,
                darkSrc: canadaLoginStepAuthenticatorDark,
              }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage: "Open the authenticator app on your device.",
                  id: "jh/UHf",
                  description: "Text for step two link your GCKey account.",
                })}
              </p>
            </InstructionsStepCard>

            <InstructionsStepCard
              className="rounded-t-none rounded-b-md pt-12 pb-15 xs:rounded-l-none xs:rounded-r-md"
              includeArrow={false}
              img={{
                src: canadaLoginEnterCode,
                darkSrc: canadaLoginEnterCodeDark,
              }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Enter the code from your authenticator app into GCKey.",
                  id: "HzvS7w",
                  description: "Text for step two link your GCKey account.",
                })}
              </p>
            </InstructionsStepCard>
          </InstructionsCardGrid>

          <Heading
            level="h4"
            size="h4"
            className="mt-13.5 mb-3.5 text-center font-normal xs:text-left"
          >
            {intl.formatMessage({
              defaultMessage: "Step 3: Access your existing account",
              id: "pNA402",
              description:
                "Heading for section of the signin page showing the access steps",
            })}
          </Heading>
          <InstructionsCardGrid columns={1}>
            <InstructionsStepCard
              className="rounded-md lg:p-10"
              img={{
                src: canadaLoginStep3,
                darkSrc: canadaLoginStep3Dark,
                sources: {
                  xxs: canadaLoginStep3Mobile,
                },
                darkSources: {
                  xxs: canadaLoginStep3MobileDark,
                },
                className: "xxs:max-w-[400px] sm:max-w-[700px] mx-auto w-full",
                width: 700,
                height: 200,
              }}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Hooray! You've completed your account transition journey and will be brought back to your GC Digital Talent account.",
                  id: "MmzsE6",
                  description: "Text for first registration -> create step.",
                })}
              </p>
            </InstructionsStepCard>
          </InstructionsCardGrid>
        </>
      );
    }
    return null;
  };

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
                  defaultMessage: "Welcome back",
                  id: "nmBkRg",
                  description: "Welcome heading at the top of the sign in page",
                })}
              </Heading>
              <p className="pt-2 pl-2 font-normal">
                {intl.formatMessage({
                  defaultMessage:
                    "We're upgrading from GCKey sign in experience to the government's new central account system called CanadaLogin.",
                  id: "OgTBmm",
                  description:
                    "Copy under welcome heading at the top of the sign in page",
                })}
              </p>
              <p className="pt-4 pl-2 font-normal">
                {intl.formatMessage({
                  defaultMessage:
                    "You'll be leaving our site to sign in with CanadaLogin. If anything goes wrong, we have prepared additional guidance for you.",
                  id: "vC8yrC",
                  description:
                    "Copy under welcome heading at the top of the sign in page",
                })}
              </p>

              <p className="pt-6 pl-2 font-normal">
                {intl.formatMessage({
                  defaultMessage: "How did you last sign in?",
                  id: "CIDrn4",
                  description:
                    "Heading for the section asking users how they last signed in on the sign in page",
                })}
              </p>

              <div className="p-2">
                <FormProvider {...methods}>
                  <RadioGroup
                    idPrefix="signin-method"
                    name="signInMethod"
                    legend=""
                    columns={1}
                    trackUnsaved={false}
                    items={[
                      {
                        value: "canadaLogin",
                        label: (
                          <div className="flex-col gap-2 xxs:flex-row xxs:items-center">
                            <span className="mr-2">
                              {intl.formatMessage({
                                defaultMessage: "CanadaLogin",
                                id: "t0iSsj",
                                description: "CanadaLogin sign in method label",
                              })}
                            </span>
                            <Chip color="primary" icon={SparklesIcon}>
                              <span>
                                {intl.formatMessage({
                                  defaultMessage: "New",
                                  id: "N0zaCd",
                                  description:
                                    "Chip label for CanadaLogin option",
                                })}
                              </span>
                            </Chip>
                          </div>
                        ),

                        contentBelow: (
                          <p className="font-normal text-gray-500 dark:text-gray-100">
                            {intl.formatMessage({
                              defaultMessage:
                                "You have signed in recently and created a CanadaLogin account using your email",
                              id: "wxXlyJ",
                              description:
                                "Message shown under CanadaLogin option on sign in page",
                            })}
                          </p>
                        ),
                      },
                      {
                        value: "gckey",
                        label: (
                          <span className="mr-2">
                            {intl.formatMessage({
                              defaultMessage: "GCKey",
                              id: "o6FC2W",
                              description: "GCKey sign in method label",
                            })}
                          </span>
                        ),
                        contentBelow: (
                          <p className="font-normal text-gray-500 dark:text-gray-100">
                            {intl.formatMessage({
                              defaultMessage:
                                "Your last sign in was before June 2026 and used a GCKey username",
                              id: "yE/lOi",
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
            {selectedMethod && (
              <div className="px-4">
                <Notice.Root
                  mode="inline"
                  color={selectedMethod === "gckey" ? "warning" : "gray"}
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
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        <li>
                          {intl.formatMessage({
                            defaultMessage: "Create a CanadaLogin account",
                            id: "faKH/0",
                            description: "First note about GCKey migration",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "Link your GCKey to your CanadaLogin",
                            id: "B+y8nm",
                            description: "Second note about GCKey migration",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "Continue signing into GC Digital Talent",
                            id: "Ftr7tt",
                            description: "Third note about GCKey migration",
                          })}
                        </li>
                      </ul>
                    )}
                  </Notice.Content>
                </Notice.Root>
              </div>
            )}
            <div className="mt-6 flex w-full flex-col items-center gap-6 px-4.5 xs:flex-row xs:justify-start">
              <Link
                href={loginPath}
                mode="solid"
                color="primary"
                utilityIcon={ChevronDoubleRightIcon}
                external
                onClick={trackLoginInitiated}
              >
                {selectedMethod === "canadaLogin"
                  ? intl.formatMessage({
                      defaultMessage: "Proceed to CanadaLogin",
                      id: "KorMJQ",
                      description:
                        "CanadaLogin sign up link text on the registration page",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Get started",
                      id: "ci28W3",
                      description:
                        "CanadaLogin sign up link text on the sign in page",
                    })}
              </Link>
              <p>
                <Link
                  href="#registrationInstructions"
                  mode="inline"
                  external
                  color="warning"
                >
                  {intl.formatMessage({
                    defaultMessage: "I need help",
                    id: "+G1WRn",
                    description:
                      "Heading for the instructions resource block on the sign in page",
                  })}
                </Link>
              </p>
            </div>
          </div>
        </Hero>

        <Container className="my-10">
          <div id="registrationInstructions" className="scroll-mt-20">
            <InstructionCards />

            <Heading
              icon={InformationCircleIcon}
              color="primary"
              level="h3"
              size="h4"
              className="mt-20 mb-5 justify-center font-normal xs:justify-start"
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
                  {intl.formatMessage(
                    canadaLoginMessages.signInWithCanadaLogin,
                  )}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p className="mb-3">
                    {intl.formatMessage(
                      canadaLoginMessages.answerSignInWithCanadaLogin1,
                    )}
                  </p>
                  <p className="mb-3">
                    {intl.formatMessage(
                      canadaLoginMessages.answerSignInWithCanadaLogin2,
                    )}
                  </p>
                  <p className="mb-3">
                    {intl.formatMessage(
                      canadaLoginMessages.answerSignInWithCanadaLogin3,
                    )}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="two">
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

              <Accordion.Item value="three">
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
              <Accordion.Item value="four">
                <Accordion.Trigger as="h4">
                  {intl.formatMessage(canadaLoginMessages.whatIsCanadaLogin)}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage(
                      canadaLoginMessages.whatIsCanadaLoginAnswer,
                    )}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="five">
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
            <p className="mt-6">
              {intl.formatMessage(gckeyMessages.moreQuestions, {
                helpLink: (chunks: ReactNode) =>
                  helpLink(chunks, paths.support()),
              })}
            </p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} />
      <Container className="my-18">
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
          onClick={trackLoginInitiated}
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
              {intl.formatMessage(gckeyMessages.questionExistingAccount)}
            </Accordion.Trigger>
            <Accordion.Content>
              <p className="mb-3">
                {intl.formatMessage(gckeyMessages.answerExistingAccount)}
              </p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="two">
            <Accordion.Trigger as="h3">
              {intl.formatMessage(gckeyMessages.questionWhatGCKey)}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>{intl.formatMessage(gckeyMessages.answerWhatGCKey)}</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="three">
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
          <Accordion.Item value="four">
            <Accordion.Trigger as="h3">
              {intl.formatMessage(gckeyMessages.questionAuthApp)}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>{intl.formatMessage(gckeyMessages.answerAuthApp)}</p>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="five">
            <Accordion.Trigger as="h3">
              {intl.formatMessage(gckeyMessages.questionAuthAlternative)}
            </Accordion.Trigger>
            <Accordion.Content>
              <p>{intl.formatMessage(gckeyMessages.answerAuthAlternative)}</p>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        <p className="mt-6">
          {intl.formatMessage(gckeyMessages.moreQuestions, {
            helpLink: (chunks: ReactNode) => helpLink(chunks, paths.support()),
          })}
        </p>
        <Separator />
        <div className="flex items-center gap-6">
          <Link
            href={loginPath}
            mode="solid"
            color="primary"
            external
            onClick={trackLoginInitiated}
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
