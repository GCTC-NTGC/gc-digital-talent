import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import ChevronDoubleRightIcon from "@heroicons/react/24/solid/ChevronDoubleRightIcon";

import { appInsights } from "@gc-digital-talent/app-insights";
import { Accordion, Container, Heading, Link } from "@gc-digital-talent/ui";
import { useApiRoutes } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import InstructionsStepCard, {
  InstructionsCardGrid,
} from "~/components/Instructions/RegisterInstructionStep";
import canadaLoginStep3 from "~/assets/img/canada_login_banner_light.webp";
import canadaLoginStep3Dark from "~/assets/img/canada_login_banner_dark.webp";
import canadaLoginStep3Mobile from "~/assets/img/canada_login_banner_mobile_light.webp";
import canadaLoginStep3MobileDark from "~/assets/img/canada_login_banner_mobile_dark.webp";
import canadaLoginStep1Image from "~/assets/img/sign-in-step-1-light.webp";
import canadaLoginStep1ImageDark from "~/assets/img/sign-in-step-1-dark.webp";
import canadaLoginStep1bImage from "~/assets/img/sign-in-step-1b-light.webp";
import canadaLoginStep1cImage from "~/assets/img/sign-in-step-1c-light.webp";
import canadaLoginStep1bImageDark from "~/assets/img/sign-in-step-1b-dark.webp";
import canadaLoginStep1cImageDark from "~/assets/img/sign-in-step-1c-dark.webp";
import gckeyMessages from "~/messages/gckeyMessages";
import canadaLoginMessages from "~/messages/canadaLoginMessages";

const helpLink = (chunks: ReactNode, path: string) => (
  <Link href={path} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
);

const InstructionCards = () => {
  const intl = useIntl();
  return (
    <>
      <Heading
        rank="h3"
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
        rank="h3"
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
};

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const apiPaths = useApiRoutes();
  const [searchParams] = useSearchParams();
  const fromPath = searchParams.get("from");
  const fallbackPath = paths.applicantDashboard();
  const loginPath = apiPaths.login(fromPath ?? fallbackPath, getLocale(intl));

  const pageTitle = intl.formatMessage({
    defaultMessage: "Sign in using CanadaLogin",
    id: "q9LrNV",
    description: "Page title for the sign in page using CanadaLogin",
  });
  const breadcrumbLabel = intl.formatMessage({
    defaultMessage: "Sign in",
    id: "4ljE/r",
    description: "Message displayed to users to sign in to the application",
  });
  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: breadcrumbLabel,
        url: paths.login(),
      },
    ],
  });

  // Fires when a user initiates sign-in, just before the external redirect to
  // the IdP. Shared by both the CanadaLogin and legacy GCKey layouts so the two
  // can't drift apart.
  const trackLoginInitiated = () => {
    if (!appInsights) return;

    const aiUserId = appInsights?.context?.user?.id || "unknown";

    appInsights.trackEvent(
      { name: "Auth Login Initiated" },
      {
        aiUserId,
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
    void appInsights.flush();
  };

  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={crumbs} overlap={true} centered={true}>
        <div className="mt-0 rounded-md bg-white px-6 py-12 shadow-sm sm:mt-10 dark:bg-gray-600">
          <div className="px-2">
            <Heading
              rank="h2"
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
            <p className="pt-4 pl-2 font-normal">
              {intl.formatMessage({
                defaultMessage:
                  "You'll be leaving our site to sign in with CanadaLogin. If anything goes wrong, we have prepared additional guidance for you.",
                id: "vC8yrC",
                description:
                  "Copy under welcome heading at the top of the sign in page",
              })}
            </p>
          </div>

          <div className="mt-6 flex w-full flex-col items-center gap-6 px-4.5 xs:flex-row xs:justify-start">
            <Link
              href={loginPath}
              mode="solid"
              color="primary"
              utilityIcon={ChevronDoubleRightIcon}
              external
              onClick={trackLoginInitiated}
            >
              {intl.formatMessage({
                defaultMessage: "Proceed to CanadaLogin",
                id: "KorMJQ",
                description:
                  "CanadaLogin sign up link text on the registration page",
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
            rank="h3"
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
            <Accordion.Item value="two">
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
                {intl.formatMessage({
                  defaultMessage:
                    "What do I do if I last signed in with GCKey and missed the migration window?",
                  id: "8h6hJc",
                  description: "FAQ title about missing the migration window",
                })}
              </Accordion.Trigger>
              <Accordion.Content>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "If you previously signed in with GCKey, you'll be given the option to link your existing account to your new sign-in method. If the email address and phone number in your CanadaLogin account match the information in your GC Digital Talent profile, your existing profile will be linked automatically. If we are unable to find a matching profile, please proceed with your new CanadaLogin account.",
                    id: "89pnS1",
                    description:
                      "FAQ message about missing the migration window",
                  })}
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
};

Component.displayName = "SignInPage";

export default Component;
